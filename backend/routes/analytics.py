"""Analytics endpoints: portfolio metrics, performance analysis, risk metrics."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from decimal import Decimal
from typing import List, Dict, Any
from datetime import datetime, timedelta

from ..database import get_db
from .. import crud, models
from ..services import finnhub, stockgro
from ..schemas import Market


router = APIRouter(prefix="/analytics", tags=["analytics"])


# Mock user function to bypass authentication
async def get_mock_user(db: AsyncSession = Depends(get_db)):
    """Get or create a default demo user."""
    user = await crud.get_user_by_email(db, "demo@tradesphere.com")
    if not user:
        user = models.User(
            email="demo@tradesphere.com",
            password_hash="demo",
            cash_balance=100000.0,
            tier="INTERMEDIATE"
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    return user


@router.get("/performance")
async def get_performance_metrics(
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_mock_user)
):
    """Get portfolio performance metrics."""
    
    # Get all transactions
    result = await db.execute(
        select(models.Transaction)
        .where(models.Transaction.user_id == current_user.id)
        .order_by(models.Transaction.timestamp.desc())
    )
    transactions = result.scalars().all()
    
    # Calculate metrics
    total_trades = len(transactions)
    winning_trades = 0
    losing_trades = 0
    total_pnl = Decimal(0)
    total_fees = Decimal(0)
    
    for txn in transactions:
        if txn.type in [models.TransactionType.SELL, models.TransactionType.COVER]:
            # This is a closing trade - calculate P&L
            # Simplified: just add to total
            total_pnl += Decimal(txn.total_amount)
        total_fees += Decimal(txn.fees)
    
    # Get current positions for unrealized P&L
    positions = await crud.get_positions(db, current_user)
    unrealized_pnl = Decimal(0)
    
    for pos in positions:
        if pos.market == Market.US:
            quote = await finnhub.get_quote(pos.symbol)
            current_price = Decimal(quote.get("c", 0))
        else:
            try:
                quote = await stockgro.get_realtime_quote(pos.symbol)
                current_price = Decimal(quote.get("last_price", 0))
            except:
                current_price = Decimal(pos.avg_price)
        
        pnl = (current_price - Decimal(pos.avg_price)) * Decimal(pos.shares)
        unrealized_pnl += pnl
        
        if pnl > 0:
            winning_trades += 1
        elif pnl < 0:
            losing_trades += 1
    
    win_rate = (winning_trades / max(winning_trades + losing_trades, 1)) * 100
    
    # Calculate equity curve (simplified)
    initial_balance = Decimal(100000.0)
    current_equity = Decimal(current_user.cash_balance) + unrealized_pnl
    total_return = ((current_equity - initial_balance) / initial_balance) * 100
    
    return {
        "total_trades": total_trades,
        "winning_trades": winning_trades,
        "losing_trades": losing_trades,
        "win_rate": float(win_rate),
        "realized_pnl": float(total_pnl),
        "unrealized_pnl": float(unrealized_pnl),
        "total_pnl": float(total_pnl + unrealized_pnl),
        "total_fees": float(total_fees),
        "total_return_percent": float(total_return),
        "initial_balance": float(initial_balance),
        "current_equity": float(current_equity)
    }


@router.get("/risk")
async def get_risk_metrics(
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_mock_user)
):
    """Get portfolio risk metrics."""
    
    positions = await crud.get_positions(db, current_user)
    
    # Calculate portfolio metrics
    total_exposure = Decimal(0)
    position_risks = []
    
    for pos in positions:
        if pos.market == Market.US:
            quote = await finnhub.get_quote(pos.symbol)
            current_price = Decimal(quote.get("c", 0))
        else:
            try:
                quote = await stockgro.get_realtime_quote(pos.symbol)
                current_price = Decimal(quote.get("last_price", 0))
            except:
                current_price = Decimal(pos.avg_price)
        
        position_value = abs(Decimal(pos.shares) * current_price)
        total_exposure += position_value
        
        # Calculate position risk
        pnl_percent = ((current_price - Decimal(pos.avg_price)) / Decimal(pos.avg_price)) * 100 if pos.avg_price != 0 else 0
        
        position_risks.append({
            "symbol": pos.symbol,
            "market": pos.market.value,
            "shares": float(pos.shares),
            "current_price": float(current_price),
            "position_value": float(position_value),
            "pnl_percent": float(pnl_percent),
            "risk_level": "high" if abs(float(pnl_percent)) > 5 else "medium" if abs(float(pnl_percent)) > 2 else "low"
        })
    
    # Portfolio-level risk metrics
    equity = Decimal(current_user.cash_balance) + sum(
        (Decimal(p["position_value"]) if Decimal(p["shares"]) > 0 else -Decimal(p["position_value"]))
        for p in position_risks
    )
    
    # Risk ratios
    cash_ratio = (Decimal(current_user.cash_balance) / equity * 100) if equity > 0 else 0
    exposure_ratio = (total_exposure / equity * 100) if equity > 0 else 0
    
    # Diversification score (simple: more positions = better diversification)
    diversification_score = min(len(positions) * 10, 100)
    
    return {
        "total_exposure": float(total_exposure),
        "equity": float(equity),
        "cash_ratio": float(cash_ratio),
        "exposure_ratio": float(exposure_ratio),
        "diversification_score": diversification_score,
        "position_count": len(positions),
        "position_risks": position_risks,
        "risk_status": "healthy" if exposure_ratio < 80 and cash_ratio > 20 else "warning" if exposure_ratio < 95 else "critical"
    }


@router.get("/position-analysis/{symbol}")
async def get_position_analysis(
    symbol: str,
    market: Market,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_mock_user)
):
    """Get detailed analysis for a specific position."""
    
    pos = await crud.get_position(db, current_user, symbol, market)
    if not pos:
        raise HTTPException(status_code=404, detail="Position not found")
    
    # Get current price
    if market == Market.US:
        quote = await finnhub.get_quote(symbol)
        current_price = Decimal(quote.get("c", 0))
        high = Decimal(quote.get("h", 0))
        low = Decimal(quote.get("l", 0))
        prev_close = Decimal(quote.get("pc", 0))
    else:
        try:
            quote = await stockgro.get_realtime_quote(symbol)
            current_price = Decimal(quote.get("last_price", 0))
            high = Decimal(quote.get("high", current_price))
            low = Decimal(quote.get("low", current_price))
            prev_close = Decimal(quote.get("prev_close", current_price))
        except:
            current_price = Decimal(pos.avg_price)
            high = current_price
            low = current_price
            prev_close = current_price
    
    # Calculate metrics
    unrealized_pnl = (current_price - Decimal(pos.avg_price)) * Decimal(pos.shares)
    pnl_percent = ((current_price - Decimal(pos.avg_price)) / Decimal(pos.avg_price)) * 100 if pos.avg_price != 0 else 0
    
    position_value = abs(Decimal(pos.shares)) * current_price
    
    # Get transaction history for this symbol
    result = await db.execute(
        select(models.Transaction)
        .where(
            models.Transaction.user_id == current_user.id,
            models.Transaction.symbol == symbol,
            models.Transaction.market == market
        )
        .order_by(models.Transaction.timestamp.desc())
        .limit(10)
    )
    transactions = result.scalars().all()
    
    return {
        "symbol": symbol,
        "market": market.value,
        "shares": float(pos.shares),
        "avg_price": float(pos.avg_price),
        "current_price": float(current_price),
        "unrealized_pnl": float(unrealized_pnl),
        "pnl_percent": float(pnl_percent),
        "position_value": float(position_value),
        "day_high": float(high),
        "day_low": float(low),
        "prev_close": float(prev_close),
        "borrow_rate": float(pos.borrow_rate_annual) if pos.borrow_rate_annual else None,
        "recent_transactions": [
            {
                "type": txn.type.value,
                "quantity": float(txn.quantity),
                "price": float(txn.price),
                "timestamp": txn.timestamp.isoformat()
            }
            for txn in transactions
        ]
    }
