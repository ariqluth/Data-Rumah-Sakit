from pydantic import BaseModel, EmailStr

from app.models.user import UserRole


class UserBase(BaseModel):
    auth0_id: str
    email: EmailStr
    full_name: str | None = None
    role: UserRole


class UserCreate(UserBase):
    pass


class UserRead(UserBase):
    id: int

    model_config = {"from_attributes": True}


class UserRoleUpdate(BaseModel):
    role: UserRole
