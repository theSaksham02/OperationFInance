"""Test Stockgro API integration."""
import asyncio
from backend.services.stockgro import list_stocks, search_stocks, get_realtime_quote


async def main():
    print("Testing Stockgro API...")
    print("=" * 60)
    
    # Test 1: List available stocks
    print("\n1. Listing available stocks (first 5)...")
    try:
        stocks = await list_stocks()
        print(f"✓ Found {len(stocks) if isinstance(stocks, list) else 'unknown'} stocks")
        if isinstance(stocks, list) and len(stocks) > 0:
            for i, stock in enumerate(stocks[:5]):
                print(f"  - {stock}")
        else:
            print(f"  Response: {stocks}")
    except Exception as e:
        print(f"✗ Error: {e}")
    
    # Test 2: Search for popular Indian stocks
    print("\n2. Searching for 'RELIANCE'...")
    try:
        results = await search_stocks("RELIANCE", page=1, per_page=5)
        print(f"✓ Search results:")
        print(f"  {results}")
    except Exception as e:
        print(f"✗ Error: {e}")
    
    # Test 3: Get real-time quote for TCS (if available)
    print("\n3. Getting real-time quote for a stock...")
    try:
        # Try to get quote for TCS or RELIANCE
        quote = await get_realtime_quote("TCS")
        print(f"✓ TCS Quote: {quote}")
    except Exception as e:
        print(f"✗ Error getting TCS quote: {e}")
        print("  Trying RELIANCE instead...")
        try:
            quote = await get_realtime_quote("RELIANCE")
            print(f"✓ RELIANCE Quote: {quote}")
        except Exception as e2:
            print(f"✗ Error: {e2}")
    
    print("\n" + "=" * 60)
    print("Stockgro API test complete!")


if __name__ == "__main__":
    asyncio.run(main())
