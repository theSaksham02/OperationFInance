import asyncio
from backend.database import engine
from sqlalchemy import text

async def check_tables():
    async with engine.connect() as conn:
        result = await conn.execute(text("SELECT tablename FROM pg_tables WHERE schemaname = 'public'"))
        tables = [row[0] for row in result]
        print("Existing tables:", tables)
        
        # Check if users table exists
        if 'users' in tables:
            result = await conn.execute(text("SELECT COUNT(*) FROM users"))
            count = result.scalar()
            print(f"Users table has {count} records")
        else:
            print("No users table found!")

if __name__ == "__main__":
    asyncio.run(check_tables())
