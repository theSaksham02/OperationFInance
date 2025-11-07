"""Async Finnhub client with simple in-memory caching and retries."""
import httpx
import asyncio
from typing import Dict, Any, Optional
from time import time
from ..config import settings
from functools import wraps
import logging

_quote_cache: Dict[str, Dict[str, Any]] = {}
_cache_lock = asyncio.Lock()

logger = logging.getLogger("finnhub")


async def _cached_get(key: str, ttl: int, fetcher):
    async with _cache_lock:
        entry = _quote_cache.get(key)
        if entry and time() - entry["ts"] < ttl:
            return entry["val"]
    # fetch outside lock
    val = await fetcher()
    async with _cache_lock:
        _quote_cache[key] = {"val": val, "ts": time()}
    return val


async def _get(url: str, params: dict) -> dict:
    # Simple retry with backoff
    backoff = 0.5
    for attempt in range(4):
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                r = await client.get(url, params=params)
                r.raise_for_status()
                return r.json()
        except Exception as e:
            logger.warning("Finnhub request failed attempt %s: %s", attempt + 1, e)
            await asyncio.sleep(backoff)
            backoff *= 2
    raise RuntimeError("Finnhub request failed after retries")


async def get_quote(symbol: str) -> dict:
    """Return current quote for a symbol. Cached for QUOTE_CACHE_TTL_SECONDS."""
    key = f"quote:{symbol}"

    async def fetch():
<<<<<<< HEAD
        # If API key is placeholder, return mock data
        if settings.FINNHUB_API_KEY == "your_finnhub_api_key" or not settings.FINNHUB_API_KEY:
            logger.warning("Using mock Finnhub data - no valid API key configured")
            # Return realistic mock quote data
            import random
            base_price = 100.0
            if "INR" in symbol or symbol.endswith(".NS") or symbol.endswith(".BO"):
                base_price = random.uniform(500, 2000)
            elif "NIFTY" in symbol or "SENSEX" in symbol:
                base_price = random.uniform(18000, 25000)
            else:
                base_price = random.uniform(50, 500)
            
            return {
                "c": round(base_price, 2),  # current price
                "h": round(base_price * 1.02, 2),  # high
                "l": round(base_price * 0.98, 2),  # low
                "o": round(base_price * 0.995, 2),  # open
                "pc": round(base_price * 0.99, 2),  # previous close
                "t": int(time())  # timestamp
            }
        
        url = "https://finnhub.io/api/v1/quote"
        params = {"symbol": symbol, "token": settings.FINNHUB_API_KEY}
        try:
            return await _get(url, params)
        except Exception as e:
            logger.error(f"Finnhub API failed for {symbol}, returning mock data: {e}")
            # Return mock data on failure
            return {
                "c": 100.0,
                "h": 102.0,
                "l": 98.0,
                "o": 99.5,
                "pc": 99.0,
                "t": int(time())
            }
=======
        url = "https://finnhub.io/api/v1/quote"
        params = {"symbol": symbol, "token": settings.FINNHUB_API_KEY}
        return await _get(url, params)
>>>>>>> MK

    return await _cached_get(key, settings.QUOTE_CACHE_TTL_SECONDS, fetch)


async def get_candles(symbol: str, resolution: str, frm: int, to: int) -> dict:
    url = "https://finnhub.io/api/v1/stock/candle"
    params = {"symbol": symbol, "resolution": resolution, "from": frm, "to": to, "token": settings.FINNHUB_API_KEY}
    return await _get(url, params)


async def list_symbols(exchange: str = "US") -> list:
    url = "https://finnhub.io/api/v1/stock/symbol"
    params = {"exchange": exchange, "token": settings.FINNHUB_API_KEY}
    return await _get(url, params)
