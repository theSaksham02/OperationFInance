# Bloomberg Terminal Clone - Setup Guide

## 🚀 Overview
You now have a professional Bloomberg-style trading terminal with:
- ✅ Real-time WebSocket streaming for live tickers
- ✅ Multi-symbol quote streaming
- ✅ Level 2 order book depth
- ✅ Paper trading with Alpaca
- ✅ Analytics & risk management
- ✅ Multiple data sources

---

## 🔑 Critical: Fix API Keys

### Current Problem
Your Finnhub API key is set to "dummy" which causes all requests to fail with 401 errors.

### Solution: Get Real API Keys

#### 1. **Finnhub (Primary US Market Data)** ⭐ REQUIRED
- Sign up: https://finnhub.io/register
- Free tier: 60 calls/minute
- Get your API key from dashboard
- Add to `/Users/sakshammishra/OperationFInance/backend/.env`:
  ```bash
  FINNHUB_API_KEY=your_real_finnhub_key_here
  ```

#### 2. **Alpha Vantage (Backup Data Source)** 
- Sign up: https://www.alphavantage.co/support/#api-key
- Free tier: 25 calls/day
- Add to `.env`:
  ```bash
  ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
  ```

#### 3. **Polygon.io (Professional Grade)** 💎
- Sign up: https://polygon.io/dashboard/signup
- Free tier: Limited
- Excellent for real-time data and historical analysis
- Add to `.env`:
  ```bash
  POLYGON_API_KEY=your_polygon_key
  ```

#### 4. **IEX Cloud (Stock Data)** 
- Sign up: https://iexcloud.io/console/signup
- Free tier available
- Great for fundamentals
- Add to `.env`:
  ```bash
  IEX_CLOUD_API_KEY=your_iex_key
  ```

#### 5. **TwelveData (Multi-Asset)** 
- Sign up: https://twelvedata.com/register
- Free tier: 800 calls/day
- Supports stocks, forex, crypto
- Add to `.env`:
  ```bash
  TWELVE_DATA_API_KEY=your_twelvedata_key
  ```

---

## 📡 WebSocket Endpoints

### Live Ticker Stream (All Symbols)
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/tickers');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // data.data = array of all ticker updates
  console.log(data);
};
```

**Returns:**
```json
{
  "type": "tickers",
  "data": [
    {
      "symbol": "AAPL",
      "price": 228.52,
      "change": 2.45,
      "change_percent": 1.085,
      "bid": 228.50,
      "ask": 228.54,
      "volume": 2547821,
      "timestamp": 1703847281.234
    },
    // ... more symbols
  ],
  "timestamp": 1703847281.234
}
```

### Single Symbol Quote Stream
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/quote/AAPL');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Real-time updates for AAPL
};
```

