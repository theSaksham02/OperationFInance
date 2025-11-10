"""Application configuration using pydantic BaseSettings.

Environment variables expected (example .env):

# DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/tradesphere
# SECRET_KEY=change-me
# FINNHUB_API_KEY=your_finnhub_key
# STOCKGRO_CLIENT_ID=clientid
# STOCKGRO_CLIENT_SECRET=supersecret
# CORS_ORIGINS=http://localhost:3000,http://localhost:5173
"""
from pydantic_settings import BaseSettings
from pydantic import Field, AnyHttpUrl
from typing import List, Optional


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    FINNHUB_API_KEY: str
    STOCKGRO_CLIENT_ID: str
    STOCKGRO_CLIENT_SECRET: str
    stockgro_tenant_id: str = ""

    # Alpaca Paper Trading API
    ALPACA_API_KEY: str = ""
    ALPACA_API_SECRET: str = ""
    ALPACA_BASE_URL: str = "https://paper-api.alpaca.markets"

    SHORTABLE_MIN_RATE: float = Field(0.02, ge=0)
    SHORTABLE_MAX_RATE: float = Field(0.18, ge=0)
    SHORTABLE_SELECTION_COUNT: int = 100

    QUOTE_CACHE_TTL_SECONDS: int = 5

    CORS_ORIGINS: Optional[str] = None

    # Admin demo flag
    ALLOW_TIER_UPGRADE: bool = False

    class Config:
        env_file = "backend/.env"


settings = Settings()
