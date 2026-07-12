from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from typing import Optional, List
import os

from app.database import get_db

security = HTTPBearer()

SECRET_KEY = os.getenv("SECRET_KEY", "assetflow-super-secret-key-change-in-production-2024")
ALGORITHM = os.getenv("ALGORITHM", "HS256")


class CurrentUser:
    def __init__(self, id: int, name: str, email: str, role: str):
        self.id = id
        self.name = name
        self.email = email
        self.role = role


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> CurrentUser:
    token = credentials.credentials
    if not token:
        raise HTTPException(status_code=401, detail="Invalid token")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        user_role: str = payload.get("role")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    from app.models.user import User
    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return CurrentUser(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role.value if hasattr(user.role, 'value') else user.role
    )


def get_current_user_db(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Returns the actual SQLAlchemy User object for use in auth routes."""
    token = credentials.credentials
    if not token:
        raise HTTPException(status_code=401, detail="Invalid token")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    from app.models.user import User
    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return user


class RoleChecker:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, user: CurrentUser = Depends(get_current_user)):
        if user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role '{user.role}' is not authorised. Required: {', '.join(self.allowed_roles)}",
            )
        return user
