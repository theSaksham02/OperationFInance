"""Check enum types usage in tables."""
import asyncio
import asyncpg


async def main():
    conn = await asyncpg.connect(
        "postgresql://tradesphere_user:dandala@localhost:5432/uptrade"
    )
    
    # Check what enum the tier column actually uses
    result = await conn.fetch("""
        SELECT 
            c.column_name, 
            c.data_type,
            c.udt_name,
            c.column_default
        FROM information_schema.columns c
        WHERE c.table_name = 'users' AND c.column_name = 'tier'
    """)
    
    print("Tier column details:")
    for row in result:
        print(f"  Column: {row['column_name']}")
        print(f"  Data type: {row['data_type']}")
        print(f"  UDT name: {row['udt_name']}")
        print(f"  Default: {row['column_default']}")
    
    # List all enum types
    print("\n\nAll enum types in database:")
    enums = await conn.fetch("""
        SELECT t.typname, e.enumlabel 
        FROM pg_type t 
        JOIN pg_enum e ON t.oid = e.enumtypid  
        ORDER BY t.typname, e.enumsortorder
    """)
    
    current_type = None
    for row in enums:
        if row['typname'] != current_type:
            print(f"\n{row['typname']}:")
            current_type = row['typname']
        print(f"  - {row['enumlabel']}")
    
    await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
