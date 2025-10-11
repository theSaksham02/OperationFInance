import functools
_symbol_id_cache = {}

async def list_symbols() -> list:
    """Return tradable symbols for IN market."""
    res = await list_stocks()
    # Assume each item has 'symbol' and 'id'
    symbols = []
    for s in res:
        if isinstance(s, dict) and s.get("symbol") and s.get("id"):
            symbols.append({"symbol": s["symbol"], "id": s["id"]})
            _symbol_id_cache[s["symbol"]] = s["id"]
    return symbols

async def get_realtime_quote(symbol: str) -> dict:
    """Get last traded price for a symbol (IN market)."""
    # Lookup id if needed
    stock_id = _symbol_id_cache.get(symbol)
    if not stock_id:
        syms = await list_symbols()
        stock_id = _symbol_id_cache.get(symbol)
        if not stock_id:
            raise Exception(f"Symbol {symbol} not found in StockGro universe")
    # Use stock_details with 'stock_info' section
    data = await stock_details(stock_id, ["stock_info"])
    # Assume response shape: {'stock_info': {'last_price': ...}}
    info = data.get("stock_info", {})
    return {"last_price": info.get("last_price")}

async def get_candles(symbol: str, resolution: str, frm: int, to: int) -> dict:
    stock_id = _symbol_id_cache.get(symbol)
    if not stock_id:
        syms = await list_symbols()
        stock_id = _symbol_id_cache.get(symbol)
        if not stock_id:
            raise Exception(f"Symbol {symbol} not found in StockGro universe")
    # Use stock_details with 'candle_chart' section
    data = await stock_details(stock_id, ["candle_chart"])
    # Assume response shape: {'candle_chart': {...}}
    return data.get("candle_chart", {})
"""Async client for StockGro API with HMAC-SHA256 signing for headers.

Docs: Base URL https://prod.stockgro.com/public/api/v1
"""
import httpx
import hmac
import hashlib
import time
import os
import asyncio
from ..config import settings
import logging

logger = logging.getLogger("stockgro")


def _sign(client_id: str, client_secret: str, nonce: str) -> str:
    msg = f"{client_id}:{nonce}".encode()
    key = client_secret.encode()
    return hmac.new(key, msg, hashlib.sha256).hexdigest()


async def _post(path: str, json=None) -> dict:
    url = f"https://prod.stockgro.com/public/api/v1{path}"
    nonce = str(int(time.time() * 1000))
    signature = _sign(settings.STOCKGRO_CLIENT_ID, settings.STOCKGRO_CLIENT_SECRET, nonce)
    headers = {
        "X-Client-Id": settings.STOCKGRO_CLIENT_ID,
        "X-Signature": signature,
        "X-Nonce": nonce,
        "Content-Type": "application/json",
    }
    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.post(url, json=json, headers=headers)
        r.raise_for_status()
        return r.json()


async def _get(path: str, params: dict = None) -> dict:
    url = f"https://prod.stockgro.com/public/api/v1{path}"
    nonce = str(int(time.time() * 1000))
    signature = _sign(settings.STOCKGRO_CLIENT_ID, settings.STOCKGRO_CLIENT_SECRET, nonce)
    headers = {
        "X-Client-Id": settings.STOCKGRO_CLIENT_ID,
        "X-Signature": signature,
        "X-Nonce": nonce,
    }
    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.get(url, params=params, headers=headers)
        r.raise_for_status()
        return r.json()


async def list_stocks() -> dict:
    return await _get("/stocks")


async def search_stocks(q: str, page: int = 1, per_page: int = 20) -> dict:
    params = {"q": q, "page": page, "per_page": per_page}
    return await _get("/stocks/search", params=params)


async def stock_details(stock_id: str, sections: list) -> dict:
    payload = {"stock_id": stock_id, "sections": sections}
    return await _post(f"/stock/details/{stock_id}", json=payload)
