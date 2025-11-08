#!/bin/bash

# TradeSphere - Start Both Servers
# This script starts both backend and frontend servers

echo "🚀 Starting TradeSphere Application..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if port is in use
check_port() {
    lsof -ti:$1 > /dev/null 2>&1
    return $?
}

# Kill any processes on ports 8000 and 3000
echo "📦 Cleaning up existing processes..."
if check_port 8000; then
    echo "   Killing process on port 8000..."
    lsof -ti:8000 | xargs kill -9 2>/dev/null
    sleep 1
fi

if check_port 3000; then
    echo "   Killing process on port 3000..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    sleep 1
fi

echo ""
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${GREEN}   Starting Backend Server (FastAPI + Alpaca)${NC}"
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Start backend in background
cd "$(dirname "$0")"
source backend/.venv/bin/activate
nohup uvicorn backend.main:app --reload --port 8000 > backend.log 2>&1 &
BACKEND_PID=$!

echo "✅ Backend starting on http://localhost:8000"
echo "   PID: $BACKEND_PID"
echo "   Logs: backend.log"
echo ""

# Wait for backend to start
echo "⏳ Waiting for backend to be ready..."
sleep 3

# Check if backend is responding
if curl -s http://localhost:8000/health > /dev/null; then
    echo "✅ Backend is ready!"
else
    echo "⚠️  Backend might still be starting..."
fi

echo ""
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${GREEN}   Starting Frontend Server (Next.js)${NC}"
echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Start frontend in background
cd Frontend/material-kit-react-main
nohup npm run dev > ../../frontend.log 2>&1 &
FRONTEND_PID=$!

echo "✅ Frontend starting on http://localhost:3000"
echo "   PID: $FRONTEND_PID"
echo "   Logs: frontend.log"
echo ""

# Wait for frontend to compile
echo "⏳ Waiting for frontend to compile..."
sleep 5

echo ""
echo "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${GREEN}   🎉 TradeSphere is Running!${NC}"
echo "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "📊 Application URLs:"
echo "   • Dashboard (USA): ${BLUE}http://localhost:3000/dashboard/usa${NC}"
echo "   • Dashboard (India): ${BLUE}http://localhost:3000/dashboard/india${NC}"
echo "   • API Backend: ${BLUE}http://localhost:8000${NC}"
echo "   • API Docs: ${BLUE}http://localhost:8000/docs${NC}"
echo ""
echo "🔧 API Endpoints:"
echo "   • Portfolio: http://localhost:8000/portfolio"
echo "   • Analytics: http://localhost:8000/analytics/performance"
echo "   • Live Quotes: http://localhost:8000/market/quote/AAPL?market=US"
echo "   • Alpaca Portfolio: http://localhost:8000/trade/alpaca/portfolio"
echo ""
echo "📝 Process IDs:"
echo "   • Backend PID: $BACKEND_PID"
echo "   • Frontend PID: $FRONTEND_PID"
echo ""
echo "📋 View Logs:"
echo "   • Backend: ${BLUE}tail -f backend.log${NC}"
echo "   • Frontend: ${BLUE}tail -f frontend.log${NC}"
echo ""
echo "🛑 Stop Servers:"
echo "   ${BLUE}kill $BACKEND_PID $FRONTEND_PID${NC}"
echo "   or use: ${BLUE}./stop.sh${NC}"
echo ""
echo "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Press Ctrl+C to stop viewing this script (servers will continue running)"
echo ""

# Save PIDs to file for stop script
echo "$BACKEND_PID" > .backend.pid
echo "$FRONTEND_PID" > .frontend.pid

# Keep script running and show status
while true; do
    sleep 10
    if ! ps -p $BACKEND_PID > /dev/null; then
        echo "⚠️  Backend process stopped unexpectedly!"
        break
    fi
    if ! ps -p $FRONTEND_PID > /dev/null; then
        echo "⚠️  Frontend process stopped unexpectedly!"
        break
    fi
done
