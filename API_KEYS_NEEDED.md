# 🔑 API Keys Required for Bloomberg Terminal

## Priority 1: MUST HAVE (Get These First)

### 1. **Finnhub** ⭐ CRITICAL - Primary Market Data
**What it does:** Real-time stock quotes, crypto prices, company data  
**Cost:** FREE (60 API calls/minute)  
**Why you need it:** This is your main data source. Without it, you only see simulated data.

**How to get:**
1. Go to: https://finnhub.io/register
2. Sign up with email
3. Verify email
4. Go to dashboard: https://finnhub.io/dashboard
5. Copy your API key (looks like: `cqvt9p1r01qnp7rmktq0cqvt9p1r01qnp7rmktqg`)

**Where to add it:**
```bash
# File: /Users/sakshammishra/OperationFInance/backend/.env
FINNHUB_API_KEY=paste_your_key_here
```

**What it unlocks:**
- Real-time stock prices
- Live crypto prices (BTC, ETH)
- Company profiles
- Market news
- Technical indicators

---

### 2. **Alpaca** ⭐ REQUIRED - Paper Trading
**What it does:** Paper trading (practice trading with fake money)  
**Cost:** FREE  
**Why you need it:** Already integrated! You place real practice trades.

**Status:** ✅ You already have this configured!
- Your credentials are already in `backend/.env`
- Paper trading endpoints working
- Portfolio sync working

**Verify in .env:**
```bash
ALPACA_API_KEY=your_existing_key
ALPACA_SECRET_KEY=your_existing_secret
ALPACA_BASE_URL=https://paper-api.alpaca.markets
```

---

## Priority 2: RECOMMENDED (Get These Next)

### 3. **Polygon.io** 💎 Professional Grade
**What it does:** High-quality market data, better than Finnhub  
**Cost:** FREE tier available (5 API calls/minute), Paid plans from $29/month  
**Why you need it:** Backup data source + better historical data

**How to get:**
1. Go to: https://polygon.io/dashboard/signup
2. Sign up (email required)
3. Go to API Keys: https://polygon.io/dashboard/api-keys
4. Copy your key (looks like: `GtL8xPn8ZpHKEXXXXXXXXXXX`)

**Where to add it:**
```bash
# File: /Users/sakshammishra/OperationFInance/backend/.env
POLYGON_API_KEY=paste_your_key_here
```

**What it unlocks:**
- Historical price data
- More accurate quotes
- Options data
- Trades & quotes streams
- Company financials

---

### 4. **Alpha Vantage** 📊 Backup Data Source
**What it does:** Stock prices, forex, crypto, technical indicators  
**Cost:** FREE (25 API calls/day, 5 calls/minute)  
**Why you need it:** Good backup when Finnhub/Polygon are rate-limited

**How to get:**
1. Go to: https://www.alphavantage.co/support/#api-key
2. Enter email
3. API key sent immediately to email
4. Copy key (looks like: `ABCDEFGH12345678`)

**Where to add it:**
```bash
# File: /Users/sakshammishra/OperationFInance/backend/.env
ALPHA_VANTAGE_API_KEY=paste_your_key_here
```

**What it unlocks:**
- Technical indicators (RSI, MACD, SMA, EMA)
- Fundamental data
- Forex & crypto backup
- Sector performance

---

## Priority 3: NICE TO HAVE (Optional)

### 5. **News API** 📰 Financial News
**What it does:** Real-time news headlines from 80,000+ sources  
**Cost:** FREE (100 requests/day), Developer plan $449/month  
**Why you need it:** Show news feed in Bloomberg terminal

**How to get:**
1. Go to: https://newsapi.org/register
2. Sign up
3. Go to: https://newsapi.org/account
4. Copy API key

**Where to add it:**
```bash
NEWSAPI_KEY=paste_your_key_here
```

**What it unlocks:**
- Breaking news feed
- Company-specific news
- Sentiment analysis
- News timeline

