# 🔌 API Integration Guide

This document shows how each API will be integrated into your Bloomberg terminal.

---

## 📊 Data Source Architecture

```
┌─────────────────────────────────────────────────┐
│           Bloomberg Terminal Frontend            │
│         (WebSocket + REST API calls)             │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│              FastAPI Backend                     │
│         (Smart routing & caching)                │
└─────────────────┬───────────────────────────────┘
                  │
    ┌─────────────┼─────────────┬──────────────┐
    │             │             │              │
┌───▼──┐    ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
│Finnhub│   │Polygon  │   │ Alpha   │   │ Alpaca  │
│(Real- │   │ (Pro    │   │Vantage  │   │ (Paper  │
│time)  │   │ Data)   │   │(Backup) │   │Trading) │
└───────┘    └─────────┘   └─────────┘   └─────────┘
```

---

## 🎯 Data Source Priority System

When you request market data, the backend will try sources in this order:

### For Real-time Quotes:
1. **Finnhub** (primary) - Fast, reliable
2. **Polygon** (if Finnhub fails) - High quality
3. **Alpha Vantage** (backup) - If both fail
4. **Simulated Data** (last resort) - If all APIs fail

### For Historical Data:
1. **Polygon** (best historical)
2. **Alpha Vantage** (backup)
3. **Finnhub** (if others unavailable)

### For Trading:
1. **Alpaca** (only source) - Paper trading

### For News:
1. **News API** (if available)
2. **Finnhub News** (backup)

---

## 📡 Service Implementations

### 1. Finnhub Service (Already Exists ✅)

**File:** `backend/services/finnhub.py`

**Current status:** Working but using "dummy" key

**What it provides:**
- `get_quote(symbol)` - Current price
- `get_company_profile(symbol)` - Company info
- `get_news(symbol)` - Company news

**Usage after adding key:**
```python
from backend.services import finnhub

# Get real-time quote
quote = await finnhub.get_quote("AAPL")
print(quote)
# {'c': 228.52, 'd': 2.45, 'dp': 1.08, 'h': 230.12, 'l': 227.84}
```

---

### 2. Polygon Service (NEW - Will Create)

**File:** `backend/services/polygon_service.py` (to be created)

**What it will provide:**
- Historical prices (minute, hour, day bars)
- Aggregates & OHLCV data
- Real-time trades stream
- Options chains
- Company financials

**Example usage:**
```python
from backend.services import polygon_service

# Get previous day's data
data = await polygon_service.get_prev_day("AAPL")

# Get historical bars
bars = await polygon_service.get_bars("AAPL", timespan="minute", limit=100)

# Get real-time trade
trade = await polygon_service.get_last_trade("AAPL")
```

---

### 3. Alpha Vantage Service (NEW - Will Create)

**File:** `backend/services/alpha_vantage.py` (to be created)

**What it will provide:**
- Technical indicators (RSI, MACD, SMA, EMA, etc.)
- Fundamental data
- Global quotes
- Crypto prices
- Forex rates

**Example usage:**
```python
from backend.services import alpha_vantage

# Get quote
quote = await alpha_vantage.get_quote("AAPL")

# Get RSI indicator
rsi = await alpha_vantage.get_rsi("AAPL", interval="daily", time_period=14)

# Get company overview
overview = await alpha_vantage.get_overview("AAPL")
```

---

### 4. News API Service (NEW - Will Create)

**File:** `backend/services/news_service.py` (to be created)

**What it will provide:**
- Breaking news headlines
- Company-specific news
- Sector news
- Market sentiment

**Example usage:**
```python
from backend.services import news_service

# Get top headlines
headlines = await news_service.get_top_headlines(category="business")

# Get company news
news = await news_service.get_company_news("Apple")

# Search news
results = await news_service.search("Federal Reserve")
```

---

### 5. Alpaca Service (Already Exists ✅)

**File:** `backend/services/alpaca.py`

**Current status:** ✅ Working!

**What it provides:**
- Paper trading
- Place orders
- Get portfolio
- Get positions
- Get account info

**Already working:**
```python
from backend.services import alpaca

# Get trading client
client = alpaca.get_trading_client()

# Place order
order = await alpaca.place_order("AAPL", qty=10, side="buy")

# Get portfolio
portfolio = await alpaca.get_portfolio()
```

---

## 🔄 Smart Data Routing

### Market Data Endpoint Enhancement

**Current:** `backend/routes/market.py`

**Will be enhanced to:**

```python
@router.get("/market/quote/{symbol}")
async def get_quote(symbol: str):
    """
    Smart quote fetching with fallback chain:
    1. Try Finnhub
    2. If failed, try Polygon
    3. If failed, try Alpha Vantage
    4. If all failed, return cached or simulated data
    """
    
    # Try Finnhub first (fastest)
    try:
        if settings.FINNHUB_API_KEY:
            quote = await finnhub.get_quote(symbol)
            quote['source'] = 'finnhub'
            return quote
    except Exception as e:
        logger.warning(f"Finnhub failed: {e}")
    
    # Try Polygon (best quality)
    try:
        if settings.POLYGON_API_KEY:
            quote = await polygon_service.get_quote(symbol)
            quote['source'] = 'polygon'
            return quote
    except Exception as e:
        logger.warning(f"Polygon failed: {e}")
    
    # Try Alpha Vantage (backup)
    try:
        if settings.ALPHA_VANTAGE_API_KEY:
            quote = await alpha_vantage.get_quote(symbol)
            quote['source'] = 'alpha_vantage'
            return quote
    except Exception as e:
        logger.warning(f"Alpha Vantage failed: {e}")
    
    # Last resort: simulated data
    return generate_simulated_quote(symbol)
```

