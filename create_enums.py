import asyncio
import asyncpg

async def create_enums():
    # Connect to PostgreSQL
    conn = await asyncpg.connect(
        user='tradesphere_user',
        password='dandala',
        database='uptrade',
        host='localhost',
        port=5432
    )
    
    try:
        # Drop existing types if they exist
        await conn.execute("DROP TYPE IF EXISTS tierenum CASCADE")
        await conn.execute("DROP TYPE IF EXISTS marketenum CASCADE")
        await conn.execute("DROP TYPE IF EXISTS transactiontype CASCADE")
        print("Dropped existing ENUM types (if any)")
        
        # Create TierEnum type
        await conn.execute("CREATE TYPE tierenum AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')")
        print("Created tierenum")
        
        # Create MarketEnum type
        await conn.execute("CREATE TYPE marketenum AS ENUM ('US', 'IN')")
        print("Created marketenum")
        
        # Create TransactionType enum
        await conn.execute("CREATE TYPE transactiontype AS ENUM ('BUY', 'SELL', 'SHORT', 'COVER')")
        print("Created transactiontype")
        
        # Verify
        result = await conn.fetch("SELECT typname FROM pg_type WHERE typtype = 'e'")
        print("\nEnum types in database:")
        for row in result:
            print(f"  - {row['typname']}")
            
        print("\n✅ All ENUM types created successfully!")
        
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(create_enums())
