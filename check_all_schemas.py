"""Check all table schemas."""
import asyncio
import asyncpg


async def main():
    conn = await asyncpg.connect(
        "postgresql://tradesphere_user:dandala@localhost:5432/uptrade"
    )
    
    tables = ['users', 'positions', 'transactions', 'equity_snapshots']
    
    for table in tables:
        result = await conn.fetch("""
            SELECT column_name, data_type, column_default 
            FROM information_schema.columns 
            WHERE table_name=$1
            ORDER BY ordinal_position
        """, table)
        
        print(f"\n{table.upper()} table schema:")
        for row in result:
            default_str = str(row['column_default'])[:50] if row['column_default'] else 'None'
            print(f"  {row['column_name']}: {row['data_type']} (default: {default_str})")
    
    await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
