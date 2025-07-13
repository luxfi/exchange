const express = require('express');
const { Pool } = require('pg');
const Redis = require('ioredis');
const cors = require('cors');
const { ethers } = require('ethers');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Redis connection
const redis = new Redis(process.env.REDIS_URL);

// Ethereum provider
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    await redis.ping();
    const blockNumber = await provider.getBlockNumber();
    
    res.json({
      status: 'healthy',
      services: {
        database: 'connected',
        redis: 'connected',
        blockchain: 'connected',
        blockNumber
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

// Token list endpoint
app.get('/api/tokens', async (req, res) => {
  try {
    const cached = await redis.get('tokens:list');
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    // In production, fetch from database or smart contracts
    const tokens = [
      {
        address: '0x0000000000000000000000000000000000000000',
        symbol: 'LUX',
        name: 'Lux Network',
        decimals: 18,
        logoURI: '/tokens/lux.png'
      },
      {
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        logoURI: '/tokens/usdc.png'
      },
      {
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        symbol: 'USDT',
        name: 'Tether USD',
        decimals: 6,
        logoURI: '/tokens/usdt.png'
      }
    ];
    
    await redis.setex('tokens:list', 300, JSON.stringify(tokens));
    res.json(tokens);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Pool list endpoint
app.get('/api/pools', async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    
    // Query pools from Graph Node
    const graphUrl = process.env.GRAPH_NODE_URL || 'http://localhost:8000';
    const query = `
      query GetPools($limit: Int!, $offset: Int!) {
        pairs(first: $limit, skip: $offset, orderBy: reserveUSD, orderDirection: desc) {
          id
          token0 {
            id
            symbol
            name
          }
          token1 {
            id
            symbol
            name
          }
          reserve0
          reserve1
          reserveUSD
          volumeUSD
          txCount
        }
      }
    `;
    
    // For now, return mock data
    const pools = [
      {
        id: '0x1234567890abcdef',
        token0: { symbol: 'LUX', name: 'Lux Network' },
        token1: { symbol: 'USDC', name: 'USD Coin' },
        reserve0: '1000000',
        reserve1: '1250000',
        reserveUSD: '2500000',
        volumeUSD: '10000000',
        txCount: '1523'
      }
    ];
    
    res.json({ pools, total: pools.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Trading history endpoint
app.get('/api/trades', async (req, res) => {
  try {
    const { address, limit = 50 } = req.query;
    
    // In production, query from database or subgraph
    const trades = [];
    
    res.json({ trades });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User portfolio endpoint
app.get('/api/portfolio/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    // Mock portfolio data
    const portfolio = {
      address,
      totalValueUSD: '10000',
      tokens: [
        {
          symbol: 'LUX',
          balance: '5000',
          valueUSD: '6250'
        },
        {
          symbol: 'USDC',
          balance: '3750',
          valueUSD: '3750'
        }
      ],
      positions: []
    };
    
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`Exchange API running on port ${PORT}`);
});