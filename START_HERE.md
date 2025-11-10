# 🚀 Quick Start Guide

## Run Both Servers with One Command!

### Option 1: Using Python Script (Recommended)
```bash
python3 run.py
```

### Option 2: Using Bash Script (macOS/Linux)
```bash
./run.sh
```

### Option 3: Manual Start (If above don't work)
```bash
# Terminal 1 - Backend
cd /Users/sakshammishra/OperationFInance
source backend/.venv/bin/activate
python -m uvicorn backend.main:app --reload --port 8000

# Terminal 2 - Frontend  
cd /Users/sakshammishra/OperationFInance/Frontend/material-kit-react-main
npm run dev
```

---

## 🎯 What Gets Started

When you run the startup script, it will:

1. ✅ Check if dependencies are installed
2. ✅ Clean up ports 8000 and 3000
3. ✅ Start backend API on http://127.0.0.1:8000
4. ✅ Start frontend on http://localhost:3000
5. ✅ Monitor both processes
6. ✅ Gracefully shutdown on Ctrl+C

---

## 📡 Access Your Application

After startup completes:

- **Frontend Dashboard:** http://localhost:3000
- **Backend API:** http://127.0.0.1:8000
- **API Documentation:** http://127.0.0.1:8000/docs
- **Health Check:** http://127.0.0.1:8000/health

---

## 🛑 Stop All Servers

Press **Ctrl+C** in the terminal where you ran the script.

The script will automatically:
- Stop backend process
- Stop frontend process
- Clean up ports 8000 and 3000

---

## 🐛 Troubleshooting

### Script won't start
```bash
# Make scripts executable
chmod +x run.py
chmod +x run.sh
```

### Dependencies not found

**Backend:**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

**Frontend:**
```bash
cd Frontend/material-kit-react-main
npm install
```

### Port already in use
```bash
# Kill processes on ports
lsof -ti:8000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### Check logs

If using `run.sh`, logs are saved to:
- `backend.log` - Backend server logs
- `frontend.log` - Frontend server logs

---

## ✨ Features

Your Bloomberg-style trading terminal includes:

### Working Features:
- ✅ **USA Market** - Real-time dashboard
- ✅ **India Market** - Real-time dashboard  
- ✅ **Live WebSocket Streaming** - 13 symbols streaming
- ✅ **Paper Trading** - Alpaca integration
- ✅ **Order Placement** - Buy/sell stocks
- ✅ **Transaction History** - Track all trades
- ✅ **Portfolio Management** - View positions

### Coming Soon (Need API Keys):
- ⏳ Real market data (add Finnhub API key)
- ⏳ News feed (add News API key)
- ⏳ Technical indicators (add Alpha Vantage key)

---

## 🔑 Add API Keys

To enable real market data:

1. Get Finnhub API key: https://finnhub.io/register
2. Edit `backend/.env`:
   ```bash
   FINNHUB_API_KEY=your_real_key_here
   ```
3. Restart servers

See `API_KEYS_NEEDED.md` for detailed instructions.

---

## 📝 Quick Commands

```bash
# Start everything
python3 run.py

# Or use shell script
./run.sh

# Check if servers are running
curl http://localhost:8000/health
curl http://localhost:3000

# Test WebSocket
curl http://localhost:8000/ws/connections

# View API docs
open http://localhost:8000/docs

# Open dashboard
open http://localhost:3000
```

---

## 💡 Tips

1. **First time setup?** Make sure you've installed dependencies first
2. **Ports in use?** The script automatically cleans them up
3. **Want logs?** Use `run.sh` which saves logs to files
4. **Development mode:** Both servers auto-reload on file changes
5. **Ctrl+C once** to gracefully stop both servers

---

**Ready to trade! 🎉**
