# Deploying OperationFinance to Vercel

This guide will help you deploy your Next.js frontend to Vercel.

## Prerequisites

1. A GitHub account (your code is already on GitHub: manognyakumar/OperationFInance)
2. A Vercel account (sign up at https://vercel.com)

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Sign up/Login to Vercel**
   - Go to https://vercel.com
   - Click "Sign Up" or "Login"
   - Choose "Continue with GitHub"

2. **Import Your Project**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Authorize Vercel to access your GitHub repositories
   - Find and select `manognyakumar/OperationFInance`

3. **Configure Your Project**
   ```
   Framework Preset: Next.js
   Root Directory: Frontend/material-kit-react-main
   Build Command: npm run build
   Output Directory: .next (default)
   Install Command: npm install
   ```

4. **Environment Variables** (if needed)
   Add any environment variables your frontend needs:
   - Click "Environment Variables"
   - Add variables like:
     - `NEXT_PUBLIC_API_URL` = your backend API URL
     - Any other required variables

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (usually 1-3 minutes)
   - Your app will be live at: `https://your-project-name.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Navigate to Frontend Directory**
   ```bash
   cd Frontend/material-kit-react-main
   ```

4. **Deploy**
   ```bash
   # For first deployment
   vercel
   
   # For production deployment
   vercel --prod
   ```

5. **Follow the prompts:**
   - Set up and deploy? `Y`
   - Which scope? Select your account
   - Link to existing project? `N` (first time) or `Y` (subsequent)
   - What's your project's name? `operation-finance` (or your preferred name)
   - In which directory is your code located? `./`

### Option 3: Deploy via Git Integration (Automatic)

Once connected, every push to your main branch will automatically deploy:

1. **Connect Repository** (via Vercel Dashboard)
   - Import your GitHub repository as described in Option 1
   
2. **Automatic Deployments**
   - Push to `main` branch → Production deployment
   - Push to other branches → Preview deployment
   
3. **Deploy Command**
   ```bash
   git add .
   git commit -m "Deploy to Vercel"
   git push origin main
   ```

## Important Configuration

### Root Directory Setting
Since your Next.js app is in a subdirectory, make sure to set:
- **Root Directory**: `Frontend/material-kit-react-main`

### Environment Variables
Add these to your Vercel project settings:

```env
# Backend API URL (Required)
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com

# Logging level (Optional)
NEXT_PUBLIC_LOG_LEVEL=ALL
```

**Important**: The frontend expects `NEXT_PUBLIC_API_BASE_URL` (not `NEXT_PUBLIC_API_URL`).
This is configured in `src/lib/auth/client.ts` as the backend API endpoint.

### Build Settings
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

## Backend Deployment

**Note**: Vercel is primarily for frontend/serverless functions. For your FastAPI backend, consider:

1. **Vercel Serverless Functions** (for simple APIs)
2. **Railway** (https://railway.app) - Great for Python/FastAPI
3. **Render** (https://render.com) - Free tier available
4. **Fly.io** (https://fly.io) - Good for Docker deployments
5. **Heroku** (https://heroku.com) - Traditional platform
6. **AWS/GCP/Azure** - Full cloud platforms

### Recommended: Deploy Backend on Railway

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Set root directory to `backend`
6. Add environment variables (DATABASE_URL, SECRET_KEY, etc.)
7. Deploy!

## Authentication Setup (No-Auth Mode)

**Important**: This application has been configured to work **without authentication**!

- ✅ All users access the same demo account
- ✅ No login/signup required
- ✅ Landing page redirects to dashboard
- ✅ Mock portfolio data ($100k starting balance)

The frontend automatically provides a demo user context, so no authentication backend is needed.

## Post-Deployment

1. **Verify No-Auth Access**
   - Visit your Vercel URL: `https://your-project.vercel.app`
   - Landing page should load immediately
   - Click "Get Started" or "Dashboard" button
   - Dashboard should load without authentication
   - Portfolio should show $100,000 mock data

2. **Custom Domain** (Optional)
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

3. **Monitor Deployments**
   - View logs in Vercel Dashboard
   - Check deployment status
   - Review build logs for any errors

4. **Update Backend URL**
   - Once backend is deployed, update `NEXT_PUBLIC_API_BASE_URL` in Vercel
   - Go to Project Settings → Environment Variables
   - Update the value
   - Trigger a new deployment (Deployments → Click "..." → Redeploy)

## Troubleshooting

### Build Fails
- Check build logs in Vercel Dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Environment Variables Not Working
- Variables must be prefixed with `NEXT_PUBLIC_` to be accessible in browser
- Redeploy after adding new variables

### 404 Errors
- Check that root directory is set correctly
- Verify build output directory is `.next`

### CORS Errors
If you see CORS errors in the browser console:

1. **Update Backend CORS Settings**
   Edit `backend/.env`:
   ```bash
   CORS_ORIGINS=https://your-project.vercel.app,http://localhost:3000
   ```

2. **Or Allow All Origins** (for testing):
   ```bash
   CORS_ORIGINS=*
   ```

3. **Redeploy your backend** after updating CORS settings

### Portfolio Shows "Unable to load portfolio data"
This means the frontend can't connect to the backend:

1. **Check `NEXT_PUBLIC_API_BASE_URL`** is set correctly in Vercel
2. **Verify backend is running** - visit `https://your-backend-url/health`
3. **Check CORS configuration** on backend
4. **Check browser console** for specific error messages

## Useful Commands

```bash
# View deployment logs
vercel logs

# List all deployments
vercel ls

# Remove a deployment
vercel rm [deployment-url]

# Open current deployment
vercel open
```

## Resources

- Vercel Documentation: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Vercel CLI: https://vercel.com/docs/cli

## Quick Deploy Checklist

- [ ] Code is pushed to GitHub
- [ ] Vercel account created and linked to GitHub
- [ ] Project imported with correct root directory
- [ ] Environment variables configured
- [ ] Build command verified
- [ ] First deployment successful
- [ ] Backend deployed and URL configured
- [ ] Custom domain configured (optional)

---

**Your Project Structure:**
```
OperationFInance/
├── Frontend/
│   └── material-kit-react-main/    ← Deploy this directory
│       ├── package.json
│       ├── next.config.mjs
│       └── src/
└── backend/                         ← Deploy separately (Railway/Render)
```

Good luck with your deployment! 🚀
