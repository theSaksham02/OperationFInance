# 🚀 PRODUCTION DEPLOYMENT GUIDE
## OperationFinance - Step-by-Step Production Setup

**Status:** ✅ Code pushed to GitHub - Ready for deployment!  
**Last Push:** Just now to `main` branch

---

## 📦 What Was Just Deployed

### ✅ Changes Pushed to GitHub:
1. **Fixed Database Schema** - Alembic migrations now use Integer IDs
2. **Fixed Async Migrations** - Alembic env.py corrected
3. **Added Vercel Speed Insights** - Performance monitoring
4. **Complete Documentation** - Audit reports and deployment guides
5. **Frontend Configuration** - vercel.json for proper deployment

---

## 🎯 STEP 1: Deploy Frontend to Vercel

### Option A: Automatic Deployment (If Already Connected)

If you've already connected your GitHub repo to Vercel:
- ✅ Vercel is **automatically deploying** your changes right now!
- Check: https://vercel.com/dashboard
- Look for a deployment in progress for `OperationFInance`

### Option B: First-Time Setup

If this is your first deployment:

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Sign in with GitHub

2. **Import Project**
   ```
   Click "Add New..." → "Project"
   Select "Import Git Repository"
   Find: manognyakumar/OperationFInance (or theSaksham02/OperationFInance)
   Click "Import"
   ```

3. **Configure Build Settings**
   ```
   Framework Preset: Next.js (auto-detected)
   Root Directory: Frontend/material-kit-react-main
   Build Command: npm run build (auto-filled)
   Output Directory: .next (auto-filled)
   Install Command: npm install (auto-filled)
   ```

4. **⚠️ IMPORTANT: Set Root Directory**
   - Click "Edit" next to "Root Directory"
   - Enter: `Frontend/material-kit-react-main`
   - This is CRITICAL - your Next.js app is in a subdirectory

5. **Environment Variables (Set Later)**
   - Skip for now, we'll add after backend deployment
   - Or add placeholder: `NEXT_PUBLIC_API_BASE_URL=https://placeholder.com`

6. **Deploy!**
   - Click "Deploy"
   - Wait 1-3 minutes
   - Your frontend will be live! 🎉

### Option C: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login
vercel login

# Navigate to frontend directory
cd /Users/sakshammishra/OperationFInance/Frontend/material-kit-react-main

# Deploy to production
vercel --prod

# Answer prompts:
# - Set up and deploy? Y
# - Which scope? [Your account]
# - Link to existing project? N (first time) or Y
# - Project name? operation-finance
# - Directory? ./
```

---

## 🎯 STEP 2: Deploy Backend (Recommended: Railway)

### Why Railway?
- ✅ Free tier with PostgreSQL included
- ✅ Easy Python/FastAPI deployment
- ✅ Automatic HTTPS
- ✅ Environment variable management
- ✅ Auto-deploy from GitHub

### Railway Deployment Steps:

1. **Sign Up / Login**
   - Go to https://railway.app
   - Click "Login with GitHub"
   - Authorize Railway

2. **Create New Project**
   ```
   Dashboard → "New Project"
   Select "Deploy from GitHub repo"
   Choose: manognyakumar/OperationFInance (or theSaksham02/OperationFInance)
   ```

3. **Configure Service**
   ```
   Root Directory: backend
   Build Command: (leave empty - Railway auto-detects)
   Start Command: uvicorn backend.main:app --host 0.0.0.0 --port $PORT
   ```

4. **Add PostgreSQL Database**
   ```
   Click "New" → "Database" → "Add PostgreSQL"
   Railway will automatically create and link the database
   ```

5. **Set Environment Variables**
   Click "Variables" tab and add:
   ```bash
   # Database (Railway auto-provides DATABASE_URL for PostgreSQL)
   # Just verify it's there - usually auto-populated
   
   # Security
   SECRET_KEY=[Generate strong random key - see below]
   
   # External APIs
   FINNHUB_API_KEY=[Your Finnhub API key]
   STOCKGRO_CLIENT_ID=[Your StockGro client ID]
   STOCKGRO_CLIENT_SECRET=[Your StockGro secret]
   STOCKGRO_TENANT_ID=[Your StockGro tenant ID if needed]
   
   # CORS - Allow your Vercel domain
   CORS_ORIGINS=https://your-app.vercel.app,https://operation-finance.vercel.app
   
   # Other settings
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   ALLOW_TIER_UPGRADE=false
   ```

6. **Generate SECRET_KEY**
   ```bash
   # Run this locally to generate a secure key:
   python3 -c "import secrets; print(secrets.token_urlsafe(32))"
   
   # Copy the output and use as SECRET_KEY
   ```

7. **Deploy**
   - Railway will automatically deploy
   - Wait for build to complete
   - Copy your Railway URL (something like: `https://your-app.railway.app`)

