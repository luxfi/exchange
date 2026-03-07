const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');

const app = express();
app.use(cors());
app.use(express.json());

// Configuration from environment
const RPC_URL = process.env.RPC_URL || 'https://api.lux.network/ext/bc/C/rpc';
const SUBGRAPH_V2_URL = process.env.SUBGRAPH_URL || process.env.SUBGRAPH_V2_URL || 'http://graph-node.lux-explorer.svc:8000/subgraphs/name/luxfi/uniswap-v2';
const SUBGRAPH_V3_URL = process.env.SUBGRAPH_V3_URL || 'http://graph-node.lux-explorer.svc:8000/subgraphs/name/luxfi/amm-v3';
const ZOO_SUBGRAPH_V3_URL = process.env.ZOO_SUBGRAPH_V3_URL || 'http://graph-node.lux-explorer.svc:8000/subgraphs/name/luxfi/zoo-amm-v3';
const SUBGRAPH_ZOO_V2_URL = process.env.SUBGRAPH_ZOO_V2_URL || 'http://graph-node.lux-explorer.svc:8000/subgraphs/name/luxfi/zoo-amm-v2';
const SUBGRAPH_PARS_V2_URL = process.env.SUBGRAPH_PARS_V2_URL || 'http://graph-node.lux-explorer.svc:8000/subgraphs/name/luxfi/pars-amm-v2';
const SUBGRAPH_HANZO_V2_URL = process.env.SUBGRAPH_HANZO_V2_URL || 'http://graph-node.lux-explorer.svc:8000/subgraphs/name/luxfi/hanzo-amm-v2';
const BLOCKSCOUT_API = process.env.BLOCKSCOUT_API || 'https://api-explore.lux.network';

// Ethereum provider for on-chain queries
let provider;
try {
  provider = new ethers.JsonRpcProvider(RPC_URL);
} catch (e) {
  console.error('Failed to create provider:', e.message);
}

// V3 Factory and known token addresses (verified on-chain)
const V3_FACTORY = '0x80bBc7C4C7a59C899D1B37BC14539A22D5830a84';
const TOKENS = {
  WLUX:  { address: '0x4888e4a2ee0f03051c72d2bd3acf755ed3498b3e', symbol: 'WLUX',  name: 'Wrapped LUX',  decimals: 18 },
  LUSD:  { address: '0x848Cff46eb323f323b6Bbe1Df274E40793d7f2c2', symbol: 'LUSD',  name: 'Lux USD',       decimals: 18 },
  LETH:  { address: '0x60E0a8167FC13dE89348978860466C9ceC24B9ba', symbol: 'LETH',  name: 'Lux Ether',     decimals: 18 },
  LBTC:  { address: '0x1E48D32a4F5e9f08DB9aE4959163300FaF8A6C8e', symbol: 'LBTC',  name: 'Lux Bitcoin',   decimals: 8 },
  LSOL:  { address: '0x26B40f650156C7EbF9e087Dd0dca181Fe87625B7', symbol: 'LSOL',  name: 'Lux SOL',       decimals: 18 },
  LTON:  { address: '0x3141b94b89691009b950c96e97Bff48e0C543E3C', symbol: 'LTON',  name: 'Lux TON',       decimals: 9 },
  LAVAX: { address: '0x0e4bD0DD67c15dECfBBBdbbE07FC9d51D737693D', symbol: 'LAVAX', name: 'Lux AVAX',      decimals: 18 },
};

// Simple in-memory cache
const cache = new Map();
function cached(key, ttlMs, fn) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.ts < ttlMs) return entry.data;
  return fn().then(data => { cache.set(key, { data, ts: Date.now() }); return data; });
}

// Query subgraph helper
async function querySubgraph(url, query, variables = {}) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
}

// Health check
app.get('/health', async (req, res) => {
  const checks = { status: 'healthy' };
  try {
    if (provider) {
      checks.blockNumber = await provider.getBlockNumber();
      checks.blockchain = 'connected';
    }
  } catch (e) {
    checks.blockchain = 'disconnected';
  }
  try {
    await querySubgraph(SUBGRAPH_V3_URL, '{ _meta { block { number } } }');
    checks.subgraphV3 = 'connected';
  } catch (e) {
    checks.subgraphV3 = 'syncing';
  }
  res.json(checks);
});

// Token list — real verified addresses
app.get('/api/tokens', (req, res) => {
  const tokens = [
    { address: '0x0000000000000000000000000000000000000000', symbol: 'LUX', name: 'Lux', decimals: 18, logoURI: '/tokens/lux.png' },
    ...Object.values(TOKENS).map(t => ({ ...t, logoURI: `/tokens/${t.symbol.toLowerCase()}.png` })),
  ];
  res.json(tokens);
});

