from datetime import date
from typing import Iterable, Sequence

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.patient import Patient
from app.schemas.patient import PatientCreate, PatientUpdate


def create_patient(db: Session, patient_in: PatientCreate) -> Patient:
    patient = Patient(**patient_in.model_dump())
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient


def bulk_create_patients(db: Session, patients_in: Iterable[PatientCreate]) -> Sequence[Patient]:
    patients = [Patient(**patient.model_dump()) for patient in patients_in]
    db.add_all(patients)
    db.commit()
    for patient in patients:
        db.refresh(patient)
    return patients


def get_patient(db: Session, patient_id: int) -> Patient | None:
    return db.query(Patient).filter(Patient.id == patient_id).first()


def delete_patient(db: Session, patient: Patient) -> None:
    db.delete(patient)
    db.commit()


def update_patient(db: Session, patient: Patient, updates: PatientUpdate) -> Patient:
    update_data = updates.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(patient, field, value)
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient


def list_patients(
    db: Session,
    *,
    skip: int = 0,
    limit: int = 100,
    name: str | None = None,
    start_date: date | None = None,
    end_date: date | None = None,
):
    query = db.query(Patient)

    if name:
        like_pattern = f"%{name}%"
        query = query.filter(Patient.name.ilike(like_pattern))
    if start_date:
        query = query.filter(Patient.tanggal_kunjungan >= start_date)
    if end_date:
        query = query.filter(Patient.tanggal_kunjungan <= end_date)

    total = query.count()
    items = (
        query.order_by(Patient.tanggal_kunjungan.desc(), Patient.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return items, total


def get_summary(db: Session, *, start_date: date | None = None, end_date: date | None = None) -> dict[str, int]:
    query = db.query(Patient)
    if start_date:
        query = query.filter(Patient.tanggal_kunjungan >= start_date)
    if end_date:
        query = query.filter(Patient.tanggal_kunjungan <= end_date)
    total = query.count()

    today = date.today()
    today_query = query.filter(Patient.tanggal_kunjungan == today)
    total_today = today_query.count()
    return {"total_patients": total, "total_today": total_today}
