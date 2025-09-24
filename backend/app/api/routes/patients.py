from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user, require_role
from app.crud import patient as patient_crud
from app.db.session import get_db
from app.models.user import User, UserRole
from app.schemas.patient import (
    PatientCreate,
    PatientRead,
    PatientUpdate,
    PatientsListResponse,
)

router = APIRouter(prefix="/patients", tags=["patients"])


@router.get("", response_model=PatientsListResponse)
async def list_patients(
    skip: int = 0,
    limit: Annotated[int, Query(le=100)] = 50,
    name: str | None = Query(default=None, description="Filter by patient name"),
    start_date: date | None = Query(default=None, description="Filter visit date >= start_date"),
    end_date: date | None = Query(default=None, description="Filter visit date <= end_date"),
    db: Annotated[Session, Depends(get_db)] = None,
    _: Annotated[User, Depends(get_current_user)] = None,
) -> PatientsListResponse:
    patients, total = patient_crud.list_patients(
        db,
        skip=skip,
        limit=limit,
        name=name,
        start_date=start_date,
        end_date=end_date,
    )
    return PatientsListResponse(items=patients, total=total)


@router.get("/{patient_id}", response_model=PatientRead)
async def get_patient(
    patient_id: int,
    db: Annotated[Session, Depends(get_db)] = None,
    _: Annotated[User, Depends(get_current_user)] = None,
) -> PatientRead:
    patient = patient_crud.get_patient(db, patient_id)
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")
    return PatientRead.model_validate(patient)


@router.post("", response_model=PatientRead, status_code=status.HTTP_201_CREATED)
async def create_patient(
    payload: PatientCreate,
    db: Annotated[Session, Depends(get_db)] = None,
    _: Annotated[User, Depends(require_role(UserRole.DOKTER))] = None,
) -> PatientRead:
    patient = patient_crud.create_patient(db, payload)
    return PatientRead.model_validate(patient)


@router.put("/{patient_id}", response_model=PatientRead)
async def update_patient(
    patient_id: int,
    payload: PatientUpdate,
    db: Annotated[Session, Depends(get_db)] = None,
    _: Annotated[User, Depends(require_role(UserRole.DOKTER))] = None,
) -> PatientRead:
    patient = patient_crud.get_patient(db, patient_id)
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")
    updated = patient_crud.update_patient(db, patient, payload)
    return PatientRead.model_validate(updated)


@router.delete("/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_patient(
    patient_id: int,
    db: Annotated[Session, Depends(get_db)] = None,
    _: Annotated[User, Depends(require_role(UserRole.DOKTER))] = None,
) -> None:
    patient = patient_crud.get_patient(db, patient_id)
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")
    patient_crud.delete_patient(db, patient)
