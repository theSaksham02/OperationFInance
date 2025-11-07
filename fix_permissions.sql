-- Connect to your database and run these commands to fix permissions
-- Run this as postgres superuser

-- First, connect to the database
\c uptrade

-- Make tradesphere_user the owner of the database
ALTER DATABASE uptrade OWNER TO tradesphere_user;

-- Grant all privileges on the schema
GRANT ALL ON SCHEMA public TO tradesphere_user;

-- Make tradesphere_user owner of all existing tables
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'ALTER TABLE public.' || quote_ident(r.tablename) || ' OWNER TO tradesphere_user';
    END LOOP;
END$$;

-- Make tradesphere_user owner of all sequences
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public') LOOP
        EXECUTE 'ALTER SEQUENCE public.' || quote_ident(r.sequence_name) || ' OWNER TO tradesphere_user';
    END LOOP;
END$$;

-- Grant all privileges
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO tradesphere_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO tradesphere_user;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO tradesphere_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO tradesphere_user;
