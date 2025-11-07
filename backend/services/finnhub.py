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
        url = "https://finnhub.io/api/v1/quote"
        params = {"symbol": symbol, "token": settings.FINNHUB_API_KEY}
        return await _get(url, params)

    return await _cached_get(key, settings.QUOTE_CACHE_TTL_SECONDS, fetch)


async def get_candles(symbol: str, resolution: str, frm: int, to: int) -> dict:
    url = "https://finnhub.io/api/v1/stock/candle"
    params = {"symbol": symbol, "resolution": resolution, "from": frm, "to": to, "token": settings.FINNHUB_API_KEY}
    return await _get(url, params)


async def list_symbols(exchange: str = "US") -> list:
    url = "https://finnhub.io/api/v1/stock/symbol"
    params = {"exchange": exchange, "token": settings.FINNHUB_API_KEY}
    return await _get(url, params)