---

## 📈 New Endpoints to Add

### Technical Indicators
```python
@router.get("/market/indicators/{symbol}")
async def get_indicators(symbol: str, indicator: str = "RSI"):
    """
    Get technical indicators:
    - RSI (Relative Strength Index)
    - MACD (Moving Average Convergence Divergence)
    - SMA (Simple Moving Average)
    - EMA (Exponential Moving Average)
    - Bollinger Bands
    """
    return await alpha_vantage.get_indicator(symbol, indicator)
```

### Historical Data
```python
@router.get("/market/history/{symbol}")
async def get_history(
    symbol: str,
    interval: str = "1day",
    limit: int = 100
):
    """
    Get historical OHLCV data
    Intervals: 1min, 5min, 15min, 1hour, 1day
    """
    return await polygon_service.get_bars(symbol, interval, limit)
```

### News Feed
```python
@router.get("/market/news")
async def get_news(
    symbol: Optional[str] = None,
    category: str = "business",
    limit: int = 20
):
    """
    Get market news
    If symbol provided: company-specific news
    Otherwise: top headlines
    """
    if symbol:
        return await news_service.get_company_news(symbol)
    return await news_service.get_top_headlines(category, limit)
```

### Market Screener
```python
@router.get("/market/screener")
async def screen_stocks(
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_volume: Optional[int] = None,
    min_change_percent: Optional[float] = None
):
    """
    Screen stocks based on criteria
    """
    return await polygon_service.screen(
        min_price=min_price,
        max_price=max_price,
        min_volume=min_volume,
        min_change_percent=min_change_percent
    )
```

---

## 🎨 Frontend Enhancements

### New Components to Add

#### 1. News Feed Widget
```typescript
// components/dashboard/news-feed.tsx
export function NewsFeed({ symbol }: { symbol?: string }) {
  const [news, setNews] = useState([]);
  
  useEffect(() => {
    const url = symbol 
      ? `/market/news?symbol=${symbol}`
      : '/market/news';
    
    fetch(`http://localhost:8000${url}`)
      .then(r => r.json())
      .then(setNews);
  }, [symbol]);
  
  return (
    <Card>
      <CardHeader title="Market News" />
      <CardContent>
        {news.map(article => (
          <NewsItem key={article.url} article={article} />
        ))}
      </CardContent>
    </Card>
  );
}
```

#### 2. Technical Indicators Widget
```typescript
// components/dashboard/indicators.tsx
export function TechnicalIndicators({ symbol }: { symbol: string }) {
  const [indicators, setIndicators] = useState({});
  
  useEffect(() => {
    Promise.all([
      fetch(`/market/indicators/${symbol}?indicator=RSI`),
      fetch(`/market/indicators/${symbol}?indicator=MACD`),
      fetch(`/market/indicators/${symbol}?indicator=SMA`)
    ]).then(async ([rsi, macd, sma]) => {
      setIndicators({
        rsi: await rsi.json(),
        macd: await macd.json(),
        sma: await sma.json()
      });
    });
  }, [symbol]);
  
  return (
    <Card>
      <CardHeader title="Technical Indicators" />
      <CardContent>
        <IndicatorDisplay label="RSI(14)" value={indicators.rsi} />
        <IndicatorDisplay label="MACD" value={indicators.macd} />
        <IndicatorDisplay label="SMA(50)" value={indicators.sma} />
      </CardContent>
    </Card>
  );
}
```

#### 3. Historical Chart
```typescript
// components/dashboard/historical-chart.tsx
import { createChart } from 'lightweight-charts';

export function HistoricalChart({ symbol }: { symbol: string }) {
  const chartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!chartRef.current) return;
    
    const chart = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: 400
    });
    
    fetch(`/market/history/${symbol}?interval=1day&limit=100`)
      .then(r => r.json())
      .then(data => {
        const candlestickSeries = chart.addCandlestickSeries();
        candlestickSeries.setData(data.bars);
      });
    
    return () => chart.remove();
  }, [symbol]);
  
  return <div ref={chartRef} />;
}
```

---

## 📊 Rate Limiting Strategy

To avoid hitting API limits, we'll implement:

### 1. Caching Layer
```python
from functools import lru_cache
from datetime import datetime, timedelta

# Cache quotes for 5 seconds
@lru_cache(maxsize=1000)
def cached_quote(symbol: str, timestamp: int):
    """Cache based on symbol and 5-second timestamp"""
    return fetch_real_quote(symbol)

