"""Portfolio endpoints for positions, transactions, equity calculations."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from .. import crud, models
from ..schemas import PortfolioSummary, PositionOut, Market
from ..services.finnhub import get_quote
from ..services.alpaca import get_portfolio as get_alpaca_portfolio
from decimal import Decimal
from typing import List
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/portfolio", tags=["portfolio"])


# Mock user function to bypass authentication
async def get_mock_user(db: AsyncSession = Depends(get_db)):
    """Get or create a default demo user."""
    user = await crud.get_user_by_email(db, "demo@tradesphere.com")
    if not user:
        # Create default demo user
        user = models.User(
            email="demo@tradesphere.com",
            password_hash="demo",
            cash_balance=100000.0,
            tier="BEGINNER"
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    return user


async def _compute_live_values(db: AsyncSession, user) -> PortfolioSummary:
    positions = await crud.list_positions(db, user)
    pos_out = []
    total_long = Decimal(0)
    total_short = Decimal(0)
    
    # Get local database positions
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
    
    # Get Alpaca paper trading positions
    try:
        alpaca_positions = get_alpaca_portfolio()
        for alpaca_pos in alpaca_positions:
            # Add Alpaca positions to the list
            symbol = alpaca_pos.symbol
            shares = Decimal(str(alpaca_pos.qty))
            avg_price = Decimal(str(alpaca_pos.avg_entry_price))
            current_price = Decimal(str(alpaca_pos.current_price))
            current_value = shares * current_price
            unrealized = Decimal(str(alpaca_pos.unrealized_pl))
            
            if shares >= 0:
                total_long += current_value
            else:
                total_short += (-current_value)
            
            pos_out.append(PositionOut(
                symbol=f"{symbol} (Alpaca)",
                market=Market.US,
                shares=float(shares),
                avg_price=float(avg_price),
                borrow_rate_annual=None,
                current_price=float(current_price),
                current_value=float(current_value),
                unrealized_pnl=float(unrealized)
            ))
    except Exception as e:
        logger.warning(f"Failed to fetch Alpaca positions: {e}")
        # Continue without Alpaca data

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
async def get_portfolio(db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_mock_user)):
    return await _compute_live_values(db, current_user)


@router.get("/positions", response_model=List[PositionOut])
async def get_positions(db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_mock_user)):
    positions = await crud.list_positions(db, current_user)
    return [PositionOut.from_orm(p) for p in positions]
