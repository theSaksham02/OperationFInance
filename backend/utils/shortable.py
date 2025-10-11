"""Utilities for generating shortable stock lists and interest/margin computations."""
from typing import List, Dict, Tuple
import random
from ..config import settings
from decimal import Decimal


def generate_shortable_symbols(symbols: List[str], count: int = None) -> List[Dict]:
    """Randomly select symbols and assign an annual borrow rate within configured band.

    Returns list of dicts: {symbol, borrow_rate_annual}
    """
    if count is None:
        count = settings.SHORTABLE_SELECTION_COUNT
    available = list(symbols)
    count = min(count, len(available))
    selected = random.sample(available, count)
    results = []
    for s in selected:
        rate = round(random.uniform(settings.SHORTABLE_MIN_RATE, settings.SHORTABLE_MAX_RATE), 4)
        results.append({"symbol": s, "borrow_rate_annual": rate})
    return results


def daily_interest_for_short(notional_value: Decimal, annual_rate: float) -> Decimal:
    """Compute one day's interest for a short position (cash charged daily).

    interest = notional_value * annual_rate / 365
    """
    return (notional_value * Decimal(annual_rate)) / Decimal(365)


def initial_short_margin_required(notional_value: Decimal) -> Decimal:
    return notional_value * Decimal(1.5)


def maintenance_required(short_value: Decimal) -> Decimal:
    return short_value * Decimal(0.3)
