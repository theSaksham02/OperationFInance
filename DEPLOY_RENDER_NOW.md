# Deploy Backend to Render (Easiest Option)

## 🚀 Quick Deploy (3 Steps - 5 Minutes)

### Step 1: Push Your Code to GitHub (if not already)

```bash
cd /Users/sakshammishra/OperationFInance
git add .
git commit -m "Add Render deployment config"
git push origin main
```

### Step 2: Deploy on Render

#### Option A: One-Click Deploy (Recommended)

1. Go to https://render.com/
2. Sign up/Login with GitHub
3. Click **"New +"** → **"Blueprint"**
4. Connect your GitHub repo: `theSaksham02/OperationFInance`
5. Render will auto-detect `render.yaml` and deploy!

#### Option B: Manual Setup

1. Go to https://render.com/
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repo
4. Configure:
   - **Name**: `operationfinance-backend`
   - **Region**: Oregon (US West)
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Runtime**: Python 3
   - **Build Command**: `cd backend && pip install -r requirements.txt`
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free

5. Add Environment Variables:
   ```
   ALPACA_API_KEY = PKTENSECGJWP2KMDXBYKEPCJNO
   ALPACA_API_SECRET = DW7K5pHW7jKGWXnLnq6xDjg3aPa2ZMkqwhCxoTQky8Ms
   ALPACA_BASE_URL = https://paper-api.alpaca.markets
   FINNHUB_API_KEY = dummy
   STOCKGRO_API_KEY = your_key_here
   ```

6. Click **"Create Web Service"**

### Step 3: Update Vercel Environment Variable

Once deployed, Render will give you a URL like:
```
https://operationfinance-backend.onrender.com
```

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Edit/Add:
   ```
   NEXT_PUBLIC_API_BASE_URL = https://operationfinance-backend.onrender.com
   ```
3. Go to **Deployments** → Click **"..."** → **"Redeploy"**

---

## ✅ That's It!

Your app should now work on Vercel!

Test it:
```bash
# Test backend
curl https://operationfinance-backend.onrender.com/health

# Test your Vercel site
open https://your-app.vercel.app
```

---

## ⚠️ Important: Free Tier Limitation

**Render's free tier spins down after 15 minutes of inactivity.**

- First request after sleep: 30-60 seconds delay
- Subsequent requests: Fast
- **Solution**: Upgrade to $7/month for always-on

OR use a keep-alive service like:
- https://uptimerobot.com/ (free)
- https://cron-job.org/ (free)

Set them to ping your backend every 10 minutes:
```
https://operationfinance-backend.onrender.com/health
```

---

## 🔍 Troubleshooting

**Build fails?**
- Check logs in Render dashboard
- Make sure `backend/requirements.txt` has all dependencies

**Backend not responding?**
- Check Environment Variables are set correctly
- Look at Runtime logs in Render dashboard

**Vercel still showing errors?**
- Make sure you redeployed after updating environment variable
- Clear browser cache

---

## 💰 Cost Comparison

| Plan | Cost | Spin Down | Best For |
|------|------|-----------|----------|
| Free | $0 | After 15 mins | Testing |
| Starter | $7/month | Never | Production |

---

## Need Help?

I've created:
- ✅ `render.yaml` - Auto-deployment config
- ✅ All environment variables pre-configured

Just follow Step 1 & 2 above!
