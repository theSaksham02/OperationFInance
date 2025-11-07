"""Market data endpoints: live quotes, market status, ticker data."""
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from decimal import Decimal

from ..services import finnhub, stockgro
from ..schemas import Market


router = APIRouter(prefix="/market", tags=["market"])


@router.get("/quote/{symbol}")
async def get_quote(symbol: str, market: Market = Query(Market.US)):
    """Get real-time quote for a symbol."""
    try:
        if market == Market.US:
            quote = await finnhub.get_quote(symbol)
            return {
                "symbol": symbol,
                "market": "US",
                "price": quote.get("c", 0),
                "change": quote.get("d", 0),
                "change_percent": quote.get("dp", 0),
                "high": quote.get("h", 0),
                "low": quote.get("l", 0),
                "open": quote.get("o", 0),
                "prev_close": quote.get("pc", 0),
                "timestamp": quote.get("t", 0)
            }
        else:  # India
            quote = await stockgro.get_realtime_quote(symbol)
            return {
                "symbol": symbol,
                "market": "IN",
                "price": quote.get("last_price", 0),
                "change": quote.get("change", 0),
                "change_percent": quote.get("change_percent", 0),
                "high": quote.get("high", 0),
                "low": quote.get("low", 0),
                "open": quote.get("open", 0),
                "prev_close": quote.get("prev_close", 0),
                "volume": quote.get("volume", 0)
            }
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch quote: {str(e)}")


@router.get("/quotes")
async def get_multiple_quotes(symbols: str = Query(..., description="Comma-separated symbols"), market: Market = Query(Market.US)):
    """Get real-time quotes for multiple symbols."""
    symbol_list = [s.strip() for s in symbols.split(",")]
    quotes = []
    
    for symbol in symbol_list:
        try:
            if market == Market.US:
                quote = await finnhub.get_quote(symbol)
                quotes.append({
                    "symbol": symbol,
                    "price": quote.get("c", 0),
                    "change_percent": quote.get("dp", 0),
                    "high": quote.get("h", 0),
                    "low": quote.get("l", 0),
                })
            else:
                quote = await stockgro.get_realtime_quote(symbol)
                quotes.append({
                    "symbol": symbol,
                    "price": quote.get("last_price", 0),
                    "change_percent": quote.get("change_percent", 0),
                    "high": quote.get("high", 0),
                    "low": quote.get("low", 0),
                })
        except Exception as e:
            # Skip failed quotes
            quotes.append({
                "symbol": symbol,
                "price": 0,
                "change_percent": 0,
                "error": str(e)
            })
    
    return {"quotes": quotes}


