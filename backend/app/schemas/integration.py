from datetime import date
from typing import List

from pydantic import BaseModel, Field

from app.schemas.patient import PatientCreate


class PatientImportItem(BaseModel):
    name: str
    tanggal_kunjungan: date
    tanggal_lahir: date | None = Field(default=None, description="Optional birth date")
    diagnosis: str | None = Field(default=None, description="Optional diagnosis")
    tindakan: str | None = Field(default=None, description="Optional treatment")
    dokter: str | None = Field(default=None, description="Optional doctor name")


class ImportPatientsRequest(BaseModel):
    patients: List[PatientImportItem]

    def to_patient_creates(self) -> List[PatientCreate]:
        return [
            PatientCreate(
                name=item.name,
                tanggal_kunjungan=item.tanggal_kunjungan,
                tanggal_lahir=item.tanggal_lahir or item.tanggal_kunjungan,
                diagnosis=item.diagnosis or "Belum ada diagnosis",
                tindakan=item.tindakan or "Belum ada tindakan",
                dokter=item.dokter or "Belum ditugaskan",
            )
            for item in self.patients
        ]
