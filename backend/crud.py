"""CRUD and business logic helpers for TradeSphere.

Functions are async and expect an AsyncSession from database.get_db.
"""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete, func
from . import models
from .models import User, Position, Transaction, ShortableStock
from .schemas import Market
from decimal import Decimal
from typing import List, Optional, Tuple
from datetime import datetime, timedelta


async def get_user_by_username(db: AsyncSession, username: str) -> Optional[User]:
    q = await db.execute(select(User).where(User.username == username))
    return q.scalars().first()


async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
    q = await db.execute(select(User).where(User.email == email))
    return q.scalars().first()


async def create_user(db: AsyncSession, username: str, email: str, password_hash: str, initial_cash: float = 100000.0) -> User:
    user = User(username=username, email=email, password_hash=password_hash, cash_balance=Decimal(initial_cash))
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


<<<<<<< HEAD
async def get_user(db: AsyncSession, user_id: int) -> Optional[User]:
=======
async def get_user(db: AsyncSession, user_id: str) -> Optional[User]:
>>>>>>> MK
    q = await db.execute(select(User).where(User.id == user_id))
    return q.scalars().first()


async def upsert_position(db: AsyncSession, user: User, symbol: str, market: Market, qty: Decimal, price: Decimal, borrow_rate: Optional[float] = None) -> Position:
    # Fetch existing position
    q = await db.execute(select(Position).where(Position.user_id == user.id, Position.symbol == symbol, Position.market == market))
    pos = q.scalars().first()
    if pos:
        # Update avg_price and shares when increasing a long position (qty positive)
        existing_shares = Decimal(pos.shares)
        existing_avg = Decimal(pos.avg_price)
        if qty > 0 and existing_shares >= 0:
            new_shares = existing_shares + qty
            new_avg = (existing_avg * existing_shares + price * qty) / new_shares
            pos.shares = new_shares
            pos.avg_price = new_avg
        else:
            # For simplicity, allow negative shares and direct arithmetic
            pos.shares = existing_shares + qty
            # If changing sign, set new avg_price to price
            pos.avg_price = price
        if borrow_rate is not None:
            pos.borrow_rate_annual = borrow_rate
        pos.updated_at = datetime.utcnow()
        db.add(pos)
        await db.commit()
        await db.refresh(pos)
        return pos
    else:
        pos = Position(user_id=user.id, symbol=symbol, market=market, shares=qty, avg_price=price, borrow_rate_annual=borrow_rate)
        db.add(pos)
        await db.commit()
        await db.refresh(pos)
        return pos


async def create_transaction(db: AsyncSession, user: User, symbol: str, market: Market, tx_type: str, quantity: Decimal, price: Decimal, fees: Decimal, total: Decimal) -> Transaction:
    tx = Transaction(user_id=user.id, symbol=symbol, market=market, type=tx_type, quantity=quantity, price=price, fees=fees, total_amount=total)
    db.add(tx)
    await db.commit()
    await db.refresh(tx)
    return tx


async def list_transactions(db: AsyncSession, user: User, limit: int = 50, offset: int = 0) -> List[Transaction]:
    q = await db.execute(select(Transaction).where(Transaction.user_id == user.id).order_by(Transaction.timestamp.desc()).limit(limit).offset(offset))
    return q.scalars().all()


async def upsert_shortable(db: AsyncSession, symbol: str, market: Market, borrow_rate: float, available: bool = True) -> ShortableStock:
    q = await db.execute(select(ShortableStock).where(ShortableStock.symbol == symbol))
    s = q.scalars().first()
    if s:
        s.borrow_rate_annual = borrow_rate
        s.available = available
        s.last_updated = datetime.utcnow()
        db.add(s)
        await db.commit()
        await db.refresh(s)
        return s
    else:
        s = ShortableStock(symbol=symbol, market=market, borrow_rate_annual=borrow_rate, available=available)
        db.add(s)
        await db.commit()
        await db.refresh(s)
        return s


async def list_shortable(db: AsyncSession, market: Optional[Market] = None) -> List[ShortableStock]:
    q = select(ShortableStock)
    if market:
        q = q.where(ShortableStock.market == market)
    res = await db.execute(q)
    return res.scalars().all()


async def get_position(db: AsyncSession, user: User, symbol: str, market: Market) -> Optional[Position]:
    q = await db.execute(select(Position).where(Position.user_id == user.id, Position.symbol == symbol, Position.market == market))
    return q.scalars().first()


async def list_positions(db: AsyncSession, user: User) -> List[Position]:
    q = await db.execute(select(Position).where(Position.user_id == user.id))
    return q.scalars().all()
