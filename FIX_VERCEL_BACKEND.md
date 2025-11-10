# Fix Vercel Backend Connection Issue

## The Problem

Your Vercel frontend is trying to connect to `http://localhost:8000`, which **doesn't exist on Vercel servers**.

❌ **What's happening:**
- Locally: Frontend → `http://localhost:8000` → Your local backend ✅ Works
- On Vercel: Frontend → `http://localhost:8000` → Nothing ❌ Fails

## The Solution

Deploy your FastAPI backend separately and point Vercel to it.

---

## 🚀 Recommended: Railway (Fastest & Easiest)

### Step 1: Deploy Backend to Railway (5 mins)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Go to your project root
cd /Users/sakshammishra/OperationFInance

# Initialize and deploy
railway init
railway up
```

### Step 2: Add Environment Variables in Railway

Go to Railway Dashboard → Your Project → Variables:

```
ALPACA_API_KEY=PKTENSECGJWP2KMDXBYKEPCJNO
ALPACA_API_SECRET=DW7K5pHW7jKGWXnLnq6xDjg3aPa2ZMkqwhCxoTQky8Ms
ALPACA_BASE_URL=https://paper-api.alpaca.markets
FINNHUB_API_KEY=your_real_key_here
STOCKGRO_API_KEY=your_key_here
```

### Step 3: Get Your Backend URL

Railway will give you a URL like:
```
https://operationfinance-production.up.railway.app
```

### Step 4: Update Vercel Environment Variable

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Edit or Add:
   ```
   NEXT_PUBLIC_API_BASE_URL = https://operationfinance-production.up.railway.app
   ```
3. **Redeploy** your frontend (Vercel → Deployments → Redeploy)

### Step 5: Test

Visit your Vercel site - it should now connect to Railway backend!

---

## 📊 Comparison of Backend Hosting Options

| Platform | Free Tier | Spin Down | Setup Time | Cost |
|----------|-----------|-----------|------------|------|
| **Railway** | $5/month credit | No | 5 mins | $0-5/month |
| **Render** | Yes | After 15 mins | 10 mins | Free or $7/month |
| **Heroku** | No free tier | N/A | 10 mins | $5/month minimum |
| **AWS/GCP** | Complex | No | 30+ mins | Variable |

**Winner for you: Railway** 🏆

---

## ✅ Current Setup Files Created

I've added these files to make deployment easy:

- ✅ `Procfile` - Tells Railway/Heroku how to start your backend
- ✅ `railway.json` - Railway-specific configuration
- ✅ `backend/requirements.txt` - Already exists with all dependencies

---

## 🔧 Alternative: Quick Test Without Deployment

If you want to test quickly without deploying, you can:

1. Use ngrok to tunnel your local backend:
```bash
# Install ngrok: https://ngrok.com/download
ngrok http 8000
```

2. Update Vercel environment variable with ngrok URL:
```
NEXT_PUBLIC_API_BASE_URL=https://abc123.ngrok.io
```

⚠️ **Note**: ngrok URLs change every time you restart, so this is only for testing!

---

## 📝 Summary

**The issue:** Vercel frontend can't reach `localhost:8000` because it's not on your local machine.

**The fix:** 
1. Deploy backend to Railway/Render
2. Update `NEXT_PUBLIC_API_BASE_URL` on Vercel
3. Redeploy frontend

**Time needed:** 10 minutes total

**Cost:** Free (Railway gives $5/month credit)

---

## Need Help?

Run these commands to deploy to Railway right now:

```bash
cd /Users/sakshammishra/OperationFInance
npm install -g @railway/cli
railway login
railway init
railway up
```

Then copy the Railway URL and add it to Vercel's environment variables!
