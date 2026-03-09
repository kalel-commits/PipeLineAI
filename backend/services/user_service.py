from sqlalchemy.orm import Session
from models.user import User, UserRole
from utils.security import hash_password, verify_password, validate_password_strength
from fastapi import HTTPException, status
from typing import Optional

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, name: str, email: str, password: str, role: UserRole = UserRole.developer):
    if not validate_password_strength(password):
        raise HTTPException(status_code=400, detail="Password does not meet strength requirements.")
    if get_user_by_email(db, email):
        raise HTTPException(status_code=400, detail="Email already registered.")
    user = User(
        name=name,
        email=email,
        hashed_password=hash_password(password),
        role=role,
        is_active=True,
        failed_login_attempts=0,
        is_locked=False
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user
