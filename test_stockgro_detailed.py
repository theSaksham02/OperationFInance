"""Test Stockgro API with proper error handling."""
import asyncio
import httpx
import hmac
import hashlib
import time
import os
from dotenv import load_dotenv

load_dotenv()

CLIENT_ID = os.getenv("STOCKGRO_CLIENT_ID", "").strip('"')
CLIENT_SECRET = os.getenv("STOCKGRO_CLIENT_SECRET", "").strip('"')

print(f"Testing with:")
print(f"  Client ID: {CLIENT_ID}")
print(f"  Client Secret: {CLIENT_SECRET[:10]}...{CLIENT_SECRET[-5:]}")
print("=" * 80)


def sign(client_id: str, client_secret: str, nonce: str) -> str:
    """Generate HMAC-SHA256 signature."""
    msg = f"{client_id}:{nonce}".encode()
    key = client_secret.encode()
    return hmac.new(key, msg, hashlib.sha256).hexdigest()


async def test_endpoint(method: str, path: str, params: dict = None, json_data: dict = None):
    """Test a Stockgro API endpoint."""
    base_url = "https://prod.stockgro.com/public/api/v1"
    url = f"{base_url}{path}"
    nonce = str(int(time.time() * 1000))
    signature = sign(CLIENT_ID, CLIENT_SECRET, nonce)
    
    headers = {
        "X-Client-Id": CLIENT_ID,
        "X-Signature": signature,
        "X-Nonce": nonce,
    }
    
    if method == "POST":
        headers["Content-Type"] = "application/json"
    
    print(f"\n{method} {path}")
    print(f"  Nonce: {nonce}")
    print(f"  Signature: {signature[:20]}...{signature[-10:]}")
    if params:
        print(f"  Params: {params}")
    if json_data:
        print(f"  JSON Body: {json_data}")
    
    async with httpx.AsyncClient(timeout=30) as client:
        try:
            if method == "GET":
                response = await client.get(url, headers=headers, params=params)
            else:  # POST
                response = await client.post(url, headers=headers, json=json_data)
            
            print(f"  Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"  ✓ Success!")
                if isinstance(data, dict):
                    if "success" in data:
                        print(f"    success: {data.get('success')}")
                    if "data" in data:
                        print(f"    data keys: {list(data.get('data', {}).keys()) if isinstance(data.get('data'), dict) else 'not a dict'}")
                    if "error" in data:
                        print(f"    error: {data.get('error')}")
                elif isinstance(data, list):
                    print(f"    Received list with {len(data)} items")
                    if len(data) > 0:
                        print(f"    First item: {data[0]}")
                return data
            else:
                error_text = response.text
                print(f"  ✗ Error {response.status_code}")
                print(f"    Response: {error_text}")
                try:
                    error_json = response.json()
                    if "error" in error_json:
                        print(f"    Error code: {error_json['error'].get('code')}")
                        print(f"    Error message: {error_json['error'].get('message')}")
                except:
                    pass
                return None
        except Exception as e:
            print(f"  ✗ Exception: {e}")
            return None


async def main():
    print("\nTest 1: GET /stocks")
    print("-" * 80)
    await test_endpoint("GET", "/stocks")
    
    print("\n\nTest 2: GET /stocks/search")
    print("-" * 80)
    await test_endpoint("GET", "/stocks/search", params={"q": "RELIANCE", "page": 1, "per_page": 5})
    
    print("\n\nConclusion:")
    print("-" * 80)
    print("If both tests return 400 Bad Request, the credentials are likely invalid.")
    print("Please verify with Stockgro that these are the correct API credentials.")
    print("\n" + "=" * 80)


if __name__ == "__main__":
    asyncio.run(main())