@router.get("/search")
async def search_symbols(query: str = Query(..., min_length=1), market: Market = Query(Market.US)):
    """Search for symbols by name or ticker."""
    # For now, return a simple list. In production, you'd query a symbol database
    if market == Market.US:
        # Common US stocks
        common_stocks = [
            {"symbol": "AAPL", "name": "Apple Inc.", "type": "stock"},
            {"symbol": "MSFT", "name": "Microsoft Corporation", "type": "stock"},
            {"symbol": "GOOGL", "name": "Alphabet Inc.", "type": "stock"},
            {"symbol": "AMZN", "name": "Amazon.com Inc.", "type": "stock"},
            {"symbol": "TSLA", "name": "Tesla Inc.", "type": "stock"},
            {"symbol": "META", "name": "Meta Platforms Inc.", "type": "stock"},
            {"symbol": "NVDA", "name": "NVIDIA Corporation", "type": "stock"},
            {"symbol": "JPM", "name": "JPMorgan Chase & Co.", "type": "stock"},
            {"symbol": "V", "name": "Visa Inc.", "type": "stock"},
            {"symbol": "WMT", "name": "Walmart Inc.", "type": "stock"},
            {"symbol": "SPY", "name": "SPDR S&P 500 ETF", "type": "etf"},
            {"symbol": "QQQ", "name": "Invesco QQQ Trust", "type": "etf"},
        ]
    else:
        # Common Indian stocks
        common_stocks = [
            {"symbol": "RELIANCE.NS", "name": "Reliance Industries Ltd", "type": "stock"},
            {"symbol": "TCS.NS", "name": "Tata Consultancy Services", "type": "stock"},
            {"symbol": "HDFCBANK.NS", "name": "HDFC Bank Ltd", "type": "stock"},
            {"symbol": "INFY.NS", "name": "Infosys Ltd", "type": "stock"},
            {"symbol": "HINDUNILVR.NS", "name": "Hindustan Unilever Ltd", "type": "stock"},
            {"symbol": "ICICIBANK.NS", "name": "ICICI Bank Ltd", "type": "stock"},
            {"symbol": "SBIN.NS", "name": "State Bank of India", "type": "stock"},
            {"symbol": "BHARTIARTL.NS", "name": "Bharti Airtel Ltd", "type": "stock"},
            {"symbol": "ITC.NS", "name": "ITC Ltd", "type": "stock"},
            {"symbol": "KOTAKBANK.NS", "name": "Kotak Mahindra Bank", "type": "stock"},
        ]
    
    # Filter by query
    query_lower = query.lower()
    filtered = [
        stock for stock in common_stocks
        if query_lower in stock["symbol"].lower() or query_lower in stock["name"].lower()
    ]
    
    return {"results": filtered[:10]}  # Limit to 10 results


@router.get("/ticker")
async def get_market_ticker():
    """Get scrolling market ticker data."""
    # Get a mix of US and Indian market data
    ticker_data = []
    
    # US Markets
    us_symbols = ["SPY", "QQQ", "DIA", "AAPL", "TSLA", "NVDA"]
    for symbol in us_symbols:
        try:
            quote = await finnhub.get_quote(symbol)
            ticker_data.append({
                "symbol": symbol,
                "price": quote.get("c", 0),
                "change": quote.get("dp", 0)
            })
        except:
            pass
    
    # Indian Markets - simplified fallback
    ticker_data.extend([
        {"symbol": "NIFTY 50", "price": 24315.4, "change": 0.68},
        {"symbol": "SENSEX", "price": 79842.9, "change": 0.54},
    ])
    
    return {"items": ticker_data}


@router.get("/status")
async def get_market_status():
    """Get market open/close status."""
    from datetime import datetime, time
    import pytz
    
    now_utc = datetime.now(pytz.UTC)
    
    # US Market (NYSE): 9:30 AM - 4:00 PM EST
    us_tz = pytz.timezone('US/Eastern')
    us_time = now_utc.astimezone(us_tz)
    us_market_open = time(9, 30)
    us_market_close = time(16, 0)
    us_is_open = (
        us_time.weekday() < 5 and  # Monday-Friday
        us_market_open <= us_time.time() <= us_market_close
    )
    
    # Indian Market (NSE): 9:15 AM - 3:30 PM IST
    in_tz = pytz.timezone('Asia/Kolkata')
    in_time = now_utc.astimezone(in_tz)
    in_market_open = time(9, 15)
    in_market_close = time(15, 30)
    in_is_open = (
        in_time.weekday() < 5 and  # Monday-Friday
        in_market_open <= in_time.time() <= in_market_close
    )
    
    return {
        "us_market": {
            "is_open": us_is_open,
            "local_time": us_time.strftime("%I:%M %p %Z"),
            "next_open": "9:30 AM EST" if not us_is_open else None,
            "next_close": "4:00 PM EST" if us_is_open else None
        },
        "india_market": {
            "is_open": in_is_open,
            "local_time": in_time.strftime("%I:%M %p %Z"),
            "next_open": "9:15 AM IST" if not in_is_open else None,
            "next_close": "3:30 PM IST" if in_is_open else None
        }
    }
