from datetime import date
from io import BytesIO
from typing import Annotated

from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from openpyxl import Workbook
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.crud import patient as patient_crud
from app.db.session import get_db
from app.models.user import User
from app.schemas.patient import PatientRead, PatientReport, PatientSummary

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/patients", response_model=PatientReport)
async def patient_report(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    name: str | None = Query(default=None),
    db: Annotated[Session, Depends(get_db)] = None,
    _: Annotated[User, Depends(get_current_user)] = None,
) -> PatientReport:
    patients, _ = patient_crud.list_patients(
        db,
        skip=0,
        limit=500,
        name=name,
        start_date=start_date,
        end_date=end_date,
    )
    summary_counts = patient_crud.get_summary(db, start_date=start_date, end_date=end_date)
    summary = PatientSummary(**summary_counts)
    patient_models = [PatientRead.model_validate(p) for p in patients]
    return PatientReport(patients=patient_models, summary=summary)


@router.get("/patients/export")
async def export_patients_excel(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    name: str | None = Query(default=None),
    db: Annotated[Session, Depends(get_db)] = None,
    _: Annotated[User, Depends(get_current_user)] = None,
) -> StreamingResponse:
    patients, _ = patient_crud.list_patients(
        db,
        skip=0,
        limit=1000,
        name=name,
        start_date=start_date,
        end_date=end_date,
    )

    wb = Workbook()
    ws = wb.active
    ws.title = "Patients"
    headers = ["ID", "Nama", "Tanggal Lahir", "Tanggal Kunjungan", "Diagnosis", "Tindakan", "Dokter"]
    ws.append(headers)
    for patient in patients:
        ws.append(
            [
                patient.id,
                patient.name,
                patient.tanggal_lahir.isoformat(),
                patient.tanggal_kunjungan.isoformat(),
                patient.diagnosis,
                patient.tindakan,
                patient.dokter,
            ]
        )

    stream = BytesIO()
    wb.save(stream)
    stream.seek(0)

    filename = "patients-report.xlsx"
    headers_response = {"Content-Disposition": f"attachment; filename={filename}"}
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers=headers_response,
    )
