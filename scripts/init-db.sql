-- Lux Exchange - Database Initialization
-- This script runs on first PostgreSQL startup

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Swap transactions table
CREATE TABLE IF NOT EXISTS swap_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tx_hash VARCHAR(66) NOT NULL UNIQUE,
    block_number BIGINT NOT NULL,
    block_timestamp TIMESTAMP NOT NULL,
    from_address VARCHAR(42) NOT NULL,
    to_address VARCHAR(42) NOT NULL,
    token_in VARCHAR(42) NOT NULL,
    token_out VARCHAR(42) NOT NULL,
    amount_in NUMERIC(78, 0) NOT NULL,
    amount_out NUMERIC(78, 0) NOT NULL,
    pair_address VARCHAR(42) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Liquidity events table
CREATE TABLE IF NOT EXISTS liquidity_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tx_hash VARCHAR(66) NOT NULL,
    block_number BIGINT NOT NULL,
    block_timestamp TIMESTAMP NOT NULL,
    event_type VARCHAR(10) NOT NULL CHECK (event_type IN ('add', 'remove')),
    provider VARCHAR(42) NOT NULL,
    pair_address VARCHAR(42) NOT NULL,
    token0 VARCHAR(42) NOT NULL,
    token1 VARCHAR(42) NOT NULL,
    amount0 NUMERIC(78, 0) NOT NULL,
    amount1 NUMERIC(78, 0) NOT NULL,
    liquidity NUMERIC(78, 0) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Token metadata cache
CREATE TABLE IF NOT EXISTS token_metadata (
    address VARCHAR(42) PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    decimals INTEGER NOT NULL,
    logo_uri TEXT,
    coingecko_id VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pair metadata cache
CREATE TABLE IF NOT EXISTS pair_metadata (
    address VARCHAR(42) PRIMARY KEY,
    token0 VARCHAR(42) NOT NULL,
    token1 VARCHAR(42) NOT NULL,
    reserve0 NUMERIC(78, 0) NOT NULL DEFAULT 0,
    reserve1 NUMERIC(78, 0) NOT NULL DEFAULT 0,
    total_supply NUMERIC(78, 0) NOT NULL DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contract deployments tracking
CREATE TABLE IF NOT EXISTS contract_deployments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    network_id INTEGER NOT NULL,
    contract_name VARCHAR(100) NOT NULL,
    address VARCHAR(42) NOT NULL,
    tx_hash VARCHAR(66),
    deployer VARCHAR(42),
    block_number BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(network_id, contract_name)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_swap_tx_hash ON swap_transactions(tx_hash);
CREATE INDEX IF NOT EXISTS idx_swap_from ON swap_transactions(from_address);
CREATE INDEX IF NOT EXISTS idx_swap_block ON swap_transactions(block_number DESC);
CREATE INDEX IF NOT EXISTS idx_swap_pair ON swap_transactions(pair_address);
CREATE INDEX IF NOT EXISTS idx_swap_timestamp ON swap_transactions(block_timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_liquidity_tx_hash ON liquidity_events(tx_hash);
CREATE INDEX IF NOT EXISTS idx_liquidity_provider ON liquidity_events(provider);
CREATE INDEX IF NOT EXISTS idx_liquidity_pair ON liquidity_events(pair_address);
CREATE INDEX IF NOT EXISTS idx_liquidity_timestamp ON liquidity_events(block_timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_pair_tokens ON pair_metadata(token0, token1);

-- Insert default local tokens
INSERT INTO token_metadata (address, symbol, name, decimals, logo_uri) VALUES
    ('0x0000000000000000000000000000000000000000', 'LUX', 'Lux', 18, '/tokens/lux.svg'),
    ('0x0000000000000000000000000000000000000001', 'WLUX', 'Wrapped LUX', 18, '/tokens/wlux.svg')
ON CONFLICT (address) DO NOTHING;

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO exchange;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO exchange;
