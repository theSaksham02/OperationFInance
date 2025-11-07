"""SQLAlchemy models for TradeSphere.

Notes:
- Uses SQLAlchemy declarative base and types compatible with async engine.
"""
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    Boolean,
    Enum,
    ForeignKey,
    DateTime,
    func,
    Numeric,
)
import enum
from datetime import datetime


Base = declarative_base()


class TierEnum(str, enum.Enum):
    BEGINNER = "BEGINNER"
    INTERMEDIATE = "INTERMEDIATE"
    ADVANCED = "ADVANCED"


class MarketEnum(str, enum.Enum):
    US = "US"
    IN = "IN"


class TransactionType(str, enum.Enum):
    BUY = "BUY"
    SELL = "SELL"
    SHORT = "SHORT"
    COVER = "COVER"



class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, unique=True, index=True, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    tier = Column(Enum(TierEnum), default=TierEnum.BEGINNER)
    cash_balance = Column(Numeric(20, 4), default=100000.0)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())

    positions = relationship("Position", back_populates="user")
    transactions = relationship("Transaction", back_populates="user")


class Position(Base):
    __tablename__ = "positions"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    symbol = Column(String, index=True, nullable=False)
    market = Column(Enum(MarketEnum), nullable=False)
    shares = Column(Numeric(20, 8), nullable=False)
    avg_price = Column(Numeric(20, 8), nullable=False)
    borrow_rate_annual = Column(Float, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="positions")


class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    symbol = Column(String, nullable=False)
    market = Column(Enum(MarketEnum), nullable=False)
    type = Column(Enum(TransactionType), nullable=False)
    quantity = Column(Numeric(20, 8), nullable=False)
    price = Column(Numeric(20, 8), nullable=False)
    fees = Column(Numeric(20, 8), default=0.0)
    total_amount = Column(Numeric(20, 8), nullable=False)
    timestamp = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="transactions")


class ShortableStock(Base):
    __tablename__ = "shortable_stocks"
    symbol = Column(String, primary_key=True)
    market = Column(Enum(MarketEnum), nullable=False)
    borrow_rate_annual = Column(Float, nullable=False)
    available = Column(Boolean, default=True)
    last_updated = Column(DateTime, server_default=func.now(), onupdate=func.now())


class EquitySnapshot(Base):
    __tablename__ = "equity_snapshots"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    total_equity = Column(Numeric(20, 4), nullable=False)
    maintenance_required = Column(Numeric(20, 4), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