// Pools — query V3 subgraph for live pool data
app.get('/api/pools', async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const data = await cached(`pools:${limit}:${offset}`, 30000, () =>
      querySubgraph(SUBGRAPH_V3_URL, `
        query GetPools($limit: Int!, $offset: Int!) {
          pools(first: $limit, skip: $offset, orderBy: totalValueLockedUSD, orderDirection: desc) {
            id
            token0 { id symbol name decimals }
            token1 { id symbol name decimals }
            feeTier
            liquidity
            sqrtPrice
            tick
            totalValueLockedUSD
            totalValueLockedToken0
            totalValueLockedToken1
            volumeUSD
            txCount
          }
        }
      `, { limit: Number(limit), offset: Number(offset) })
    );
    res.json({ pools: data.pools || [], total: (data.pools || []).length });
  } catch (error) {
    // Fallback: query V2 subgraph
    try {
      const data = await querySubgraph(SUBGRAPH_V2_URL, `{
        pairs(first: 20, orderBy: reserveUSD, orderDirection: desc) {
          id
          token0 { id symbol name }
          token1 { id symbol name }
          reserve0 reserve1 reserveUSD volumeUSD txCount
        }
      }`);
      res.json({ pools: data.pairs || [], total: (data.pairs || []).length, source: 'v2' });
    } catch (e2) {
      res.status(503).json({ error: 'Subgraphs syncing', detail: error.message });
    }
  }
});

// Swaps — query V3 subgraph for trade history
app.get('/api/trades', async (req, res) => {
  try {
    const { pool, limit = 50 } = req.query;
    const where = pool ? `where: { pool: "${pool}" }` : '';
    const data = await cached(`trades:${pool}:${limit}`, 15000, () =>
      querySubgraph(SUBGRAPH_V3_URL, `{
        swaps(first: ${Number(limit)}, orderBy: timestamp, orderDirection: desc, ${where}) {
          id
          timestamp
          pool { id token0 { symbol } token1 { symbol } }
          sender
          recipient
          amount0
          amount1
          amountUSD
          sqrtPriceX96
          tick
        }
      }`)
    );
    res.json({ trades: data.swaps || [] });
  } catch (error) {
    res.status(503).json({ error: 'Subgraph syncing', detail: error.message });
  }
});

