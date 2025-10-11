from decimal import Decimal

def compute_equity(cash, long_value, short_value):
    return cash + long_value - abs(short_value)

def test_equity_and_maintenance():
    cash = Decimal('10000')
    long_value = Decimal('5000')
    short_value = Decimal('-2000')
    equity = compute_equity(cash, long_value, short_value)
    assert float(equity) == 13000.0
    maintenance = abs(short_value) * Decimal('0.3')
    assert float(maintenance) == 600.0
    in_margin_call = equity < maintenance
    assert not in_margin_call
