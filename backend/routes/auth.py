"""Authentication routes: register, login, me, upgrade-tier (demo).

Uses JWT access tokens and bcrypt hashing.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from .. import crud, models
from ..database import get_db
from ..schemas import UserCreate, UserOut, Token
from ..security.auth import (
    get_password_hash, verify_password, create_access_token, get_current_user
)
from ..config import settings
from typing import Dict


router = APIRouter(prefix="/auth", tags=["auth"])





@router.post("/register", response_model=UserOut)
async def register(payload: UserCreate, db: AsyncSession = Depends(get_db)):
    existing = await crud.get_user_by_username(db, payload.username)
    if existing:
        raise HTTPException(status_code=400, detail="username already exists")
    existing = await crud.get_user_by_email(db, payload.email)
    if existing:
        raise HTTPException(status_code=400, detail="email already exists")
    hashed = get_password_hash(payload.password)
    user = await crud.create_user(db, payload.username, payload.email, hashed)
<<<<<<< HEAD
    return UserOut.model_validate(user)
=======
    return UserOut.from_orm(user)
>>>>>>> MK


from fastapi.security import OAuth2PasswordRequestForm
@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    user = await crud.get_user_by_username(db, form_data.username)
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="invalid credentials")
    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=UserOut)
async def me(current_user: models.User = Depends(get_current_user)):
<<<<<<< HEAD
    return UserOut.model_validate(current_user)


@router.put("/upgrade-tier")
async def upgrade_tier(user_id: int, tier: str, db: AsyncSession = Depends(get_db)):
=======
    return UserOut.from_orm(current_user)


@router.put("/upgrade-tier")
async def upgrade_tier(user_id: str, tier: str, db: AsyncSession = Depends(get_db)):
>>>>>>> MK
    # Demo-only endpoint. Guard via config in production.
    if not settings.ALLOW_TIER_UPGRADE:
        raise HTTPException(status_code=403, detail="upgrade-tier disabled")
    user = await crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="user not found")
    try:
        user.tier = models.TierEnum[tier]
    except Exception:
        raise HTTPException(status_code=400, detail="invalid tier")
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return {"status": "ok", "tier": user.tier}
