"""
Alpaca Paper Trading Service
Integrates with Alpaca's paper trading API for order simulation and portfolio management.
"""
from alpaca.trading.client import TradingClient
from alpaca.trading.requests import MarketOrderRequest
from alpaca.trading.enums import OrderSide, TimeInForce
from alpaca.trading.models import Order
from ..config import settings

_trading_client = None

def get_trading_client():
    """Get or create the Alpaca trading client."""
    global _trading_client
    if _trading_client is None:
        _trading_client = TradingClient(
            settings.ALPACA_API_KEY,
            settings.ALPACA_API_SECRET,
            paper=True
        )
    return _trading_client

def place_order(symbol: str, qty: int, side: str):
    """Place a market order using Alpaca paper trading API."""
    trading_client = get_trading_client()
    order_data = MarketOrderRequest(
        symbol=symbol,
        qty=qty,
        side=OrderSide.BUY if side.lower() == "buy" else OrderSide.SELL,
        time_in_force=TimeInForce.DAY
    )
    order = trading_client.submit_order(order_data)
    return order

def get_portfolio():
    """Fetch current portfolio positions from Alpaca paper trading account."""
    trading_client = get_trading_client()
    positions = trading_client.get_all_positions()
    return positions

# Example usage:
# order = place_order("AAPL", 1, "buy")
# positions = get_portfolio()
