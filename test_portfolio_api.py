"""Test portfolio endpoint with authentication."""
import asyncio
import httpx


async def test_portfolio():
    # First, login to get a token
    login_url = "http://127.0.0.1:8000/auth/login"
    login_data = {
        "username": "kumar",  # Replace with your username
        "password": "user1",  # Replace with your password
    }
    
    print("🔐 Logging in...")
    async with httpx.AsyncClient() as client:
        response = await client.post(login_url, data=login_data)
        
        if response.status_code != 200:
            print(f"❌ Login failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return
        
        token_data = response.json()
        token = token_data.get("access_token")
        print(f"✅ Login successful! Token: {token[:20]}...")
        
        # Now test the portfolio endpoint
        portfolio_url = "http://127.0.0.1:8000/portfolio"
        headers = {"Authorization": f"Bearer {token}"}
        
        print("\n📊 Fetching portfolio...")
        response = await client.get(portfolio_url, headers=headers)
        
        if response.status_code != 200:
            print(f"❌ Portfolio fetch failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return
        
        portfolio_data = response.json()
        print(f"✅ Portfolio data received!")
        print(f"\n💰 Cash Balance: ${portfolio_data.get('cash_balance', 0):,.2f}")
        print(f"📈 Total Equity: ${portfolio_data.get('equity', 0):,.2f}")
        print(f"🔒 Maintenance Required: ${portfolio_data.get('maintenance_required', 0):,.2f}")
        print(f"🎯 Margin Headroom: ${portfolio_data.get('margin_headroom', 0):,.2f}")
        print(f"⚠️  In Margin Call: {portfolio_data.get('in_margin_call', False)}")
        
        positions = portfolio_data.get('positions', [])
        print(f"\n📦 Positions: {len(positions)}")
        
        if positions:
            for pos in positions:
                print(f"\n   Symbol: {pos['symbol']}")
                print(f"   Shares: {pos['shares']}")
                print(f"   Avg Price: ${pos['avg_price']:.2f}")
                print(f"   Current Price: ${pos.get('current_price', 0):.2f}")
                print(f"   P&L: ${pos.get('unrealized_pnl', 0):.2f}")


if __name__ == "__main__":
    asyncio.run(test_portfolio())
