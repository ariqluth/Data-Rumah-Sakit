from enum import Enum

from sqlalchemy import Column, Enum as SQLEnum, Integer, String

from app.db.session import Base


class UserRole(str, Enum):
    ADMIN = "admin"
    DOKTER = "dokter"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    auth0_id = Column(String, unique=True, nullable=False, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    full_name = Column(String, nullable=True)
    role = Column(SQLEnum(UserRole, name="user_role"), nullable=False, default=UserRole.ADMIN)

    def update_role(self, new_role: str) -> None:
        try:
            self.role = UserRole(new_role)
        except ValueError as exc: 
            raise ValueError(f"Invalid role: {new_role}") from exc
