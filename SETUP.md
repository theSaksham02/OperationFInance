# Complete Setup Guide for OperationFinance

## Prerequisites
- ✅ PostgreSQL database running (you have this)
- ✅ Database tables created (you have this)
- ⚠️ Node.js installed (check: `node --version`)
- ⚠️ Python 3.12 installed (you have this)

## Backend Setup

### 1. Activate Virtual Environment
```powershell
cd d:\OperationFInance-1
.\.venv\Scripts\Activate.ps1
```

### 2. Install Missing Packages
```powershell
pip install pydantic-settings email-validator
```

### 3. Verify Database Connection
Check that PostgreSQL is running and your credentials in `.env` are correct:
- Username: `tradesphere_user`
- Password: `your_secure_password` (change this to actual password)
- Database: `uptrade`
- Port: `5432`

### 4. Test Backend
```powershell
uvicorn backend.main:app --reload --port 8000
```

Expected output:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [XXXX] using WatchFiles
INFO:     Application startup complete.
```

Test in browser: http://127.0.0.1:8000/health
Should return: `{"status":"ok"}`

---

## Frontend Setup

### 1. Install Node Packages
```powershell
cd d:\OperationFInance-1\Frontend\material-kit-react-main
npm install
npm install --save-dev @types/node
```

### 2. Environment is Already Configured
`.env.local` already has:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### 3. Start Frontend
```powershell
npm run dev
```

Expected output:
```
> dev
> next dev

  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
```

---

## Testing the Integration

### 1. Register a User
- Go to: http://localhost:3000/auth/sign-up
- Fill in the form
- Click "Sign up"

### 2. Login
- Go to: http://localhost:3000/auth/sign-in
- Use credentials you just created
- Click "Sign in"

### 3. Check Console
Open browser DevTools (F12) and check:
- **Network tab**: Should see requests to `http://localhost:8000/auth/...`
- **Console tab**: Should have no errors

---

## Common Issues & Fixes

### Backend won't start
**Error**: `ModuleNotFoundError: No module named 'pydantic_settings'`
**Fix**: `pip install pydantic-settings`

**Error**: `ImportError: email-validator is not installed`
**Fix**: `pip install email-validator`

**Error**: Database connection failed
**Fix**: 
1. Check PostgreSQL is running
2. Verify credentials in `.env` match your database
3. Test connection: `psql -U tradesphere_user -d uptrade -h localhost`

### Frontend won't start
**Error**: `Cannot find name 'process'`
**Fix**: `npm install --save-dev @types/node`

**Error**: `pnpm: command not found` or `npm: command not found`
**Fix**: Install Node.js from https://nodejs.org/

### CORS errors in browser
**Error**: `Access-Control-Allow-Origin`
**Fix**: Verify `.env` has `CORS_ORIGINS=http://localhost:3000`

---

## What's Been Integrated

✅ **Authentication Flow**:
- Frontend calls `POST /auth/login` with credentials
- Backend returns JWT token
- Token stored in localStorage
- All API requests include `Authorization: Bearer <token>` header

✅ **API Helper** (`src/lib/api.ts`):
- Automatically adds JWT token to requests
- Handles errors
- Configured with API base URL

✅ **Auth Client** (`src/lib/auth/client.ts`):
- `signInWithPassword()` → calls backend `/auth/login`
- `signUp()` → calls backend `/auth/register`
- `getUser()` → calls backend `/auth/me`
- Token management

---

## Next Steps After Integration Works

1. **Update Database Credentials**: Change default passwords in `.env`
2. **Test All Features**: Portfolio, trades, admin panel
3. **Add More API Integrations**: Connect other frontend pages to backend endpoints
4. **Setup Production**: Environment variables for deployment

---

## Quick Start Commands

**Terminal 1 (Backend)**:
```powershell
cd d:\OperationFInance-1
.\.venv\Scripts\Activate.ps1
uvicorn backend.main:app --reload --port 8000
```

**Terminal 2 (Frontend)**:
```powershell
cd d:\OperationFInance-1\Frontend\material-kit-react-main
npm run dev
```

**Then visit**: http://localhost:3000
