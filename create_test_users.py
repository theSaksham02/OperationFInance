#!/usr/bin/env python3
"""
Quick script to create test users for Uptrade Global platform.
Usage: python create_test_users.py
"""
import asyncio
import sys
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_path.parent))

from backend.database import AsyncSessionLocal
from backend import crud
from backend.security.auth import get_password_hash


async def create_test_users():
    """Create a set of test users for development."""
    
    test_users = [
        {
            "username": "demo_beginner",
            "email": "beginner@uptrade.test",
            "password": "Demo123!",
            "tier": "BEGINNER"
        },
        {
            "username": "demo_intermediate",
            "email": "intermediate@uptrade.test",
            "password": "Demo123!",
            "tier": "INTERMEDIATE"
        },
        {
            "username": "demo_advanced",
            "email": "advanced@uptrade.test",
            "password": "Demo123!",
            "tier": "ADVANCED"
        },
        {
            "username": "testuser",
            "email": "test@uptrade.test",
            "password": "test123",
            "tier": "BEGINNER"
        },
    ]
    
    async with AsyncSessionLocal() as db:
        print("Creating test users...\n")
        
        for user_data in test_users:
            # Check if user already exists
            existing = await crud.get_user_by_username(db, user_data["username"])
            if existing:
                print(f"⏭️  {user_data['username']} already exists (ID: {existing.id})")
                continue
            
            # Create user
            hashed = get_password_hash(user_data["password"])
            user = await crud.create_user(
                db, 
                user_data["username"], 
                user_data["email"], 
                hashed
            )
            
            # Update tier if not BEGINNER
            if user_data.get("tier") and user_data["tier"] != "BEGINNER":
                from backend.models import TierEnum
                user.tier = TierEnum[user_data["tier"]]
                db.add(user)
                await db.commit()
                await db.refresh(user)
            
            print(f"✅ Created {user.username} (ID: {user.id}, Tier: {user.tier.value}, Balance: ${user.cash_balance:,.2f})")
        
        print("\n" + "="*60)
        print("TEST USERS CREATED SUCCESSFULLY!")
        print("="*60)
        print("\nYou can now log in with any of these credentials:")
        print("\n  Username: demo_beginner    | Password: Demo123!")
        print("  Username: demo_intermediate | Password: Demo123!")
        print("  Username: demo_advanced     | Password: Demo123!")
        print("  Username: testuser          | Password: test123")
        print("  Username: kumar             | Password: testpassword123")
        print("\nAll users start with $100,000 cash balance.")


if __name__ == "__main__":
    asyncio.run(create_test_users())
