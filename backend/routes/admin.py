"""Admin and demo-only utilities: refresh shortable, list users, change tier, simulate daily interest."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from .. import crud, models
from ..services import finnhub, stockgro
from ..utils.shortable import generate_shortable_symbols, daily_interest_for_short

from ..config import settings
from decimal import Decimal

router = APIRouter(prefix="/admin", tags=["admin"])


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
            tier="INTERMEDIATE"
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    return user


async def refresh_shortable(db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_mock_user)):
    # Use Finnhub and StockGro to get symbol universe
    us_symbols = []
    try:
        res = await finnhub.list_symbols("US")
        us_symbols = [s.get("symbol") for s in res if s.get("symbol")]
    except Exception:
        us_symbols = []
    in_symbols = []
    try:
        res = await stockgro.list_stocks()
        # assume JSON list with 'id' or 'symbol'
        in_symbols = [s.get("symbol") or s.get("id") for s in res if isinstance(s, dict)]
    except Exception:
        in_symbols = []

    us_selected = generate_shortable_symbols(us_symbols, settings.SHORTABLE_SELECTION_COUNT // 2)
    in_selected = generate_shortable_symbols(in_symbols, settings.SHORTABLE_SELECTION_COUNT // 2)
    summary = {"us": 0, "in": 0}
    for it in us_selected:
        await crud.upsert_shortable(db, it["symbol"], models.MarketEnum.US, it["borrow_rate_annual"])
        summary["us"] += 1
    for it in in_selected:
        await crud.upsert_shortable(db, it["symbol"], models.MarketEnum.IN, it["borrow_rate_annual"])
        summary["in"] += 1
    return {"status": "ok", "summary": summary}


@router.get("/users")
async def list_users(db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_mock_user)):
    q = await db.execute(models.select(models.User))
    users = q.scalars().all()
    return users


@router.put("/user-tier")
async def change_tier(user_id: str, tier: str, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_mock_user)):
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


@router.post("/simulate-daily-interest")
async def simulate_daily_interest(db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_mock_user)):
    # Apply one day's interest to all short positions
    q = await db.execute(models.select(models.Position).where(models.Position.shares < 0))
    positions = q.scalars().all()
    summary = []
    for p in positions:
        # need current price
        if p.market == models.MarketEnum.US:
            qd = await finnhub.get_quote(p.symbol)
            price = Decimal(qd.get("c", 0))
        else:
            price = Decimal(0)
        notional = -Decimal(p.shares) * price
        interest = daily_interest_for_short(notional, p.borrow_rate_annual or 0.0)
        # debit owner's cash
        user = await crud.get_user(db, p.user_id)
        user.cash_balance = Decimal(user.cash_balance) - interest
        db.add(user)
        summary.append({"user_id": p.user_id, "symbol": p.symbol, "interest": float(interest)})
    await db.commit()
    return {"applied": len(summary), "details": summary}
