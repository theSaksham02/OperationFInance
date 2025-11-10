# Deploy Backend to Railway

## Quick Setup (5 minutes)

### 1. Sign Up for Railway
- Go to https://railway.app/
- Sign up with GitHub (free $5 credit per month)

### 2. Create Railway Project

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Navigate to backend
cd /Users/sakshammishra/OperationFInance/backend

# Initialize Railway project
railway init

# Link to new project
railway link
```

### 3. Add Environment Variables in Railway Dashboard

Go to your Railway project → Variables → Add these:

```
DATABASE_URL=postgresql://... (Railway will provide this)
ALPACA_API_KEY=PKTENSECGJWP2KMDXBYKEPCJNO
ALPACA_API_SECRET=DW7K5pHW7jKGWXnLnq6xDjg3aPa2ZMkqwhCxoTQky8Ms
ALPACA_BASE_URL=https://paper-api.alpaca.markets
FINNHUB_API_KEY=your_real_key_here
STOCKGRO_API_KEY=your_key_here
```

### 4. Deploy Backend

```bash
# Deploy from backend directory
railway up
```

### 5. Get Your Backend URL

Railway will give you a URL like: `https://your-app.railway.app`

### 6. Update Frontend Environment Variable

On Vercel:
1. Go to your project → Settings → Environment Variables
2. Add: `NEXT_PUBLIC_API_BASE_URL` = `https://your-app.railway.app`
3. Redeploy frontend

## Alternative: One-Click Deploy to Railway

Click this button:
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template)

Then configure the environment variables in Railway dashboard.

## Verify Deployment

Once deployed, test your backend:
```bash
curl https://your-app.railway.app/health
curl https://your-app.railway.app/market/ticker
```

## Cost
- Free tier: $5 credit/month (usually enough for development)
- Includes PostgreSQL database
- Auto-scaling
