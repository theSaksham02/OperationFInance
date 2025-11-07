"""
TradeSphere FastAPI application entrypoint.

How to run (example):

1. Create a Python venv and install dependencies:
    python -m venv .venv
    .\.venv\Scripts\activate
    pip install -r backend/requirements.txt

2. Create .env with required variables (see backend/config.py for all keys):
    DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/tradesphere
    SECRET_KEY=change_me_to_a_secure_value
    FINNHUB_API_KEY=your_finnhub_key
    STOCKGRO_CLIENT_ID=your_client_id
    STOCKGRO_CLIENT_SECRET=your_client_secret
    CORS_ORIGINS=http://localhost:3000

3. Initialize DB and run migrations (Alembic):
    alembic upgrade head

4. Start server:
    uvicorn backend.main:app --reload --port 8000

This module wires routers, CORS, structured logging, and health checks.
"""
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import auth, portfolio, trade, admin, analytics, market
from .config import settings

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(name)s %(message)s')
logger = logging.getLogger("tradesphere")

app = FastAPI(title="TradeSphere API")

if settings.CORS_ORIGINS:
    origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()]
else:
    origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(portfolio.router)
app.include_router(trade.router)
app.include_router(admin.router)
app.include_router(analytics.router)
app.include_router(market.router)


@app.get("/health")
async def health():
    return {"status": "ok"}


# Example dependency override pattern for tests
def get_test_db_override():
    raise NotImplementedError()
