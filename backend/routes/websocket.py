"""WebSocket endpoints for real-time data streaming."""
import asyncio
import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Set, Dict, Any
import logging
from decimal import Decimal
import random

from ..services import finnhub
from ..config import settings

logger = logging.getLogger(__name__)
router = APIRouter(tags=["websocket"])

# Active WebSocket connections
active_connections: Set[WebSocket] = set()

# Simulated live data for demo purposes (when API keys are invalid)
DEMO_TICKERS = {
    "SPY": {"base": 562.45, "volatility": 0.002},
    "QQQ": {"base": 485.32, "volatility": 0.003},
    "AAPL": {"base": 228.52, "volatility": 0.004},
    "MSFT": {"base": 415.26, "volatility": 0.003},
    "GOOGL": {"base": 175.48, "volatility": 0.005},
    "TSLA": {"base": 242.84, "volatility": 0.008},
    "NVDA": {"base": 145.89, "volatility": 0.006},
    "META": {"base": 567.12, "volatility": 0.005},
    "AMZN": {"base": 196.43, "volatility": 0.004},
    "BTC-USD": {"base": 76543.21, "volatility": 0.015},
    "ETH-USD": {"base": 2845.67, "volatility": 0.012},
    "GC=F": {"base": 2765.30, "volatility": 0.002},  # Gold
    "CL=F": {"base": 75.42, "volatility": 0.008},  # Crude Oil
}


def generate_live_price(symbol: str, prev_price: float = None) -> Dict[str, Any]:
    """Generate realistic live price data."""
    if symbol in DEMO_TICKERS:
        config = DEMO_TICKERS[symbol]
        base = prev_price if prev_price else config["base"]
        
        # Random walk with mean reversion
        change_pct = random.gauss(0, config["volatility"])
        mean_reversion = (config["base"] - base) * 0.01
        
        new_price = base * (1 + change_pct + mean_reversion)
        change = new_price - base
        change_percent = (change / base) * 100
        
        # Generate bid/ask spread
        spread = new_price * 0.0001
        bid = new_price - spread / 2
        ask = new_price + spread / 2
        
        # Volume simulation
        volume = random.randint(100000, 5000000)
        
        return {
            "symbol": symbol,
            "price": round(new_price, 2),
            "change": round(change, 2),
            "change_percent": round(change_percent, 3),
            "bid": round(bid, 2),
            "ask": round(ask, 2),
            "volume": volume,
            "timestamp": asyncio.get_event_loop().time()
        }
    
    return {
        "symbol": symbol,
        "price": 0,
        "change": 0,
        "change_percent": 0,
        "error": "Unknown symbol"
    }


@router.websocket("/ws/tickers")
async def websocket_tickers(websocket: WebSocket):
    """
    WebSocket endpoint for streaming live ticker data.
    Streams price updates for multiple symbols in real-time.
    """
    await websocket.accept()
    active_connections.add(websocket)
    
    logger.info(f"WebSocket client connected. Active connections: {len(active_connections)}")
    
    # Track last prices for each symbol
    last_prices: Dict[str, float] = {}
    
    try:
        # Main streaming loop
        while True:
            # Generate updates for all symbols
            ticker_data = []
            for symbol in DEMO_TICKERS.keys():
                data = generate_live_price(symbol, last_prices.get(symbol))
                last_prices[symbol] = data.get("price", 0)
                ticker_data.append(data)
            
            # Send batch update
            await websocket.send_json({
                "type": "tickers",
                "data": ticker_data,
                "timestamp": asyncio.get_event_loop().time()
            })
            
            # Update frequency: 1 second (configurable)
            await asyncio.sleep(1)
            
    except WebSocketDisconnect:
        logger.info("WebSocket client disconnected")
        active_connections.discard(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        active_connections.discard(websocket)
        try:
            await websocket.close()
        except:
            pass


@router.websocket("/ws/quote/{symbol}")
async def websocket_quote(websocket: WebSocket, symbol: str):
    """
    WebSocket endpoint for streaming a single symbol's live data.
    Includes price, volume, and order book data.
    """
    await websocket.accept()
    logger.info(f"WebSocket client connected for symbol: {symbol}")
    
    last_price = None
    
    try:
        while True:
            # Try to get real data from Finnhub first
            try:
                if settings.FINNHUB_API_KEY and settings.FINNHUB_API_KEY != "dummy":
                    quote = await finnhub.get_quote(symbol)
                    data = {
                        "symbol": symbol,
                        "price": quote.get("c", 0),
                        "change": quote.get("d", 0),
                        "change_percent": quote.get("dp", 0),
                        "high": quote.get("h", 0),
                        "low": quote.get("l", 0),
                        "open": quote.get("o", 0),
                        "prev_close": quote.get("pc", 0),
                        "timestamp": quote.get("t", 0),
                        "source": "finnhub"
                    }
                else:
                    # Use simulated data
                    data = generate_live_price(symbol, last_price)
                    data["source"] = "simulation"
                    
                last_price = data.get("price")
                
            except Exception as e:
                logger.warning(f"Failed to get quote for {symbol}: {e}, using simulation")
                data = generate_live_price(symbol, last_price)
                data["source"] = "simulation"
                last_price = data.get("price")
            
            await websocket.send_json({
                "type": "quote",
                "data": data
            })
            
            # Update every 1 second
            await asyncio.sleep(1)
            
    except WebSocketDisconnect:
        logger.info(f"WebSocket client disconnected for {symbol}")
    except Exception as e:
        logger.error(f"WebSocket error for {symbol}: {e}")
        try:
            await websocket.close()
        except:
            pass


@router.websocket("/ws/orderbook/{symbol}")
async def websocket_orderbook(websocket: WebSocket, symbol: str):
    """
    WebSocket endpoint for streaming order book depth data.
    Bloomberg-style level 2 market data.
    """
    await websocket.accept()
    logger.info(f"Order book stream started for: {symbol}")
    
    try:
        while True:
            # Generate simulated order book
            base_price = DEMO_TICKERS.get(symbol, {"base": 100})["base"]
            
            # Generate bid levels
            bids = []
            for i in range(10):
                price = base_price * (1 - 0.0001 * (i + 1))
                size = random.randint(100, 5000)
                bids.append({
                    "price": round(price, 2),
                    "size": size,
                    "orders": random.randint(1, 10)
                })
            
            # Generate ask levels
            asks = []
            for i in range(10):
                price = base_price * (1 + 0.0001 * (i + 1))
                size = random.randint(100, 5000)
                asks.append({
                    "price": round(price, 2),
                    "size": size,
                    "orders": random.randint(1, 10)
                })
            
            await websocket.send_json({
                "type": "orderbook",
                "symbol": symbol,
                "bids": bids,
                "asks": asks,
                "timestamp": asyncio.get_event_loop().time()
            })
            
            # Update every 500ms for order book
            await asyncio.sleep(0.5)
            
    except WebSocketDisconnect:
        logger.info(f"Order book stream closed for {symbol}")
    except Exception as e:
        logger.error(f"Order book stream error for {symbol}: {e}")
        try:
            await websocket.close()
        except:
            pass


@router.get("/ws/connections")
async def get_websocket_status():
    """Get WebSocket connection statistics."""
    return {
        "active_connections": len(active_connections),
        "supported_symbols": list(DEMO_TICKERS.keys()),
        "endpoints": [
            "/ws/tickers - Stream all tickers",
            "/ws/quote/{symbol} - Stream single symbol",
            "/ws/orderbook/{symbol} - Stream order book"
        ]
    }
