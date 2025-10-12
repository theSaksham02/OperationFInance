# Backend Deployment Guide (Railway)

Deploy your FastAPI backend to Railway for production use.

## Why Railway?

- ✅ Free tier available ($5 credit/month)
- ✅ Easy PostgreSQL database included
- ✅ Automatic deployments from GitHub
- ✅ Built-in environment variables
- ✅ Great for Python/FastAPI apps
- ✅ Automatic HTTPS

## Prerequisites

1. GitHub account (your code is at: `theSaksham02/OperationFInance`)
2. Railway account (sign up at https://railway.app)

## Step 1: Sign Up for Railway

1. Go to https://railway.app
2. Click "Login" → "Login with GitHub"
3. Authorize Railway to access your repositories
4. Verify your email (if required)

## Step 2: Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `theSaksham02/OperationFInance`
4. Click "Deploy Now"

## Step 3: Configure Backend Service

Railway will detect your app. Now configure it:

1. **Service Settings**
   - Click on the deployed service
   - Go to "Settings" tab

2. **Set Root Directory**
   - Find "Root Directory" setting
   - Set to: `backend`
   - This tells Railway where your FastAPI code is

3. **Set Start Command**
   - Find "Start Command" setting
   - Set to: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Or use Gunicorn: `gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`

## Step 4: Add PostgreSQL Database

1. **In your Railway project**:
   - Click "+ New"
   - Select "Database"
   - Choose "PostgreSQL"
   - Railway provisions a database automatically

2. **Connect Database to Backend**:
   - Railway automatically creates a `DATABASE_URL` variable
   - Update it to use asyncpg:
   - Go to backend service → "Variables" tab
   - Find `DATABASE_URL`
   - Copy the value
   - Create new variable: `DATABASE_URL`
   - Replace `postgresql://` with `postgresql+asyncpg://`
   - Example: `postgresql+asyncpg://user:pass@host:5432/db`

## Step 5: Set Environment Variables

Go to your backend service → "Variables" tab → Add these:

```bash
# Database (automatically created, just verify format)
DATABASE_URL=postgresql+asyncpg://postgres:...@...railway.app:5432/railway

# Security
SECRET_KEY=your_super_secret_key_change_this_in_production_make_it_long_and_random
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS - Add your Vercel frontend URL
CORS_ORIGINS=https://your-project.vercel.app,http://localhost:3000

# API Keys
FINNHUB_API_KEY=your_finnhub_api_key_get_free_at_finnhub.io
STOCKGRO_CLIENT_ID=w1LpHq8Jt9Vn5Xk3Ys0Dr2Mc4Fa
STOCKGRO_CLIENT_SECRET=b5HkQp2Vt9Ln4Wj8Xr0Ys1Dm7Za
STOCKGRO_TENANT_ID=your_tenant_id_here

# App Settings
SHORTABLE_MIN_RATE=0.02
SHORTABLE_MAX_RATE=0.18
SHORTABLE_SELECTION_COUNT=100
QUOTE_CACHE_TTL_SECONDS=10
ALLOW_TIER_UPGRADE=true
```

**How to add variables**:
1. Click "New Variable"
2. Enter "Variable Name"
3. Enter "Variable Value"
4. Click "Add"
5. Repeat for all variables

## Step 6: Create `requirements.txt` (if not exists)

Railway needs this file to install dependencies. Make sure `/backend/requirements.txt` exists:

```txt
fastapi==0.115.6
uvicorn[standard]==0.34.0
sqlalchemy==2.0.36
alembic==1.14.0
asyncpg==0.30.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.20
httpx==0.28.1
python-dotenv==1.0.1
pydantic-settings==2.7.0
gunicorn==23.0.0
```

Commit and push if you added it:
```bash
git add backend/requirements.txt
git commit -m "Add requirements.txt for Railway"
git push origin main
```

## Step 7: Create `Procfile` (Optional but Recommended)

Create `/backend/Procfile`:

```
web: gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT
```

Or simpler:
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

## Step 8: Deploy and Run Migrations

1. **Wait for deployment** to complete (check Deployment logs)
2. **Run database migrations**:
   - Click on your service
   - Go to "Settings" → Click "..." → "Run Command"
   - Enter: `alembic upgrade head`
   - Click "Run"

Or use Railway CLI:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migrations
railway run alembic upgrade head
```

## Step 9: Get Your Backend URL

1. Go to your backend service
2. Click "Settings" tab
3. Find "Domains" section
4. Copy the Railway-generated URL: `https://your-app.railway.app`
5. Or add a custom domain

## Step 10: Update Frontend

Update your Vercel frontend with the backend URL:

1. Go to Vercel Dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Find `NEXT_PUBLIC_API_BASE_URL`
5. Update value to: `https://your-app.railway.app`
6. Go to "Deployments" tab
7. Click "..." on latest deployment → "Redeploy"

## Step 11: Test Your Backend

Test endpoints:

```bash
# Health check
curl https://your-app.railway.app/health

# Portfolio (should return mock data)
curl https://your-app.railway.app/portfolio

# Positions
curl https://your-app.railway.app/portfolio/positions
```

## Automatic Deployments

Railway automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update backend"
git push origin main

# Railway automatically builds and deploys!
```

## Monitoring and Logs

**View Logs**:
1. Go to Railway Dashboard
2. Click on your backend service
3. Click "Deployments" tab
4. Click on latest deployment
5. View real-time logs

**Metrics**:
- CPU usage
- Memory usage
- Network traffic
- Build times

## Troubleshooting

### Build Fails

**Check logs**:
- Go to Deployments → Click failed deployment
- Read build logs for errors

**Common issues**:
```bash
# Missing dependencies
# → Add to requirements.txt

# Wrong Python version
# → Add runtime.txt with: python-3.9.6

# Wrong start command
# → Check "Start Command" in settings
```

### Database Connection Errors

```bash
# Verify DATABASE_URL format
postgresql+asyncpg://user:pass@host:5432/db

# Run migrations
railway run alembic upgrade head

# Check database is running
# → Go to Database service, verify it's active
```

### CORS Errors

Update `CORS_ORIGINS` in environment variables:
```bash
CORS_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000
```

Then redeploy.

### Application Crashes

Check logs for errors:
```bash
# Via Railway Dashboard
Deployments → View Logs

# Via CLI
railway logs
```

## Cost Management

**Railway Free Tier**:
- $5 in credits per month
- Unused credits don't roll over
- Typically enough for:
  - 1 backend service
  - 1 PostgreSQL database
  - Low to moderate traffic

**Monitor usage**:
- Dashboard → Usage tab
- Set up alerts for credit limits

**Optimize costs**:
- Use single worker for low traffic
- Implement database connection pooling
- Add caching for API responses

## Production Checklist

- [ ] Backend deployed on Railway
- [ ] PostgreSQL database created
- [ ] Environment variables configured
- [ ] `DATABASE_URL` uses `asyncpg`
- [ ] Database migrations run successfully
- [ ] Health endpoint returns `{"status":"ok"}`
- [ ] CORS configured with frontend URL
- [ ] Frontend updated with backend URL
- [ ] All endpoints tested and working
- [ ] Logs show no critical errors
- [ ] Custom domain configured (optional)

## Alternative: Deploy Backend to Render

If Railway doesn't work, try Render.com:

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect repository
5. Configure:
   - Name: `uptrade-backend`
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables
7. Create PostgreSQL database
8. Deploy!

## Support

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **FastAPI Docs**: https://fastapi.tiangolo.com

## Summary

✅ Backend deployed to Railway
✅ PostgreSQL database provisioned
✅ Environment variables configured
✅ Automatic deployments enabled
✅ HTTPS automatically handled
✅ Ready for production traffic

**Your backend URL**: `https://your-app.railway.app`

Next: Update frontend environment variables and redeploy!
