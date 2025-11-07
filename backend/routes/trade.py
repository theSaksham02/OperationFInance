"""Trade endpoints: buy, sell, short, cover, shortable list."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from decimal import Decimal
from typing import Optional
from ..database import get_db
from .. import crud, models
from ..services import finnhub
from ..schemas import Market
from ..utils.shortable import initial_short_margin_required, maintenance_required, daily_interest_for_short
from ..services import stockgro
from datetime import datetime


router = APIRouter(prefix="/trade", tags=["trade"])


# Mock user function to bypass authentication
async def get_mock_user(db: AsyncSession = Depends(get_db)):
    """Get or create a default demo user."""
    user = await crud.get_user_by_email(db, "demo@tradesphere.com")
    if not user:
        # Create default demo user
        user = models.User(
            email="demo@tradesphere.com",
            hashed_password="demo",
            cash_balance=100000.0,
            tier="INTERMEDIATE"  # Give intermediate tier for shorting
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    return user



from backend.services.alpaca import place_order, get_portfolio
from fastapi.responses import JSONResponse

@router.post("/buy")
async def buy(symbol: str, market: Market, qty: float, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_mock_user)):
    if qty <= 0:
        raise HTTPException(status_code=400, detail="quantity must be > 0")
    # Get price
    if market == Market.US:
        q = await finnhub.get_quote(symbol)
        price = Decimal(q.get("c", 0))
    elif market == Market.IN:
        try:
            q = await stockgro.get_realtime_quote(symbol)
            price = Decimal(q.get("last_price", 0))
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"StockGro error: {e}")
    else:
        raise HTTPException(status_code=400, detail="Invalid market")

    total = price * Decimal(qty)
    fees = Decimal(0)
    if Decimal(current_user.cash_balance) < total + fees:
        raise HTTPException(status_code=400, detail="insufficient cash")
    # debit cash
    current_user.cash_balance = Decimal(current_user.cash_balance) - (total + fees)
    db.add(current_user)
    await db.commit()
    # upsert position
    pos = await crud.upsert_position(db, current_user, symbol, market, Decimal(qty), price)
    await crud.create_transaction(db, current_user, symbol, market, models.TransactionType.BUY.value, Decimal(qty), price, fees, total)
    return {"status": "ok", "symbol": symbol, "qty": qty, "price": float(price)}

@router.post("/alpaca/order")
def alpaca_place_order(symbol: str, qty: int, side: str):
    """Place a paper trade order using Alpaca API."""
    try:
        order = place_order(symbol, qty, side)
        return JSONResponse(content={"order": order.model_dump()}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)

@router.get("/alpaca/portfolio")
def alpaca_get_portfolio():
    """Get Alpaca paper trading portfolio positions."""
    try:
        positions = get_portfolio()
        return JSONResponse(content={"positions": [p.model_dump() for p in positions]}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)

@router.post("/sell")
async def sell(symbol: str, market: Market, qty: float, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if qty <= 0:
        raise HTTPException(status_code=400, detail="quantity must be > 0")
    if market == Market.US:
        q = await finnhub.get_quote(symbol)
        price = Decimal(q.get("c", 0))
    elif market == Market.IN:
        try:
            q = await stockgro.get_realtime_quote(symbol)
            price = Decimal(q.get("last_price", 0))
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"StockGro error: {e}")
    else:
        raise HTTPException(status_code=400, detail="Invalid market")

    pos = await crud.get_position(db, current_user, symbol, market)
    if not pos or Decimal(pos.shares) <= 0:
        raise HTTPException(status_code=400, detail="no long position to sell")
    if Decimal(pos.shares) < Decimal(qty):
        raise HTTPException(status_code=400, detail="not enough shares to sell")
    total = price * Decimal(qty)
    fees = Decimal(0)
    current_user.cash_balance = Decimal(current_user.cash_balance) + (total - fees)
    db.add(current_user)
    # reduce position
    await crud.upsert_position(db, current_user, symbol, market, Decimal(-qty), price)
    await crud.create_transaction(db, current_user, symbol, market, models.TransactionType.SELL.value, Decimal(qty), price, fees, total)
    await db.commit()
    return {"status": "ok", "symbol": symbol, "qty": qty, "price": float(price)}


@router.post("/short")
async def short(symbol: str, market: Market, qty: float, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(require_tier("INTERMEDIATE"))):
    if qty <= 0:
        raise HTTPException(status_code=400, detail="quantity must be > 0")
    if market == Market.US:
        q = await finnhub.get_quote(symbol)
        price = Decimal(q.get("c", 0))
    elif market == Market.IN:
        try:
            q = await stockgro.get_realtime_quote(symbol)
            price = Decimal(q.get("last_price", 0))
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"StockGro error: {e}")
    else:
        raise HTTPException(status_code=400, detail="Invalid market")

    # check shortable
    s = await crud.list_shortable(db, market)
    symbols = {x.symbol: x for x in s}
    if symbol not in symbols or not symbols[symbol].available:
        raise HTTPException(status_code=404, detail="symbol not shortable")
    borrow_rate = symbols[symbol].borrow_rate_annual
    notional = price * Decimal(qty)
    initial_margin = initial_short_margin_required(notional)
    # ensure sufficient cash
    if Decimal(current_user.cash_balance) < initial_margin:
        raise HTTPException(status_code=400, detail="insufficient cash for initial short margin")
    # credit proceeds to cash, but reserve margin conceptually
    current_user.cash_balance = Decimal(current_user.cash_balance) + notional
    db.add(current_user)
    # create negative position
    pos = await crud.upsert_position(db, current_user, symbol, market, -Decimal(qty), price, borrow_rate)
    await crud.create_transaction(db, current_user, symbol, market, models.TransactionType.SHORT.value, Decimal(qty), price, Decimal(0), notional)
    return {"status": "ok", "symbol": symbol, "qty": qty, "price": float(price), "borrow_rate_annual": borrow_rate}


@router.post("/cover")
async def cover(symbol: str, market: Market, qty: float, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(require_tier("INTERMEDIATE"))):
    if qty <= 0:
        raise HTTPException(status_code=400, detail="quantity must be > 0")
    if market == Market.US:
        q = await finnhub.get_quote(symbol)
        price = Decimal(q.get("c", 0))
    elif market == Market.IN:
        try:
            q = await stockgro.get_realtime_quote(symbol)
            price = Decimal(q.get("last_price", 0))
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"StockGro error: {e}")
    else:
        raise HTTPException(status_code=400, detail="Invalid market")

    pos = await crud.get_position(db, current_user, symbol, market)
    if not pos or Decimal(pos.shares) >= 0:
        raise HTTPException(status_code=400, detail="no short position to cover")
    if -Decimal(pos.shares) < Decimal(qty):
        raise HTTPException(status_code=400, detail="cover qty exceeds shorted shares")

    notional = price * Decimal(qty)
    # debit cash to buy back
    if Decimal(current_user.cash_balance) < notional:
        raise HTTPException(status_code=400, detail="insufficient cash to cover")
    current_user.cash_balance = Decimal(current_user.cash_balance) - notional
    db.add(current_user)
    # reduce negative shares towards zero
    await crud.upsert_position(db, current_user, symbol, market, Decimal(qty), price)
    await crud.create_transaction(db, current_user, symbol, market, models.TransactionType.COVER.value, Decimal(qty), price, Decimal(0), notional)
    await db.commit()
    return {"status": "ok", "symbol": symbol, "qty": qty, "price": float(price)}


@router.get("/shortable")
async def shortable_list(db: AsyncSession = Depends(get_db), market: Optional[Market] = None):
    m = None
    if market:
        m = market
    items = await crud.list_shortable(db, m)
    return items