8. **Run Database Migrations**
   ```
   In Railway dashboard:
   Click your service → "Settings" → "Deploy"
   Or use Railway CLI:
   
   railway login
   railway link
   railway run alembic upgrade head
   ```

---

## 🎯 STEP 3: Connect Frontend to Backend

### Update Vercel Environment Variables

1. **Go to Vercel Project Settings**
   ```
   Vercel Dashboard → Your Project → Settings → Environment Variables
   ```

2. **Add Production Variable**
   ```
   Name: NEXT_PUBLIC_API_BASE_URL
   Value: https://your-backend.railway.app
   Environment: Production, Preview, Development (all)
   ```

3. **Redeploy Frontend**
   ```
   Go to "Deployments" tab
   Click "..." on latest deployment
   Select "Redeploy"
   
   OR push a new commit to trigger auto-deployment
   ```

---

## 🎯 ALTERNATIVE: Backend on Render

If you prefer Render over Railway:

1. **Sign Up**: https://render.com
2. **New Web Service**
   - Connect GitHub repo
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`

3. **Add PostgreSQL**
   - Dashboard → "New +" → "PostgreSQL"
   - Copy the "Internal Database URL"

4. **Environment Variables** (same as Railway above)
   - Use the PostgreSQL URL from Render as `DATABASE_URL`

5. **Deploy** and copy the service URL

---

## 🎯 STEP 4: Update Backend CORS

After deploying both frontend and backend:

1. **Update CORS_ORIGINS in Backend**
   ```bash
   # In Railway or Render environment variables:
   CORS_ORIGINS=https://your-app.vercel.app,https://your-app-git-main.vercel.app
   ```

2. **Include All Vercel Preview URLs**
   ```bash
   # For comprehensive coverage:
   CORS_ORIGINS=https://your-app.vercel.app,https://your-app-*.vercel.app
   ```

---

## ✅ POST-DEPLOYMENT CHECKLIST

### Frontend (Vercel)
- [ ] Deployment successful
- [ ] Site is accessible
- [ ] No build errors
- [ ] Environment variable `NEXT_PUBLIC_API_BASE_URL` set
- [ ] Speed Insights working

### Backend (Railway/Render)
- [ ] Deployment successful
- [ ] Health endpoint working: `curl https://your-backend.railway.app/health`
- [ ] Database connected
- [ ] Migrations run successfully
- [ ] Environment variables all set
- [ ] CORS configured for Vercel domain

### Integration
- [ ] Frontend can reach backend
- [ ] User registration works
- [ ] Login works
- [ ] API calls successful
- [ ] No CORS errors in browser console

---

## 🧪 TESTING YOUR PRODUCTION DEPLOYMENT

### Test Backend Health
```bash
curl https://your-backend.railway.app/health
# Expected: {"status":"ok"}
```

### Test User Registration
```bash
curl -X POST https://your-backend.railway.app/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"prodtest","email":"prod@test.com","password":"test123"}'
```

### Test Frontend
1. Visit your Vercel URL
2. Try to sign up
3. Try to log in
4. Check browser console for errors
5. Test buying/selling stocks

---

## 🔧 TROUBLESHOOTING

### Build Fails on Vercel
- **Check Root Directory**: Must be `Frontend/material-kit-react-main`
- **Check Build Logs**: Look for npm errors
- **Node Version**: Vercel should auto-detect from package.json

