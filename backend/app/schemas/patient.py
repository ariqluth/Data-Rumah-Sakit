from datetime import date
from typing import List

from pydantic import BaseModel


class PatientBase(BaseModel):
    name: str
    tanggal_lahir: date
    tanggal_kunjungan: date
    diagnosis: str
    tindakan: str
    dokter: str


class PatientCreate(PatientBase):
    pass


class PatientUpdate(BaseModel):
    name: str | None = None
    tanggal_lahir: date | None = None
    tanggal_kunjungan: date | None = None
    diagnosis: str | None = None
    tindakan: str | None = None
    dokter: str | None = None


class PatientRead(PatientBase):
    id: int

    model_config = {"from_attributes": True}


class PatientsListResponse(BaseModel):
    items: List[PatientRead]
    total: int


class PatientSummary(BaseModel):
    total_patients: int
    total_today: int


class PatientReport(BaseModel):
    patients: List[PatientRead]
    summary: PatientSummary