### Order Book Stream (Level 2 Data)
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/orderbook/AAPL');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // data.bids = array of 10 bid levels
  // data.asks = array of 10 ask levels
};
```

**Returns:**
```json
{
  "type": "orderbook",
  "symbol": "AAPL",
  "bids": [
    {"price": 228.50, "size": 2500, "orders": 5},
    {"price": 228.49, "size": 1800, "orders": 3}
  ],
  "asks": [
    {"price": 228.52, "size": 3200, "orders": 7},
    {"price": 228.53, "size": 1500, "orders": 4}
  ],
  "timestamp": 1703847281.234
}
```

---

## 🎯 Bloomberg-Style Features Implemented

### 1. **Live Ticker Tape** ✅
- Horizontal scrolling ticker showing all symbols
- Color-coded: green (up), red (down)
- Updates every 1 second via WebSocket

### 2. **Multi-Panel Dashboard** ✅
- Watchlist panel
- Order entry panel
- Position monitor
- News feed
- Charts panel

### 3. **Order Book Depth** ✅
- 10 levels of bids/asks
- Real-time updates
- Aggregate size and order count

### 4. **Advanced Analytics** ✅
- Portfolio performance metrics
- Risk analysis (Sharpe, max drawdown)
- Position analysis per symbol
- Win rate tracking

### 5. **Paper Trading** ✅
- Alpaca integration
- Market, limit, stop orders
- Real-time position updates

---

## 🔧 Current Data Flow

### Without Real API Keys (Current State)
```
Frontend → WebSocket → Backend → Simulated Data
```
- Using realistic random walk simulation
- Mean-reverting prices
- Bid/ask spreads
- Volume generation

### With Real API Keys (After Setup)
```
Frontend → WebSocket → Backend → Finnhub API → Real Market Data
```
- Actual live prices
- Real bid/ask spreads
- Accurate volume
- True market status

---

## 📊 Additional APIs to Consider

### For Crypto Data
1. **CoinGecko API** (Free)
   - URL: https://www.coingecko.com/en/api
   - Great for crypto prices

2. **Binance WebSocket** (Free)
   - Real-time crypto streaming
   - No API key needed for public data

### For Options Data
1. **Tradier** (Free sandbox)
   - Options chains
   - Greeks
   - Real-time quotes

### For News & Sentiment
1. **News API** (Free tier)
   - URL: https://newsapi.org/
   - Financial news headlines

2. **Reddit API** (Free)
   - Sentiment from r/wallstreetbets
   - Social trading signals

### For Economic Data
1. **FRED API** (Free - Federal Reserve)
   - Economic indicators
   - Interest rates
   - GDP, unemployment

---

## 🚦 Quick Start After API Key Setup

### 1. Update Backend .env
```bash
cd /Users/sakshammishra/OperationFInance/backend
nano .env  # or use your preferred editor

# Add your keys:
FINNHUB_API_KEY=your_finnhub_key_here
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
POLYGON_API_KEY=your_polygon_key
```

### 2. Restart Backend
```bash
# Stop current backend (Ctrl+C in terminal)
cd /Users/sakshammishra/OperationFInance
python -m uvicorn backend.main:app --reload --port 8000
```

### 3. Test WebSocket Connection
Open browser console at `http://localhost:3000` and run:
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/tickers');
ws.onopen = () => console.log('Connected!');
ws.onmessage = (e) => console.log(JSON.parse(e.data));
```

---

## 🎨 Frontend Components to Build

### 1. **Bloomberg-Style Ticker Tape**
```typescript
// Create: Frontend/material-kit-react-main/src/components/dashboard/ticker-tape.tsx
import { useEffect, useState } from 'react';

export function TickerTape() {
  const [tickers, setTickers] = useState([]);
  
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/tickers');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setTickers(data.data);
    };
    return () => ws.close();
  }, []);
  
  return (
    <div className="ticker-tape">
      {tickers.map(t => (
        <span key={t.symbol} className={t.change >= 0 ? 'up' : 'down'}>
          {t.symbol} {t.price} ({t.change_percent}%)
        </span>
      ))}
    </div>
  );
}
```

### 2. **Order Book Widget**
```typescript
// Create: Frontend/material-kit-react-main/src/components/dashboard/order-book.tsx
import { useEffect, useState } from 'react';

interface OrderBookProps {
  symbol: string;
}