---

### 6. **IEX Cloud** 📈 Financial Data
**What it does:** Stock prices, company data, financials  
**Cost:** FREE (50,000 messages/month), Paid from $9/month  
**Why you need it:** Another backup, good fundamentals data

**How to get:**
1. Go to: https://iexcloud.io/console/signup
2. Sign up
3. Get publishable token from console
4. Copy token (starts with `pk_`)

**Where to add it:**
```bash
IEX_CLOUD_API_KEY=paste_your_key_here
```

**What it unlocks:**
- Real-time quotes
- Historical prices
- Financial statements
- Earnings data
- Dividends & splits

---

### 7. **Twelve Data** 🌍 Multi-Asset Data
**What it does:** Stocks, forex, crypto, commodities  
**Cost:** FREE (800 API calls/day, 8 calls/minute)  
**Why you need it:** Good international coverage

**How to get:**
1. Go to: https://twelvedata.com/register
2. Sign up
3. Go to: https://twelvedata.com/account/api-keys
4. Copy API key

**Where to add it:**
```bash
TWELVE_DATA_API_KEY=paste_your_key_here
```

**What it unlocks:**
- 5000+ global stocks
- 2000+ crypto pairs
- 200+ forex pairs
- Commodities data

---

### 8. **CoinGecko** 🪙 Crypto Data (FREE)
**What it does:** Comprehensive crypto prices  
**Cost:** FREE (10-50 calls/minute), Pro from $129/month  
**Why you need it:** Best free crypto data source

**How to get:**
1. Go to: https://www.coingecko.com/en/api/pricing
2. Sign up for free plan
3. Get API key from dashboard

**Where to add it:**
```bash
COINGECKO_API_KEY=paste_your_key_here
```

**What it unlocks:**
- 10,000+ crypto prices
- Market cap data
- Volume & liquidity
- DeFi data

---

## 🎯 Quick Setup Instructions

### Step 1: Create/Edit .env File
```bash
cd /Users/sakshammishra/OperationFInance/backend

# If .env doesn't exist:
touch .env

# Open in editor:
nano .env
# or
code .env
```

### Step 2: Add Your Keys
```bash
# REQUIRED - Get these first!
FINNHUB_API_KEY=your_finnhub_key_here

# Already configured
ALPACA_API_KEY=your_existing_alpaca_key
ALPACA_SECRET_KEY=your_existing_alpaca_secret
ALPACA_BASE_URL=https://paper-api.alpaca.markets

# RECOMMENDED - Get these next
POLYGON_API_KEY=your_polygon_key_here
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here

# OPTIONAL - Get these if you want extra features
NEWSAPI_KEY=your_newsapi_key_here
IEX_CLOUD_API_KEY=your_iex_key_here
TWELVE_DATA_API_KEY=your_twelvedata_key_here
COINGECKO_API_KEY=your_coingecko_key_here

# Keep existing settings
DATABASE_URL=sqlite:///./tradesphere.db
SECRET_KEY=your_secret_key_here
CORS_ORIGINS=http://localhost:3000
```

### Step 3: Restart Backend
```bash
cd /Users/sakshammishra/OperationFInance
source backend/.venv/bin/activate
python -m uvicorn backend.main:app --reload --port 8000
```

---

## 🧪 Testing Your API Keys

### Test Finnhub:
```bash
curl "https://finnhub.io/api/v1/quote?symbol=AAPL&token=YOUR_FINNHUB_KEY"
```

Expected response:
```json
{
  "c": 228.52,  // current price
  "d": 2.45,    // change
  "dp": 1.08,   // change percent
  "h": 230.12,  // high
  "l": 227.84,  // low
  "o": 228.00,  // open
  "pc": 226.07  // previous close
}
```

### Test Polygon:
```bash
curl "https://api.polygon.io/v2/aggs/ticker/AAPL/prev?apiKey=YOUR_POLYGON_KEY"
```

