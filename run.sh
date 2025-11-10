#!/bin/bash

# TradeSphere Bloomberg Terminal - Quick Start Script
# This script runs both backend and frontend servers

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project paths
PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/Frontend/material-kit-react-main"

# Print colored messages
print_header() {
    echo -e "\n${BLUE}============================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}============================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Cleanup function
cleanup() {
    print_header "Shutting Down Servers"
    
    # Kill backend
    print_info "Stopping backend..."
    pkill -f "uvicorn backend.main:app" 2>/dev/null || true
    lsof -ti:8000 | xargs kill -9 2>/dev/null || true
    
    # Kill frontend
    print_info "Stopping frontend..."
    pkill -f "next dev" 2>/dev/null || true
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    
    print_success "All servers stopped!"
    exit 0
}

# Setup signal handlers
trap cleanup SIGINT SIGTERM

# Main startup
print_header "TradeSphere Bloomberg Terminal - Startup"

# Check dependencies
print_info "Checking dependencies..."

if [ ! -d "$BACKEND_DIR/.venv" ]; then
    print_error "Backend virtual environment not found!"
    print_info "Run: cd backend && python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt"
    exit 1
fi

if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    print_error "Frontend node_modules not found!"
    print_info "Run: cd Frontend/material-kit-react-main && npm install"
    exit 1
fi

print_success "Dependencies OK"

# Kill any existing processes on ports 8000 and 3000
print_info "Cleaning up ports..."
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 1

# Start backend
print_header "Starting Backend API"
cd "$PROJECT_ROOT"
source "$BACKEND_DIR/.venv/bin/activate"
python -m uvicorn backend.main:app --reload --port 8000 --host 127.0.0.1 > backend.log 2>&1 &
BACKEND_PID=$!
print_success "Backend starting (PID: $BACKEND_PID)..."

# Wait for backend to be ready
print_info "Waiting for backend to initialize..."
for i in {1..30}; do
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
        print_success "Backend API ready!"
        break
    fi
    sleep 1
    if [ $i -eq 30 ]; then
        print_error "Backend failed to start!"
        cat backend.log
        cleanup
        exit 1
    fi
done

# Start frontend
print_header "Starting Frontend"
cd "$FRONTEND_DIR"
npm run dev > "$PROJECT_ROOT/frontend.log" 2>&1 &
FRONTEND_PID=$!
print_success "Frontend starting (PID: $FRONTEND_PID)..."

# Wait for frontend to be ready
print_info "Waiting for frontend to initialize..."
for i in {1..60}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        print_success "Frontend ready!"
        break
    fi
    sleep 1
    if [ $i -eq 60 ]; then
        print_error "Frontend failed to start!"
        cat "$PROJECT_ROOT/frontend.log"
        cleanup
        exit 1
    fi
done

# All started
print_header "Servers Running Successfully!"
print_success "Backend API: http://127.0.0.1:8000"
print_success "Frontend: http://localhost:3000"
print_success "API Docs: http://127.0.0.1:8000/docs"
print_info ""
print_info "Logs:"
print_info "  Backend: $PROJECT_ROOT/backend.log"
print_info "  Frontend: $PROJECT_ROOT/frontend.log"
print_info ""
print_info "Press Ctrl+C to stop all servers"

# Monitor processes
while true; do
    # Check if backend is still running
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        print_error "Backend process died! Check backend.log"
        cleanup
        exit 1
    fi
    
    # Check if frontend is still running
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        print_error "Frontend process died! Check frontend.log"
        cleanup
        exit 1
    fi
    
    sleep 2
done