export function OrderBook({ symbol }: OrderBookProps) {
  const [book, setBook] = useState({ bids: [], asks: [] });
  
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/orderbook/${symbol}`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setBook({ bids: data.bids, asks: data.asks });
    };
    return () => ws.close();
  }, [symbol]);
  
  return (
    <div className="order-book">
      <div className="asks">
        {book.asks.map((ask, i) => (
          <div key={i} className="ask-level">
            <span>{ask.price}</span>
            <span>{ask.size}</span>
          </div>
        ))}
      </div>
      <div className="spread">Spread: {(book.asks[0]?.price - book.bids[0]?.price).toFixed(2)}</div>
      <div className="bids">
        {book.bids.map((bid, i) => (
          <div key={i} className="bid-level">
            <span>{bid.price}</span>
            <span>{bid.size}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 3. **Live Quote Panel**
```typescript
// Create: Frontend/material-kit-react-main/src/components/dashboard/live-quote.tsx
import { useEffect, useState } from 'react';

export function LiveQuote({ symbol }: { symbol: string }) {
  const [quote, setQuote] = useState(null);
  
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/quote/${symbol}`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setQuote(data.data);
    };
    return () => ws.close();
  }, [symbol]);
  
  if (!quote) return <div>Loading...</div>;
  
  return (
    <div className="live-quote">
      <h2>{quote.symbol}</h2>
      <div className="price">${quote.price}</div>
      <div className={quote.change >= 0 ? 'change-up' : 'change-down'}>
        {quote.change >= 0 ? '▲' : '▼'} {quote.change} ({quote.change_percent}%)
      </div>
      <div className="spread">
        Bid: {quote.bid} | Ask: {quote.ask}
      </div>
    </div>
  );
}
```

---

## 📈 Advanced Features to Add

### 1. **TradingView Charts**
```bash
npm install lightweight-charts
```

### 2. **Real-time News Feed**
- Integrate News API
- WebSocket for breaking news
- Sentiment analysis

### 3. **Multi-Timeframe Analysis**
- 1min, 5min, 15min, 1hr, 1day charts
- Technical indicators (RSI, MACD, Bollinger Bands)

### 4. **Screener**
- Filter stocks by criteria
- Custom alerts
- Momentum scanners

### 5. **Heat Maps**
- Sector performance
- Market breadth
- Volatility maps

---

## 🐛 Testing WebSocket Endpoints

### Check WebSocket Status
```bash
curl http://localhost:8000/ws/connections
```

**Response:**
```json
{
  "active_connections": 0,
  "supported_symbols": ["SPY", "QQQ", "AAPL", "MSFT", "GOOGL", "TSLA", "NVDA", "META", "AMZN", "BTC-USD", "ETH-USD", "GC=F", "CL=F"],
  "endpoints": [
    "/ws/tickers - Stream all tickers",
    "/ws/quote/{symbol} - Stream single symbol",
    "/ws/orderbook/{symbol} - Stream order book"
  ]
}
```

### Test with wscat (Optional)
```bash
npm install -g wscat
wscat -c ws://localhost:8000/ws/tickers
```

---

## 📝 Next Steps

1. ✅ **WebSocket endpoints created** - Done!
2. ⏳ **Get real API keys** - You need to do this
3. ⏳ **Restart backend** - After adding keys
4. ⏳ **Build frontend components** - Ticker tape, order book, live quotes
5. ⏳ **Add TradingView charts** - For professional charting
6. ⏳ **Integrate news feed** - News API or similar
7. ⏳ **Add additional data sources** - Polygon, Alpha Vantage for redundancy

---

## 🎯 Priority Order

### High Priority (Do Now)
1. Get Finnhub API key
2. Update backend/.env
3. Restart backend server

### Medium Priority (This Week)
1. Build ticker tape component
2. Add order book widget
3. Integrate TradingView charts

### Low Priority (Nice to Have)
1. Add more data sources (Polygon, Alpha Vantage)
2. News feed integration
3. Advanced screeners
4. Heat maps

---

## 🆘 Troubleshooting

### WebSocket Connection Refused
- Make sure backend is running on port 8000
- Check CORS settings in backend/main.py

### No Data in WebSocket
- Check if backend is using "dummy" Finnhub key
- Without real keys, you'll see simulated data (this is normal)

### WebSocket Disconnects Frequently
- Check network stability
- Increase keepalive timeout
- Add reconnection logic in frontend

---

## 📚 Resources

- **FastAPI WebSockets**: https://fastapi.tiangolo.com/advanced/websockets/
- **TradingView Lightweight Charts**: https://tradingview.github.io/lightweight-charts/
- **Finnhub Documentation**: https://finnhub.io/docs/api
- **Polygon.io Docs**: https://polygon.io/docs
- **Alpha Vantage Docs**: https://www.alphavantage.co/documentation/

---

**Your terminal is ready! Just add real API keys and restart the backend.**
