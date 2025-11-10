# Deploy FastAPI + Next.js Together on Vercel

## ✅ What I Just Set Up

Your FastAPI backend can now deploy on Vercel as serverless functions, alongside your Next.js frontend!

### Files Created/Updated:
- ✅ `api/index.py` - Vercel serverless handler for FastAPI
- ✅ `api/requirements.txt` - Python dependencies for Vercel
- ✅ `vercel.json` - Routes API calls to Python serverless functions
- ✅ `.env.local` - Updated with deployment instructions

---

## ⚠️ IMPORTANT LIMITATIONS

### What Won't Work on Vercel:
❌ **WebSockets** - No real-time ticker, live quotes, order book streaming
❌ **Long-running processes** - 10 second timeout per request
❌ **Background tasks** - Serverless functions shut down after response

### What WILL Work:
✅ REST API endpoints (portfolio, trades, market data snapshots)
✅ Alpaca integration (place orders, get positions)
✅ Database queries (with timeouts)
✅ Analytics endpoints

---

## 🚀 Deployment Steps

### Step 1: Add Environment Variables to Vercel

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add these:

```
ALPACA_API_KEY = PKTENSECGJWP2KMDXBYKEPCJNO
ALPACA_API_SECRET = DW7K5pHW7jKGWXnLnq6xDjg3aPa2ZMkqwhCxoTQky8Ms
ALPACA_BASE_URL = https://paper-api.alpaca.markets
FINNHUB_API_KEY = dummy
STOCKGRO_API_KEY = your_key_here
NEXT_PUBLIC_API_BASE_URL = /api
```

**Note**: `NEXT_PUBLIC_API_BASE_URL=/api` tells frontend to use same domain for API calls.

### Step 2: Push to GitHub

```bash
cd /Users/sakshammishra/OperationFInance
git add .
git commit -m "Add FastAPI serverless deployment for Vercel"
git push origin main
```

### Step 3: Deploy on Vercel

Vercel will automatically:
1. Build your Next.js frontend
2. Deploy FastAPI as Python serverless functions at `/api/*`
3. Route everything together

### Step 4: Test

```bash
# Test your API (replace with your Vercel URL)
curl https://your-app.vercel.app/api/health
curl https://your-app.vercel.app/api/market/ticker
```

---

## 🔄 For Real-Time Features

If you need WebSocket support (ticker tape, live quotes), you have 2 options:

### Option A: Hybrid Deployment (Recommended)
- **Frontend**: Vercel (Next.js)
- **REST APIs**: Vercel Serverless (`/api/*`)
- **WebSockets**: Render/Railway separate backend

Set `NEXT_PUBLIC_API_BASE_URL` to your Render URL for WebSocket features.

### Option B: Full Backend on Render
- Deploy entire backend to Render (as we set up earlier)
- Use `NEXT_PUBLIC_API_BASE_URL=https://your-backend.onrender.com`
- Frontend stays on Vercel

---

## 📊 Comparison

| Feature | Vercel Serverless | Render Backend |
|---------|-------------------|----------------|
| REST APIs | ✅ Yes | ✅ Yes |
| WebSockets | ❌ No | ✅ Yes |
| Timeout | 10 seconds | 30+ minutes |
| Cold Starts | Yes (~1-2s) | Yes (free tier) |
| Cost | Free | Free ($0) or $7/month |
| Setup | Easiest | Easy |

---

## 🎯 My Recommendation

**For your Bloomberg-style terminal with real-time features:**

Use **Render for backend** (as we set up earlier) because:
- ✅ WebSocket support for real-time ticker/quotes
- ✅ No timeout limitations
- ✅ Better for long-running operations
- ✅ Still free tier available

**Keep Vercel for frontend only** - it's perfect for Next.js!

---

## 🔧 If You Still Want Vercel Serverless

It will work for basic features! Just remember:
1. No real-time streaming
2. Ticker tape will use polling instead
3. Some features may be slower

To activate Vercel serverless backend:
1. Follow Step 1 above (add environment variables)
2. Push code (Step 2)
3. Vercel deploys automatically!

---

## Which Do You Prefer?

1. **Render Backend** (full features, WebSockets) ← I recommend this
2. **Vercel Serverless** (easier deployment, limited features)
3. **Hybrid** (both - use Vercel for REST, Render for WebSockets)

Let me know and I'll help you finish the setup!
