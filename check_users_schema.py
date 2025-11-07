"""Check users table schema."""
import asyncio
import asyncpg


async def main():
    conn = await asyncpg.connect(
        "postgresql://tradesphere_user:dandala@localhost:5432/uptrade"
    )
    
    result = await conn.fetch("""
        SELECT column_name, data_type, column_default 
        FROM information_schema.columns 
        WHERE table_name='users' 
        ORDER BY ordinal_position
    """)
    
    print("Users table schema:")
    for row in result:
        print(f"  {row['column_name']}: {row['data_type']} (default: {row['column_default']})")
    
    await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
