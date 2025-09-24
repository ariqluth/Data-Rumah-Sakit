from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import api_router
from app.core.config import get_settings
from app.db import base  
from app.db.session import Base, engine


def create_app() -> FastAPI:
    settings = get_settings()
    application = FastAPI(title="Rumah Sakit API", version="1.0.0")

    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.backend_cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @application.on_event("startup")
    def on_startup() -> None:
        Base.metadata.create_all(bind=engine)

    application.include_router(api_router, prefix="/api")

    @application.get("/health")
    async def health_check() -> dict[str, str]:
        return {"status": "ok"}

    return application


app = create_app()