### Backend Deployment Fails
- **Check requirements.txt**: All dependencies listed?
- **Check Start Command**: Should use `$PORT` variable
- **Database URL**: Is PostgreSQL URL correct?

### CORS Errors
- **Update CORS_ORIGINS**: Include exact Vercel domain
- **Include ALL domains**: Production and preview URLs
- **Redeploy backend**: After changing CORS settings

### Database Migrations
- **Run migrations**: Use Railway CLI or Render Shell
- **Check DATABASE_URL**: Must be PostgreSQL (not SQLite)
- **Create tables**: Run `alembic upgrade head`

### API Connection Fails
- **Check Environment Variable**: Is `NEXT_PUBLIC_API_BASE_URL` correct?
- **HTTPS Required**: Vercel uses HTTPS, backend must too
- **Test Backend Directly**: curl the health endpoint

---

## 📊 MONITORING & MAINTENANCE

### Vercel
- **Analytics**: Enable in Project Settings
- **Speed Insights**: Already added via `@vercel/speed-insights`
- **Error Tracking**: Consider adding Sentry

### Backend
- **Railway Metrics**: Built-in CPU, memory, network graphs
- **Logs**: View in Railway/Render dashboard
- **Uptime Monitoring**: Consider UptimeRobot or similar

### Database
- **Backups**: Railway/Render auto-backup
- **Monitoring**: Check query performance
- **Scaling**: Upgrade database plan as needed

---

## 💡 QUICK REFERENCE

### Your URLs (Update After Deployment)
```
Frontend: https://operation-finance.vercel.app
Backend: https://your-backend.railway.app
API Docs: https://your-backend.railway.app/docs
```

### Important Commands
```bash
# Redeploy frontend
cd Frontend/material-kit-react-main
vercel --prod

# Check backend logs (Railway)
railway logs

# Run migrations (Railway)
railway run alembic upgrade head

# Generate new SECRET_KEY
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Environment Variables Summary

**Frontend (Vercel):**
```bash
NEXT_PUBLIC_API_BASE_URL=https://your-backend.railway.app
```

**Backend (Railway/Render):**
```bash
DATABASE_URL=[Auto-provided by Railway/Render]
SECRET_KEY=[Generated secure key]
FINNHUB_API_KEY=[Your API key]
STOCKGRO_CLIENT_ID=[Your client ID]
STOCKGRO_CLIENT_SECRET=[Your secret]
CORS_ORIGINS=https://your-app.vercel.app
```

---

## 🎉 SUCCESS CHECKLIST

Once everything is deployed:

- [ ] ✅ Code pushed to GitHub
- [ ] ✅ Vercel connected to GitHub repo
- [ ] ✅ Frontend deployed to Vercel
- [ ] ✅ Backend deployed to Railway/Render
- [ ] ✅ PostgreSQL database created
- [ ] ✅ Database migrations run
- [ ] ✅ Environment variables configured (both services)
- [ ] ✅ CORS configured correctly
- [ ] ✅ Frontend connected to backend
- [ ] ✅ Tested user registration
- [ ] ✅ Tested trading functionality
- [ ] ✅ No errors in production

---

## 📞 NEXT STEPS

1. **Deploy Now**:
   - Start with Vercel (easiest)
   - Then deploy backend to Railway
   - Connect them via environment variables

2. **Get Production API Keys**:
   - Finnhub: https://finnhub.io
   - StockGro: Contact StockGro for credentials

3. **Custom Domain** (Optional):
   - Buy domain (Namecheap, Google Domains, etc.)
   - Add to Vercel: Project Settings → Domains
   - Update DNS records as instructed

4. **Monitor & Iterate**:
   - Watch for errors
   - Monitor performance
   - Gather user feedback
   - Iterate and improve!

---

**Deployment Guide Created:** October 12, 2025  
**Status:** Ready for production deployment!  
**Your code is on GitHub:** ✅ Pushed to main branch

🚀 **Let's deploy your application to the world!** 🚀
