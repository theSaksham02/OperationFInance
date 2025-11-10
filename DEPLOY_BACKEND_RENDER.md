# Deploy Backend to Render

## Quick Setup (5 minutes)

### 1. Sign Up for Render
- Go to https://render.com/
- Sign up with GitHub (free tier available)

### 2. Create Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `operationfinance-backend`
   - **Root Directory**: `backend`
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### 3. Add Environment Variables

In Render dashboard → Environment:

```
ALPACA_API_KEY=PKTENSECGJWP2KMDXBYKEPCJNO
ALPACA_API_SECRET=DW7K5pHW7jKGWXnLnq6xDjg3aPa2ZMkqwhCxoTQky8Ms
ALPACA_BASE_URL=https://paper-api.alpaca.markets
FINNHUB_API_KEY=your_real_key_here
STOCKGRO_API_KEY=your_key_here
```

### 4. Deploy

Click "Create Web Service" - Render will automatically deploy.

### 5. Get Your Backend URL

Render will give you: `https://operationfinance-backend.onrender.com`

### 6. Update Vercel Environment Variable

On Vercel:
1. Settings → Environment Variables
2. Add: `NEXT_PUBLIC_API_BASE_URL` = `https://operationfinance-backend.onrender.com`
3. Redeploy

## Important: Free Tier Limitations

⚠️ **Free tier spins down after 15 minutes of inactivity**
- First request after sleep takes 30-60 seconds
- Upgrade to paid tier ($7/month) for always-on

## Verify

```bash
curl https://operationfinance-backend.onrender.com/health
```
