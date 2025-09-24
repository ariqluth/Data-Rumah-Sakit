from collections.abc import Callable
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.auth.auth0 import get_token_payload
from app.core.config import get_settings
from app.crud.user import upsert_user
from app.db.session import get_db
from app.models.user import User, UserRole

bearer_scheme = HTTPBearer(auto_error=False)


def _extract_role(claims: dict) -> UserRole:
    settings = get_settings()
    role_claim = claims.get(settings.auth0_custom_role_claim)
    if isinstance(role_claim, list) and role_claim:
        candidate = role_claim[0]
    elif isinstance(role_claim, str):
        candidate = role_claim
    else:
        candidate = settings.default_role

    try:
        return UserRole(candidate)
    except ValueError:
        return UserRole(settings.default_role)


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
    db: Annotated[Session, Depends(get_db)],
) -> User:
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authorization header missing")

    token = credentials.credentials
    claims = get_token_payload(token)

    sub = claims.get("sub")
    email = claims.get("email")
    if not sub or not email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token missing subject or email")

    full_name = claims.get("name")
    role = _extract_role(claims)
    user = upsert_user(db, auth0_id=sub, email=email, full_name=full_name, role=role)
    return user


def require_role(*allowed_roles: UserRole) -> Callable[[User], User]:
    allowed = {role.value if isinstance(role, UserRole) else role for role in allowed_roles}

    async def dependency(current_user: Annotated[User, Depends(get_current_user)]) -> User:
        if allowed and current_user.role.value not in allowed:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
        return current_user

    return dependency
