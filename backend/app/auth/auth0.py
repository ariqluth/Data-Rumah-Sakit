import logging
import time
from typing import Any, Dict

import requests
from fastapi import HTTPException, status
from jose import jwt

from app.core.config import get_settings

logger = logging.getLogger(__name__)


class Auth0TokenVerifier:
    def __init__(self) -> None:
        self.settings = get_settings()
        self._jwks: list[dict[str, Any]] | None = None
        self._jwks_last_fetched: float = 0.0

    @property
    def jwks_url(self) -> str:
        domain = self.settings.auth0_domain.rstrip("/")
        return f"https://{domain}/.well-known/jwks.json"

    def _refresh_jwks(self) -> None:
        logger.debug("Fetching JWKS from %s", self.jwks_url)
        response = requests.get(self.jwks_url, timeout=5)
        response.raise_for_status()
        jwks = response.json().get("keys", [])
        if not jwks:
            raise RuntimeError("Auth0 JWKS response did not include keys")
        self._jwks = jwks
        self._jwks_last_fetched = time.time()

    def _get_jwks(self) -> list[dict[str, Any]]:
        if not self._jwks or time.time() - self._jwks_last_fetched > 3600:
            self._refresh_jwks()
        assert self._jwks is not None
        return self._jwks

    def verify_token(self, token: str) -> Dict[str, Any]:
        try:
            unverified_header = jwt.get_unverified_header(token)
        except jwt.JWTError as exc:  # pragma: no cover - invalid tokens rejected
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authorization header") from exc

        jwks = self._get_jwks()
        rsa_key = next((
            {
                "kty": key["kty"],
                "kid": key["kid"],
                "use": key["use"],
                "n": key["n"],
                "e": key["e"],
            }
            for key in jwks
            if key.get("kid") == unverified_header.get("kid")
        ), None)

        if not rsa_key:
            logger.warning("No matching JWKS key found for kid %s", unverified_header.get("kid"))
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token signature")

        try:
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=self.settings.auth0_algorithms,
                audience=self.settings.auth0_audience,
                issuer=self.settings.issuer,
            )
        except jwt.ExpiredSignatureError as exc:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired") from exc
        except jwt.JWTClaimsError as exc:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token claims") from exc
        except Exception as exc:  # pragma: no cover - catch-all for jose errors
            logger.exception("Failed to decode token")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials") from exc

        return payload


def get_token_payload(token: str) -> Dict[str, Any]:
    verifier = Auth0TokenVerifier()
    return verifier.verify_token(token)
