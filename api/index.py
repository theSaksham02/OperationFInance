"""
Vercel serverless entry point for FastAPI backend.
This allows deploying the FastAPI backend on Vercel as serverless functions.

⚠️ LIMITATIONS:
- No WebSocket support (real-time features won't work)
- 10 second timeout per request
- Cold starts on first request

For WebSockets and real-time features, deploy backend separately (Render/Railway).
"""
import sys
import os

# Add parent directory to path so we can import backend
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

# Import the FastAPI app
from backend.main import app

# Export for Vercel
app = app

# Override WebSocket routes with error messages
@app.get("/ws/tickers")
@app.get("/ws/quote/{symbol}")
@app.get("/ws/orderbook/{symbol}")
async def websocket_not_supported():
    return {
        "error": "WebSocket not supported on Vercel serverless deployment",
        "message": "For real-time features, please deploy backend to Render or Railway",
        "documentation": "See VERCEL_FASTAPI_SETUP.md for details",
        "status": 501
    }
