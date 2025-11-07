import asyncio
from logging.config import fileConfig
from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import AsyncEngine
from alembic import context
import sys
import os
<<<<<<< HEAD

# Add parent directory to path to import backend module
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__) + '/..'))

=======
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))
>>>>>>> MK
from backend.models import Base
from backend.config import settings

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
fileConfig(config.config_file_name)

target_metadata = Base.metadata

def run_migrations_offline():
    url = settings.DATABASE_URL
    context.configure(
        url=url, target_metadata=target_metadata, literal_binds=True, dialect_opts={"paramstyle": "named"}
    )
    with context.begin_transaction():
        context.run_migrations()

<<<<<<< HEAD
async def run_migrations_online():
    from sqlalchemy.ext.asyncio import create_async_engine
    
    connectable = create_async_engine(
        settings.DATABASE_URL,
        poolclass=pool.NullPool,
    )
    
    async def do_run_migrations():
        async with connectable.connect() as connection:
            await connection.run_sync(do_run_migrations_sync)
        await connectable.dispose()
    
    def do_run_migrations_sync(connection: Connection):
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()
    
    await do_run_migrations()
=======
def run_migrations_online():
    connectable = AsyncEngine(
        poolclass=pool.NullPool,
        url=settings.DATABASE_URL
    )
    async def do_run_migrations(connection: Connection):
        context.configure(connection=connection, target_metadata=target_metadata)
        async with context.begin_transaction():
            context.run_migrations()
    async with connectable.connect() as connection:
        await do_run_migrations(connection)
    await connectable.dispose()
>>>>>>> MK

if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
