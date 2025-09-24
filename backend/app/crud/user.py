from sqlalchemy.orm import Session

from app.models.user import User, UserRole
from app.schemas.user import UserCreate


def get_user_by_auth0_id(db: Session, auth0_id: str) -> User | None:
    return db.query(User).filter(User.auth0_id == auth0_id).first()


def create_user(db: Session, user_in: UserCreate) -> User:
    user = User(
        auth0_id=user_in.auth0_id,
        email=user_in.email,
        full_name=user_in.full_name,
        role=user_in.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user_role(db: Session, user: User, role: UserRole) -> User:
    user.role = role
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def upsert_user(
    db: Session,
    *,
    auth0_id: str,
    email: str,
    full_name: str | None,
    role: UserRole,
) -> User:
    user = get_user_by_auth0_id(db, auth0_id)
    if user is None:
        return create_user(
            db,
            UserCreate(
                auth0_id=auth0_id,
                email=email,
                full_name=full_name,
                role=role,
            ),
        )

    if user.role != role:
        user = update_user_role(db, user, role)
    if user.email != email or user.full_name != full_name:
        user.email = email
        user.full_name = full_name
        db.add(user)
        db.commit()
        db.refresh(user)
    return user
