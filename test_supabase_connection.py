"""Test Supabase database connection."""
import asyncio
import asyncpg
from dotenv import load_dotenv
import os

load_dotenv()

async def test_connection():
    database_url = os.getenv('DATABASE_URL')
    # Convert to standard PostgreSQL URL for asyncpg
    db_url = database_url.replace('postgresql+asyncpg://', 'postgresql://')
    
    print("=" * 80)
    print("Testing Supabase Connection")
    print("=" * 80)
    
    # Hide password in display
    display_url = db_url.split('@')[1] if '@' in db_url else db_url
    print(f"\nConnecting to: {display_url}")
    
    try:
        print("\n1. Attempting connection...")
        conn = await asyncpg.connect(db_url)
        print("   ✅ Connected successfully!")
        
        print("\n2. Checking PostgreSQL version...")
        version = await conn.fetchval('SELECT version()')
        print(f"   ✅ {version.split(',')[0]}")
        
        print("\n3. Listing tables...")
        tables = await conn.fetch("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        """)
        
        if len(tables) == 0:
            print("   ⚠️  No tables found - database needs migration")
        else:
            print(f"   ✅ Found {len(tables)} tables:")
            for table in tables:
                print(f"      - {table['table_name']}")
        
        print("\n4. Checking users table...")
        try:
            count = await conn.fetchval('SELECT COUNT(*) FROM users')
            print(f"   ✅ Users table has {count} records")
        except Exception as e:
            print(f"   ⚠️  Users table check failed: {e}")
        
        await conn.close()
        
        print("\n" + "=" * 80)
        print("✅ Supabase connection test PASSED!")
        print("=" * 80)
        return True
        
    except Exception as e:
        print(f"\n   ❌ Connection failed: {e}")
        print("\n" + "=" * 80)
        print("❌ Supabase connection test FAILED!")
        print("=" * 80)
        print("\nPlease check:")
        print("1. DATABASE_URL in .env file is correct")
        print("2. Supabase project is running")
        print("3. Password is correct")
        print("4. Network connection is stable")
        return False

if __name__ == "__main__":
    asyncio.run(test_connection())
