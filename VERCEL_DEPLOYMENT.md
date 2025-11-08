# Vercel Deployment Guide - TradeSphere (Updated with Live Data & Alpaca)

## 🚀 Quick Deploy to Vercel

### Prerequisites
1. Vercel account (sign up at vercel.com)
2. GitHub repository connected  
3. Backend API keys: Finnhub, Alpaca Paper Trading, StockGro

### Step 1: Deploy Frontend to Vercel

#### Via Vercel Dashboard (Recommended)
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select: `theSaksham02/OperationFInance`
4. Configure:
   - **Framework**: Next.js (auto-detected)
   - **Root Directory**: `Frontend/material-kit-react-main`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (auto-detected)

5. Add Environment Variables:
```
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.railway.app
```

6. Click "Deploy" 🚀

#### Via Vercel CLI
```bash
cd Frontend/material-kit-react-main
npm install -g vercel
vercel login
vercel --prod
vercel env add NEXT_PUBLIC_API_BASE_URL production
```

### Step 2: Deploy Backend to Railway

#### Option A: Railway (Recommended - Free $5/month)
1. Go to [railway.app](https://railway.app)  
2. "New Project" → "Deploy from GitHub"
3. Select `theSaksham02/OperationFInance`
4. Click "Add variables":

```env
# Required
DATABASE_URL=sqlite:///./tradesphere.db
SECRET_KEY=your-super-secret-key-change-this
CORS_ORIGINS=https://your-app.vercel.app

# API Keys (Required for live data)
FINNHUB_API_KEY=your_finnhub_api_key_here
ALPACA_API_KEY=your_alpaca_paper_api_key
ALPACA_API_SECRET=your_alpaca_paper_secret_key
STOCKGRO_CLIENT_ID=your_stockgro_client_id
STOCKGRO_CLIENT_SECRET=your_stockgro_client_secret

# Python
PYTHON_VERSION=3.12
```

5. Set Start Command:
```bash
alembic upgrade head && uvicorn backend.main:app --host 0.0.0.0 --port $PORT
```

6. Deploy! Railway will build and start your backend

7. **Copy your Railway URL** (e.g., `https://operationfinance-production.up.railway.app`)

### Step 3: Update Frontend Environment Variable

After backend is deployed:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Edit `NEXT_PUBLIC_API_BASE_URL`
3. Set value to your Railway URL: `https://your-backend.railway.app`
4. Redeploy:
```bash
vercel --prod
```

## 🎯 All Features Working in Production

### ✅ Live Data Features
- **Real-time stock quotes** from Finnhub API
- **Alpaca paper trading** integration  
- **Market ticker** with live prices
- **Auto-refreshing** portfolio data
- **Live P&L calculations**

### ✅ Trading Operations
- Buy/Sell stocks (US & India markets)
- Short selling with margin
- Cover short positions
- Alpaca paper trades
- Transaction history

### ✅ Analytics & Risk
- Performance metrics (win rate, P&L)
- Risk management (exposure, diversification)
- Position analysis
- Margin tracking
- Real-time equity calculations

## 🔧 Troubleshooting

### "Not Found" Error on Dashboard
**Problem**: Portfolio endpoint returning 404

**Solution**:
1. Check backend is deployed and running
2. Verify `NEXT_PUBLIC_API_BASE_URL` in Vercel
3. Test backend health: `curl https://your-backend.railway.app/health`
4. Check CORS includes your Vercel URL

### No Live Data Showing
**Problem**: Market data not updating

**Solution**:
1. Verify API keys are set in Railway:
   - `FINNHUB_API_KEY` 
   - `ALPACA_API_KEY`
   - `ALPACA_API_SECRET`
2. Check API key limits/quotas
3. View Railway logs for errors

### Alpaca Positions Not Showing
**Problem**: Paper trading positions missing

**Solution**:
1. Verify Alpaca credentials in Railway
2. Ensure keys are for **paper trading** account
3. Check backend logs: `Failed to fetch Alpaca positions`
4. Test directly: `curl https://your-backend.railway.app/trade/alpaca/portfolio`

### Frontend Port 3001 Instead of 3000
**Problem**: Local dev using wrong port

**Solution**:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Restart frontend
cd Frontend/material-kit-react-main
npm run dev
```

## 📊 Verify Deployment

### Test Backend Endpoints
```bash
# Health check
curl https://your-backend.railway.app/health

# Portfolio with Alpaca data
curl https://your-backend.railway.app/portfolio

# Live market quote
curl "https://your-backend.railway.app/market/quote/AAPL?market=US"

# Market ticker
curl https://your-backend.railway.app/market/ticker

# Analytics
curl https://your-backend.railway.app/analytics/performance

# Alpaca portfolio
curl https://your-backend.railway.app/trade/alpaca/portfolio
```

### Test Frontend
1. Visit: `https://your-app.vercel.app/dashboard/usa`
2. Check browser console for errors
3. Verify portfolio loads
4. Test placing a trade
5. Check Alpaca positions appear

## 🚀 Quick Deploy Commands

### Deploy Frontend
```bash
cd Frontend/material-kit-react-main
vercel --prod
```

### Redeploy Backend (Railway)
```bash
# Push to GitHub, Railway auto-deploys
git push origin main
```

### Update Environment Variable
```bash
# Vercel
vercel env add NEXT_PUBLIC_API_BASE_URL production

# Railway  
# Use Railway dashboard → Variables tab
```

## 🔒 Security Checklist

- [ ] All API keys set as environment variables
- [ ] `.env` files in `.gitignore`
- [ ] `SECRET_KEY` is random and secure
- [ ] CORS limited to your domains only
- [ ] HTTPS enabled (automatic on Vercel/Railway)
- [ ] No hardcoded credentials in code

## 📈 Production URLs

After deployment, you'll have:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.railway.app
- **Dashboard**: https://your-app.vercel.app/dashboard/usa
- **API Docs**: https://your-backend.railway.app/docs

## 🎉 Success!

Your TradeSphere application is now live with:
- ✅ Real-time market data from Finnhub
- ✅ Alpaca paper trading integration
- ✅ Live portfolio updates
- ✅ Risk analytics
- ✅ Trading operations
- ✅ Auto-refreshing prices
- ✅ No authentication (demo mode)

## 📝 Post-Deployment Tasks

1. **Test all features**:
   - Place a paper trade via Alpaca
   - Check live quotes updating
   - Verify portfolio calculations
   - Test risk analytics

2. **Monitor API usage**:
   - Finnhub: 60 calls/minute free tier
   - Alpaca: Unlimited paper trading

3. **Set up monitoring**:
   - Railway: View logs and metrics
   - Vercel: Analytics dashboard

## 🌟 Next Steps

1. **Custom domain** (optional):
   - Add in Vercel → Settings → Domains
   - Update CORS_ORIGINS in Railway

2. **Upgrade plans** if needed:
   - Vercel Pro: $20/month (more bandwidth)
   - Railway: $5-20/month (more resources)

3. **Add features**:
   - WebSocket for real-time streaming
   - Push notifications
   - Advanced charting
   - Social trading

Your app is production-ready! 🚀