### Test Alpha Vantage:
```bash
curl "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=YOUR_ALPHA_VANTAGE_KEY"
```

---

## 📊 API Comparison

| API | Free Tier | Rate Limit | Best For | Data Quality |
|-----|-----------|------------|----------|--------------|
| **Finnhub** | ✅ Yes | 60/min | Real-time quotes | ⭐⭐⭐⭐ |
| **Polygon** | ✅ Limited | 5/min | Historical data | ⭐⭐⭐⭐⭐ |
| **Alpha Vantage** | ✅ Yes | 5/min, 25/day | Technical indicators | ⭐⭐⭐ |
| **Alpaca** | ✅ Yes | Unlimited | Paper trading | ⭐⭐⭐⭐⭐ |
| **News API** | ✅ Limited | 100/day | News headlines | ⭐⭐⭐⭐ |
| **IEX Cloud** | ✅ Yes | 50k msg/mo | Fundamentals | ⭐⭐⭐⭐ |
| **Twelve Data** | ✅ Yes | 8/min | International | ⭐⭐⭐ |
| **CoinGecko** | ✅ Yes | 10-50/min | Crypto | ⭐⭐⭐⭐ |

---

## 🔧 Implementation Status

### Already Integrated ✅
- [x] Finnhub (service created, just needs real key)
- [x] StockGro (Indian market)
- [x] Alpaca (paper trading)

### Ready to Add (Need keys + small code changes)
- [ ] Polygon.io
- [ ] Alpha Vantage
- [ ] News API
- [ ] IEX Cloud
- [ ] Twelve Data
- [ ] CoinGecko

---

## 💰 Cost Estimate

### Free Setup (Recommended to Start)
- Finnhub: $0/month
- Alpaca: $0/month (already configured)
- Alpha Vantage: $0/month
- CoinGecko: $0/month
- **Total: $0/month** ✅

### Professional Setup
- Finnhub: $0
- Alpaca: $0
- Polygon.io: $29/month
- IEX Cloud: $9/month
- News API: $449/month (or use free tier)
- **Total: $38-487/month**

---

## 🎯 My Recommendation: START WITH THESE

### Minimum Viable Setup (15 minutes):
1. **Finnhub** - Get this NOW (5 min signup)
2. **Alpaca** - Already have it! ✅

### Good Setup (30 minutes):
1. Finnhub ⭐
2. Alpaca ✅
3. Alpha Vantage (backup)
4. CoinGecko (crypto)

### Professional Setup (1 hour):
1. Finnhub ⭐
2. Alpaca ✅
3. Polygon.io 💎
4. Alpha Vantage
5. IEX Cloud
6. News API
7. CoinGecko

---

## 📝 What to Give Me

Once you sign up, just paste your keys in this format:

```
FINNHUB_API_KEY=cqvt9p1r01qnp7rmktq0
POLYGON_API_KEY=GtL8xPn8ZpHKEXXXXXXX
ALPHA_VANTAGE_API_KEY=ABCDEFGH12345678
NEWSAPI_KEY=1234567890abcdef
IEX_CLOUD_API_KEY=pk_1234567890abcdef
TWELVE_DATA_API_KEY=abc123def456
COINGECKO_API_KEY=CG-xyz123
```

I'll add them to your `.env` file automatically!

---

## ⚠️ Security Notes

1. **NEVER commit .env file to git** (already in .gitignore ✅)
2. **Don't share API keys publicly**
3. **Use separate keys for dev/production**
4. **Rotate keys every 3-6 months**
5. **Monitor usage to detect abuse**

---

## 🚀 After Adding Keys

1. Restart backend
2. Check logs for "401 Unauthorized" errors (should be gone)
3. Test WebSocket: real market data should stream
4. View dashboard: live prices should update

**Your Bloomberg terminal will transform from simulated to REAL live market data! 🎉**
