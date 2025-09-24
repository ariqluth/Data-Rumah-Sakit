from fastapi import APIRouter

from .integrations import router as integrations_router
from .patients import router as patients_router
from .reports import router as reports_router
from .users import router as users_router

api_router = APIRouter()
api_router.include_router(users_router)
api_router.include_router(patients_router)
api_router.include_router(reports_router)
api_router.include_router(integrations_router)