def get_quote_with_cache(symbol: str):
    # Round timestamp to nearest 5 seconds
    ts = int(datetime.now().timestamp() / 5)
    return cached_quote(symbol, ts)
```

### 2. Request Pooling
```python
# Batch multiple symbol requests into one API call
async def get_quotes_batch(symbols: List[str]):
    """Get multiple quotes in single API call"""
    if len(symbols) <= 1:
        return await get_quote(symbols[0])
    
    # Use Polygon batch endpoint
    return await polygon_service.get_quotes_batch(symbols)
```

### 3. WebSocket for Real-time
```python
# Use WebSocket connections where available
# Finnhub, Polygon, Alpaca all support WebSocket
async def stream_quotes_websocket(symbols: List[str]):
    """Stream quotes via WebSocket instead of polling"""
    async with websocket_connection() as ws:
        await ws.subscribe(symbols)
        async for quote in ws:
            yield quote
```

---

## 🔐 Configuration Updates

**File:** `backend/config.py`

**Will add:**
```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Existing
    DATABASE_URL: str
    SECRET_KEY: str
    CORS_ORIGINS: str
    
    # Already configured
    FINNHUB_API_KEY: str = "dummy"
    ALPACA_API_KEY: str
    ALPACA_SECRET_KEY: str
    ALPACA_BASE_URL: str
    
    # NEW - Will add when you provide keys
    POLYGON_API_KEY: str | None = None
    ALPHA_VANTAGE_API_KEY: str | None = None
    NEWSAPI_KEY: str | None = None
    IEX_CLOUD_API_KEY: str | None = None
    TWELVE_DATA_API_KEY: str | None = None
    COINGECKO_API_KEY: str | None = None
    
    # Rate limiting
    ENABLE_CACHING: bool = True
    CACHE_TTL_SECONDS: int = 5
    
    # Feature flags
    ENABLE_NEWS: bool = True
    ENABLE_TECHNICAL_INDICATORS: bool = True
    ENABLE_HISTORICAL_DATA: bool = True
    
    class Config:
        env_file = ".env"
```

---

## 🚀 Deployment Checklist

After you provide API keys, I will:

1. ✅ Update `backend/.env` with all keys
2. ✅ Create new service files:
   - `backend/services/polygon_service.py`
   - `backend/services/alpha_vantage.py`
   - `backend/services/news_service.py`
3. ✅ Update `backend/config.py` with new settings
4. ✅ Enhance `backend/routes/market.py` with smart routing
5. ✅ Add new endpoints (indicators, history, news)
6. ✅ Test all API connections
7. ✅ Update WebSocket to use real data
8. ✅ Create frontend components (news feed, indicators)
9. ✅ Add rate limiting and caching
10. ✅ Update documentation

---

## 📝 Testing Plan

### Phase 1: Basic Connectivity
```bash
# Test each API key
curl "https://finnhub.io/api/v1/quote?symbol=AAPL&token=YOUR_KEY"
curl "https://api.polygon.io/v2/last/trade/AAPL?apiKey=YOUR_KEY"
curl "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=YOUR_KEY"
```

### Phase 2: Backend Integration
```bash
# Test smart routing
curl "http://localhost:8000/market/quote/AAPL"

# Test fallback (disable Finnhub temporarily)
curl "http://localhost:8000/market/quote/AAPL"

# Test new endpoints
curl "http://localhost:8000/market/indicators/AAPL?indicator=RSI"
curl "http://localhost:8000/market/history/AAPL?interval=1day&limit=30"
curl "http://localhost:8000/market/news?symbol=AAPL"
```

### Phase 3: WebSocket Real-time
```javascript
// In browser console
const ws = new WebSocket('ws://localhost:8000/ws/tickers');
ws.onmessage = (e) => {
  const data = JSON.parse(e.data);
  console.log('Source:', data.data[0].source); // Should show "finnhub" not "simulation"
};
```

### Phase 4: Frontend Integration
- Open dashboard
- Verify live prices updating
- Check news feed loading
- Verify indicators displaying
- Test chart rendering

---

## 🎯 Expected Performance

### With All APIs Configured:

**Data freshness:**
- Quotes: 1-second updates via WebSocket
- News: 1-minute polling
- Indicators: 5-minute cache
- Historical: 1-hour cache

**API call distribution:**
- Finnhub: 40 calls/min (real-time quotes)
- Polygon: 5 calls/min (historical data)
- Alpha Vantage: 5 calls/min (indicators)
- News API: 1 call/min (headlines)

**Reliability:**
- Primary uptime: 99%+ (Finnhub)
- Automatic failover: <100ms
- Cache hit rate: 80%+

---

## 📞 Next Steps

**Once you provide API keys, tell me in this format:**

```
FINNHUB_API_KEY=cqvt9p1r01qnp7rmktq0
POLYGON_API_KEY=GtL8xPn8ZpHKEXXXXXXX
ALPHA_VANTAGE_API_KEY=ABCDEFGH12345678
```

I will:
1. Add keys to your `.env` file
2. Create new service integrations
3. Add new endpoints
4. Update WebSocket to use real data
5. Test everything
6. Give you full working Bloomberg terminal! 🚀

**Ready when you are!** 🔑
