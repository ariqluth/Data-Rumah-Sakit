from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.auth.dependencies import require_role
from app.crud import patient as patient_crud
from app.db.session import get_db
from app.models.user import User, UserRole
from app.schemas.integration import ImportPatientsRequest

router = APIRouter(prefix="/integrations", tags=["integrations"])


@router.post("/patients/import", status_code=status.HTTP_201_CREATED)
async def import_patients(
    payload: ImportPatientsRequest,
    db: Annotated[Session, Depends(get_db)] = None,
    _: Annotated[User, Depends(require_role(UserRole.DOKTER))] = None,
) -> dict[str, int]:
    patient_creates = payload.to_patient_creates()
    created = patient_crud.bulk_create_patients(db, patient_creates)
    return {"imported": len(created)}
