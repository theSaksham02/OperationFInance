from decimal import Decimal
from backend.utils import shortable

def test_daily_interest_for_short():
    notional = Decimal('10000')
    rate = 0.10  # 10% annual
    interest = shortable.daily_interest_for_short(notional, rate)
    assert round(float(interest), 2) == 2.74  # 10000*0.10/365

def test_initial_short_margin_required():
    notional = Decimal('10000')
    margin = shortable.initial_short_margin_required(notional)
    assert float(margin) == 15000.0

def test_maintenance_required():
    notional = Decimal('10000')
    maint = shortable.maintenance_required(notional)
    assert float(maint) == 3000.0
