from sqlalchemy import Column, Date, DateTime, Integer, String, func

from app.db.session import Base


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    tanggal_lahir = Column(Date, nullable=False)
    tanggal_kunjungan = Column(Date, nullable=False)
    diagnosis = Column(String(255), nullable=False)
    tindakan = Column(String(255), nullable=False)
    dokter = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
