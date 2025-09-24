from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str
    auth0_domain: str
    auth0_audience: str
    auth0_issuer: str | None = None
    auth0_algorithms: List[str] = ["RS256"]
    auth0_custom_role_claim: str = "https://example.com/roles"
    default_role: str = "admin"
    backend_cors_origins: List[str] = ["http://localhost:5173"]

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @property
    def issuer(self) -> str:
        if self.auth0_issuer:
            return self.auth0_issuer
        domain = self.auth0_domain.rstrip("/")
        return f"https://{domain}/"


@lru_cache
def get_settings() -> Settings:
    return Settings()
