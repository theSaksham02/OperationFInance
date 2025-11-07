"""
Alpaca Paper Trading Service
Integrates with Alpaca's paper trading API for order simulation and portfolio management.
"""
import os
from alpaca.trading.client import TradingClient
from alpaca.trading.requests import MarketOrderRequest
from alpaca.trading.enums import OrderSide, TimeInForce
from alpaca.trading.models import Order

API_KEY = os.getenv("ALPACA_API_KEY")
API_SECRET = os.getenv("ALPACA_API_SECRET")

# Set paper=True for paper trading
trading_client = TradingClient(API_KEY, API_SECRET, paper=True)

def place_order(symbol: str, qty: int, side: str):
    """Place a market order using Alpaca paper trading API."""
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
    positions = trading_client.get_all_positions()
    return positions

# Example usage:
# order = place_order("AAPL", 1, "buy")
# positions = get_portfolio()
