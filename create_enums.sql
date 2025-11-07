-- Create ENUM types for TradeSphere database
-- Run this as the tradesphere_user or postgres user

-- Drop existing types if they exist (in case of recreation)
DROP TYPE IF EXISTS tierenum CASCADE;
DROP TYPE IF EXISTS marketenum CASCADE;
DROP TYPE IF EXISTS transactiontype CASCADE;

-- Create TierEnum type
CREATE TYPE tierenum AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- Create MarketEnum type
CREATE TYPE marketenum AS ENUM ('US', 'IN');

-- Create TransactionType enum
CREATE TYPE transactiontype AS ENUM ('BUY', 'SELL', 'SHORT', 'COVER');

-- Verify enums were created
SELECT typname FROM pg_type WHERE typtype = 'e';
