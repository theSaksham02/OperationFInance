"""Portfolio endpoints for positions, transactions, equity calculations."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from .. import crud
from ..schemas import PortfolioSummary, PositionOut
from ..services.finnhub import get_quote
from ..security.auth import get_current_user
from decimal import Decimal
from typing import List

router = APIRouter(prefix="/portfolio", tags=["portfolio"])


async def _compute_live_values(db: AsyncSession, user) -> PortfolioSummary:
    positions = await crud.list_positions(db, user)
    pos_out = []
    total_long = Decimal(0)
    total_short = Decimal(0)
    for p in positions:
        cp_data = await get_quote(p.symbol)
        current_price = Decimal(cp_data.get("c", 0))
        shares = Decimal(p.shares)
        current_value = shares * current_price
        unrealized = (current_price - Decimal(p.avg_price)) * shares
        if shares >= 0:
            total_long += current_value
        else:
            total_short += (-current_value)
        pos_out.append(PositionOut(symbol=p.symbol, market=p.market, shares=float(shares), avg_price=float(p.avg_price), borrow_rate_annual=p.borrow_rate_annual, current_price=float(current_price), current_value=float(current_value), unrealized_pnl=float(unrealized)))

    cash = Decimal(user.cash_balance)
    equity = cash + total_long - total_short
    maintenance_required = total_short * Decimal(0.3)
    in_margin_call = equity < maintenance_required
    headroom = equity - maintenance_required
    return PortfolioSummary(cash_balance=float(cash), equity=float(equity), maintenance_required=float(maintenance_required), margin_headroom=float(headroom), in_margin_call=in_margin_call, positions=pos_out)


@router.get("", response_model=PortfolioSummary)
async def get_portfolio(db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    return await _compute_live_values(db, current_user)


@router.get("/positions", response_model=List[PositionOut])
async def get_positions(db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    summary = await _compute_live_values(db, current_user)
    return summary.positions


@router.get("/transactions")
async def get_transactions(db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user), limit: int = 50, offset: int = 0):
    txs = await crud.list_transactions(db, current_user, limit=limit, offset=offset)
    return txs


@router.get("/equity")
async def get_equity(db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    summary = await _compute_live_values(db, current_user)
    return {"equity": summary.equity, "maintenance_required": summary.maintenance_required, "in_margin_call": summary.in_margin_call, "margin_headroom": summary.margin_headroom}
