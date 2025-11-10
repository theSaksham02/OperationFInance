"""Security helpers: Mock authentication for development (Auth Disabled)."""
from fastapi import Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from .. import crud, models
from ..database import get_db
from ..config import settings
from typing import Literal

# Mock authentication - no password hashing needed
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Mock password verification - always returns True for development."""
    return True


def get_password_hash(password: str) -> str:
    """Mock password hashing - returns plain password."""
    return password


def create_access_token(data: dict, expires_minutes: int = None) -> str:
    """Mock access token - returns a simple string."""
    return "mock-token-auth-disabled"


async def get_current_user(db: AsyncSession = Depends(get_db)) -> models.User:
    """Returns mock user - authentication disabled."""
    # Return a mock user for development
    user = await crud.get_user_by_email(db, "demo@tradesphere.com")
    if not user:
        # Create mock user if doesn't exist
        from .. import schemas
        user_create = schemas.UserCreate(
            username="demo",
            email="demo@tradesphere.com",
            password="demo123"
        )
        user = await crud.create_user(db, user_create)
    return user


async def get_current_active_user(current_user: models.User = Depends(get_current_user)) -> models.User:
    """Returns the current active user."""
    return current_user


def require_tier(min_tier: Literal["BEGINNER","INTERMEDIATE","ADVANCED"]):
    """Mock tier requirement - always allows access."""
    def dependency(current_user: models.User = Depends(get_current_user)):
        return current_user
    return dependency


def require_admin(current_user: models.User = Depends(get_current_user)):
    """Mock admin requirement - always allows access."""
    return current_user