// Token price — live from V3 pool slot0 on-chain
app.get('/api/price/:symbol', async (req, res) => {
  try {
    const sym = req.params.symbol.toUpperCase();
    const price = await cached(`price:${sym}`, 10000, async () => {
      if (sym === 'LUSD') return 1.0;
      if (!provider) return 0;

      // Get LUX price from WLUX/LUSD pool
      const factory = new ethers.Contract(V3_FACTORY, [
        'function getPool(address,address,uint24) view returns (address)'
      ], provider);

      const poolAddr = await factory.getPool(TOKENS.WLUX.address, TOKENS.LUSD.address, 3000);
      if (poolAddr === ethers.ZeroAddress) return 0;

      const pool = new ethers.Contract(poolAddr, [
        'function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)'
      ], provider);

      const slot0 = await pool.slot0();
      const sqrtPriceX96 = BigInt(slot0.sqrtPriceX96.toString());
      // WLUX < LUSD by address, so WLUX=token0, LUSD=token1
      // price = (sqrtPriceX96 / 2^96)^2 = LUSD per WLUX
      const luxPrice = Number(sqrtPriceX96 * sqrtPriceX96 * 10n**18n / (2n**192n)) / 1e18;

      if (sym === 'LUX' || sym === 'WLUX') return luxPrice;

      // Get other token price via WLUX pool
      const token = TOKENS[sym];
      if (!token) return 0;

      try {
        const pairPool = await factory.getPool(token.address, TOKENS.WLUX.address, 3000);
        if (pairPool === ethers.ZeroAddress) return 0;
        const pairContract = new ethers.Contract(pairPool, [
          'function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16, uint16, uint16, uint8, bool)'
        ], provider);
        const pairSlot0 = await pairContract.slot0();
        const pairSqrt = BigInt(pairSlot0.sqrtPriceX96.toString());
        const decDiff = BigInt(token.decimals - 18);
        // Compute price and adjust for decimals
        let rawPrice = Number(pairSqrt * pairSqrt) / Number(2n**192n);
        if (decDiff !== 0n) rawPrice *= Math.pow(10, Number(decDiff));
        // Determine if token is token0 or token1
        const tokenLower = token.address.toLowerCase() < TOKENS.WLUX.address.toLowerCase();
        const priceInWLUX = tokenLower ? rawPrice : (rawPrice > 0 ? 1 / rawPrice : 0);
        return priceInWLUX * luxPrice;
      } catch {
        return 0;
      }
    });

    res.json({ symbol: req.params.symbol.toUpperCase(), priceUSD: price, timestamp: Date.now() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Token day data from subgraph
app.get('/api/token/:address/history', async (req, res) => {
  try {
    const { address } = req.params;
    const { days = 30 } = req.query;
    const data = await cached(`history:${address}:${days}`, 60000, () =>
      querySubgraph(SUBGRAPH_V3_URL, `{
        tokenDayDatas(first: ${Number(days)}, orderBy: date, orderDirection: desc, where: { token: "${address.toLowerCase()}" }) {
          date
          priceUSD
          volumeUSD
          totalValueLockedUSD
          open high low close
        }
      }`)
    );
    res.json(data.tokenDayDatas || []);
  } catch (error) {
    res.status(503).json({ error: 'Subgraph syncing' });
  }
});

// Portfolio — query on-chain balances
app.get('/api/portfolio/:address', async (req, res) => {
  try {
    const { address } = req.params;
    if (!provider) return res.status(503).json({ error: 'No RPC provider' });

    const erc20ABI = ['function balanceOf(address) view returns (uint256)'];
    const balances = await Promise.all(
      Object.values(TOKENS).map(async (t) => {
        try {
          const contract = new ethers.Contract(t.address, erc20ABI, provider);
          const bal = await contract.balanceOf(address);
          return { ...t, balance: ethers.formatUnits(bal, t.decimals) };
        } catch { return { ...t, balance: '0' }; }
      })
    );

    // Also get native LUX balance
    const nativeBal = await provider.getBalance(address);
    balances.unshift({ address: '0x0000000000000000000000000000000000000000', symbol: 'LUX', name: 'Lux', decimals: 18, balance: ethers.formatEther(nativeBal) });

    res.json({ address, tokens: balances.filter(b => b.balance !== '0') });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lux V3 subgraph proxy
app.post('/subgraph/v3', async (req, res) => {
  try {
    const data = await querySubgraph(SUBGRAPH_V3_URL, req.body.query, req.body.variables);
    res.json({ data });
  } catch (error) {
    res.status(502).json({ errors: [{ message: error.message }] });
  }
});

// Lux V2 subgraph proxy
app.post('/subgraph/v2', async (req, res) => {
  try {
    const data = await querySubgraph(SUBGRAPH_V2_URL, req.body.query, req.body.variables);
    res.json({ data });
  } catch (error) {
    res.status(502).json({ errors: [{ message: error.message }] });
  }
});

// Zoo V3 subgraph proxy
app.post('/subgraph/zoo/v3', async (req, res) => {
  try {
    const data = await querySubgraph(ZOO_SUBGRAPH_V3_URL, req.body.query, req.body.variables);
    res.json({ data });
  } catch (error) {
    res.status(502).json({ errors: [{ message: error.message }] });
  }
});

// Zoo V2 subgraph proxy
app.post('/subgraph/zoo/v2', async (req, res) => {
  try {
    const data = await querySubgraph(SUBGRAPH_ZOO_V2_URL, req.body.query, req.body.variables);
    res.json({ data });
  } catch (error) {
    res.status(502).json({ errors: [{ message: error.message }] });
  }
});

// Pars V2 subgraph proxy
app.post('/subgraph/pars/v2', async (req, res) => {
  try {
    const data = await querySubgraph(SUBGRAPH_PARS_V2_URL, req.body.query, req.body.variables);
    res.json({ data });
  } catch (error) {
    res.status(502).json({ errors: [{ message: error.message }] });
  }
});

// Hanzo V2 subgraph proxy
app.post('/subgraph/hanzo/v2', async (req, res) => {
  try {
    const data = await querySubgraph(SUBGRAPH_HANZO_V2_URL, req.body.query, req.body.variables);
    res.json({ data });
  } catch (error) {
    res.status(502).json({ errors: [{ message: error.message }] });
  }
});

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`Exchange API running on port ${PORT}`);
  console.log(`  RPC: ${RPC_URL}`);
  console.log(`  Lux V2 Subgraph: ${SUBGRAPH_V2_URL}`);
  console.log(`  Lux V3 Subgraph: ${SUBGRAPH_V3_URL}`);
  console.log(`  Zoo V3 Subgraph: ${ZOO_SUBGRAPH_V3_URL}`);
  console.log(`  Zoo V2 Subgraph: ${SUBGRAPH_ZOO_V2_URL}`);
  console.log(`  Pars V2 Subgraph: ${SUBGRAPH_PARS_V2_URL}`);
  console.log(`  Hanzo V2 Subgraph: ${SUBGRAPH_HANZO_V2_URL}`);
});
