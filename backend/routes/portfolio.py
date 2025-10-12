"""Portfolio endpoints for positions, transactions, equity calculations."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from .. import crud
from ..schemas import PortfolioSummary, PositionOut, Market
from ..services.finnhub import get_quote as finnhub_get_quote
from ..services.stockgro import get_realtime_quote as stockgro_get_quote
from decimal import Decimal
from typing import List
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/portfolio", tags=["portfolio"])


# Mock demo user for no-auth mode
async def get_demo_user(db: AsyncSession):
    """Get or create a demo user for testing without authentication"""
    user = await crud.get_user(db, 1)  # Get first user
    if not user:
        # Create a demo user if none exists
        from ..security.auth import get_password_hash
        user = await crud.create_user(db, "demo", "demo@uptrade.global", get_password_hash("demo123"))
    return user


async def _compute_live_values(db: AsyncSession, user) -> PortfolioSummary:
    positions = await crud.list_positions(db, user)
    pos_out = []
    total_long = Decimal(0)
    total_short = Decimal(0)
    for p in positions:
        try:
            # Use Stockgro for Indian market, Finnhub for US market
            if p.market.value == "IN":
                cp_data = await stockgro_get_quote(p.symbol)
                current_price = Decimal(cp_data.get("last_price", 0))
            else:  # US market
                cp_data = await finnhub_get_quote(p.symbol)
                current_price = Decimal(cp_data.get("c", 0))
        except Exception as e:
            logger.warning(f"Failed to fetch quote for {p.symbol} ({p.market}): {e}")
            # Fallback to average price if API fails
            current_price = Decimal(p.avg_price)
        
        shares = Decimal(p.shares)
        current_value = shares * current_price
        unrealized = (current_price - Decimal(p.avg_price)) * shares
        if shares >= 0:
            total_long += current_value
        else:
            total_short += (-current_value)
        pos_out.append(PositionOut(
            symbol=p.symbol, 
            market=p.market, 
            shares=float(shares), 
            avg_price=float(p.avg_price), 
            borrow_rate_annual=p.borrow_rate_annual, 
            current_price=float(current_price), 
            current_value=float(current_value), 
            unrealized_pnl=float(unrealized)
        ))

    cash = Decimal(user.cash_balance)
    equity = cash + total_long - total_short
    maintenance_required = total_short * Decimal(0.3)
    in_margin_call = equity < maintenance_required
    headroom = equity - maintenance_required
    return PortfolioSummary(
        cash_balance=float(cash), 
        equity=float(equity), 
        maintenance_required=float(maintenance_required), 
        margin_headroom=float(headroom), 
        in_margin_call=in_margin_call, 
        positions=pos_out
    )


@router.get("", response_model=PortfolioSummary)
async def get_portfolio(db: AsyncSession = Depends(get_db)):
    try:
        user = await get_demo_user(db)
        return await _compute_live_values(db, user)
    except Exception as e:
        logger.warning(f"Database connection failed, returning mock data: {e}")
        # Return mock portfolio data when database is unavailable
        return PortfolioSummary(
            cash_balance=100000.0,
            equity=100000.0,
            maintenance_required=0.0,
            margin_headroom=100000.0,
            in_margin_call=False,
            positions=[]
        )


@router.get("/positions", response_model=List[PositionOut])
async def get_positions(db: AsyncSession = Depends(get_db)):
    try:
        user = await get_demo_user(db)
        summary = await _compute_live_values(db, user)
        return summary.positions
    except Exception as e:
        logger.warning(f"Database connection failed, returning mock positions: {e}")
        return []


@router.get("/transactions")
async def get_transactions(db: AsyncSession = Depends(get_db), limit: int = 50, offset: int = 0):
    try:
        user = await get_demo_user(db)
        txs = await crud.list_transactions(db, user, limit=limit, offset=offset)
        return txs
    except Exception as e:
        logger.warning(f"Database connection failed, returning mock transactions: {e}")
        return []


@router.get("/equity")
async def get_equity(db: AsyncSession = Depends(get_db)):
    try:
        user = await get_demo_user(db)
        summary = await _compute_live_values(db, user)
        return {"equity": summary.equity, "maintenance_required": summary.maintenance_required, "in_margin_call": summary.in_margin_call, "margin_headroom": summary.margin_headroom}
    except Exception as e:
        logger.warning(f"Database connection failed, returning mock equity: {e}")
        return {"equity": 100000.0, "maintenance_required": 0.0, "in_margin_call": False, "margin_headroom": 100000.0}
