"""Pydantic schemas for API request/response validation."""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class Tier(str, Enum):
    BEGINNER = "BEGINNER"
    INTERMEDIATE = "INTERMEDIATE"
    ADVANCED = "ADVANCED"


class Market(str, Enum):
    US = "US"
    IN = "IN"


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    tier: Tier
    cash_balance: float
    is_admin: bool

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class PositionOut(BaseModel):
    symbol: str
    market: Market
    shares: float
    avg_price: float
    borrow_rate_annual: Optional[float]
    current_price: Optional[float]
    current_value: Optional[float]
    unrealized_pnl: Optional[float]

    model_config = {"from_attributes": True}


class TransactionOut(BaseModel):
    id: int
    symbol: str
    market: Market
    type: str
    quantity: float
    price: float
    fees: float
    total_amount: float
    timestamp: datetime

    model_config = {"from_attributes": True}


class PortfolioSummary(BaseModel):
    cash_balance: float
    equity: float
    maintenance_required: float
    maintenance_rate: float = 0.3
    margin_headroom: float
    in_margin_call: bool
    positions: List[PositionOut] = []


class ShortableOut(BaseModel):
    symbol: str
    market: Market
    borrow_rate_annual: float
    available: bool

    model_config = {"from_attributes": True}
