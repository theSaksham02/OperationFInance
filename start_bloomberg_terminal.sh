#!/bin/bash

# Bloomberg Terminal - Quick Fix Script
# This script resolves the email-validator dependency issue and starts servers

echo "🚀 Bloomberg Terminal - Quick Start"
echo "===================================="
echo ""

# Navigate to project root
cd /Users/sakshammishra/OperationFInance

echo "📦 Step 1: Installing missing dependencies..."
conda install -c conda-forge email-validator -y

if [ $? -ne 0 ]; then
    echo "❌ Conda install failed, trying pip..."
    /opt/anaconda3/bin/pip install email-validator
fi

echo "✅ Dependencies installed!"
echo ""

echo "🛑 Step 2: Stopping any existing backend servers..."
pkill -9 -f "uvicorn backend.main:app" 2>/dev/null || true
sleep 2

echo "✅ Old servers stopped!"
echo ""

echo "🚀 Step 3: Starting backend server..."
python -m uvicorn backend.main:app --reload --port 8000 &
BACKEND_PID=$!

echo "⏳ Waiting for backend to start..."
sleep 5

# Test backend
if curl -s http://localhost:8000/health | grep -q "ok"; then
    echo "✅ Backend running at http://localhost:8000"
else
    echo "❌ Backend failed to start. Check terminal for errors."
    exit 1
fi

echo ""
echo "📡 Step 4: Testing WebSocket endpoints..."
RESULT=$(curl -s http://localhost:8000/ws/connections)
echo "WebSocket status: $RESULT"

echo ""
echo "======================================"
echo "✅ Backend is running!"
echo ""
echo "📊 Available WebSocket Endpoints:"
echo "  - ws://localhost:8000/ws/tickers"
echo "  - ws://localhost:8000/ws/quote/{symbol}"
echo "  - ws://localhost:8000/ws/orderbook/{symbol}"
echo ""
echo "🌐 API Health: http://localhost:8000/health"
echo "📖 API Docs: http://localhost:8000/docs"
echo ""
echo "⚠️  IMPORTANT: Add real API keys to backend/.env"
echo "   Currently using simulated data."
echo ""
echo "🔑 Get Finnhub API key: https://finnhub.io/register"
echo "   Then add to backend/.env:"
echo "   FINNHUB_API_KEY=your_real_key_here"
echo ""
echo "🎉 Bloomberg Terminal ready!"
echo "======================================"
echo ""
echo "💡 Next steps:"
echo "1. Open http://localhost:3000 (frontend should already be running)"
echo "2. Test WebSocket in browser console:"
echo "   const ws = new WebSocket('ws://localhost:8000/ws/tickers');"
echo "   ws.onmessage = (e) => console.log(JSON.parse(e.data));"
echo ""
echo "To stop backend: pkill -f 'uvicorn backend.main:app'"
