const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { ethers } = require('ethers');

// F3: Fail fast if required subgraph env vars are not set
const REQUIRED_ENV = [
  'SUBGRAPH_V3_URL',
  'ZOO_SUBGRAPH_V3_URL',
];

// Accept SUBGRAPH_URL or SUBGRAPH_V2_URL for V2
const SUBGRAPH_V2_URL = process.env.SUBGRAPH_URL || process.env.SUBGRAPH_V2_URL;
const SUBGRAPH_V3_URL = process.env.SUBGRAPH_V3_URL;
const ZOO_SUBGRAPH_V3_URL = process.env.ZOO_SUBGRAPH_V3_URL;
const SUBGRAPH_ZOO_V2_URL = process.env.SUBGRAPH_ZOO_V2_URL;
const SUBGRAPH_PARS_V2_URL = process.env.SUBGRAPH_PARS_V2_URL;
const SUBGRAPH_HANZO_V2_URL = process.env.SUBGRAPH_HANZO_V2_URL;

for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`FATAL: missing required env var ${key}`);
    process.exit(1);
  }
}

// Configuration from environment
const RPC_URL = process.env.RPC_URL || 'https://api.lux.network/ext/bc/C/rpc';
const BLOCKSCOUT_API = process.env.BLOCKSCOUT_API || 'https://api-explore.lux.network';

const app = express();
app.set('trust proxy', 1);

// F2: Restrict CORS to known origins
const ALLOWED_ORIGINS = [
  'https://lux.exchange',
  'https://zoo.exchange',
  /^https:\/\/[a-z0-9-]+\.lux\.(exchange|network)$/,
  /^https:\/\/[a-z0-9-]+\.zoo\.(exchange|network|ngo)$/,
  /^https:\/\/[a-z0-9-]+\.liquidity\.io$/,
];
// Allow localhost in development only
if (process.env.NODE_ENV !== 'production') {
  ALLOWED_ORIGINS.push(/^http:\/\/localhost:\d+$/);
}
app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Source'],
  maxAge: 86400,
}));

// F4: Security headers and rate limiting
app.use(helmet({
  contentSecurityPolicy: false, // CSP is managed via meta tag in the SPA
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  frameguard: { action: 'deny' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));
app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,   // Return X-RateLimit-* headers
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
  handler: (req, res) => {
    res.status(429).json({ error: 'Too many requests, please try again later.' });
  },
});
app.use(limiter);

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
      res.status(503).json({ error: 'Subgraphs unavailable' });
    }
  }
});

// F1: Swaps — use GraphQL variables, not string interpolation
app.get('/api/trades', async (req, res) => {
  try {
    const { pool, limit = 50 } = req.query;
    const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 1000);
    const variables = { limit: safeLimit };

    // Use separate queries for filtered vs unfiltered to keep GraphQL variables clean
    let query;
    if (pool) {
      variables.pool = String(pool);
      query = `
        query GetSwaps($limit: Int!, $pool: String!) {
          swaps(first: $limit, orderBy: timestamp, orderDirection: desc, where: { pool: $pool }) {
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
        }
      `;
    } else {
      query = `
        query GetSwaps($limit: Int!) {
          swaps(first: $limit, orderBy: timestamp, orderDirection: desc) {
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
        }
      `;
    }

    const data = await cached(`trades:${pool}:${safeLimit}`, 15000, () =>
      querySubgraph(SUBGRAPH_V3_URL, query, variables)
    );
    res.json({ trades: data.swaps || [] });
  } catch (error) {
    res.status(503).json({ error: 'Subgraph unavailable' });
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
    res.status(500).json({ error: 'Price lookup failed' });
  }
});

// F1: Token day data — use GraphQL variables, not string interpolation
app.get('/api/token/:address/history', async (req, res) => {
  try {
    const { address } = req.params;
    // Validate token address format
    if (!address || !/^0x[0-9a-fA-F]{40}$/.test(address)) {
      return res.status(400).json({ error: 'Invalid token address' });
    }
    const { days = 30 } = req.query;
    const safeDays = Math.min(Math.max(Number(days) || 30, 1), 365);
    const safeAddress = String(address).toLowerCase();

    const data = await cached(`history:${safeAddress}:${safeDays}`, 60000, () =>
      querySubgraph(SUBGRAPH_V3_URL, `
        query GetTokenHistory($days: Int!, $token: String!) {
          tokenDayDatas(first: $days, orderBy: date, orderDirection: desc, where: { token: $token }) {
            date
            priceUSD
            volumeUSD
            totalValueLockedUSD
            open high low close
          }
        }
      `, { days: safeDays, token: safeAddress })
    );
    res.json(data.tokenDayDatas || []);
  } catch (error) {
    res.status(503).json({ error: 'Subgraph unavailable' });
  }
});

// Portfolio — query on-chain balances
app.get('/api/portfolio/:address', async (req, res) => {
  try {
    const { address } = req.params;
    // Validate Ethereum address format
    if (!address || !/^0x[0-9a-fA-F]{40}$/.test(address)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }
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
    res.status(500).json({ error: 'Portfolio lookup failed' });
  }
});

// Subgraph query validation: reject excessively deep or large queries
function validateSubgraphQuery(query) {
  if (!query || typeof query !== 'string') return 'Query must be a non-empty string';
  if (query.length > 10000) return 'Query too large (max 10000 chars)';
  // Count nesting depth by tracking braces
  let depth = 0, maxDepth = 0;
  for (const ch of query) {
    if (ch === '{') { depth++; maxDepth = Math.max(maxDepth, depth); }
    else if (ch === '}') { depth--; }
  }
  if (maxDepth > 10) return 'Query nesting too deep (max 10 levels)';
  // Block introspection queries (information disclosure)
  if (/__schema|__type/i.test(query)) return 'Introspection queries are not allowed';

  // Alias bomb protection: max 5 top-level aliases (pattern: word colon at depth 1)
  let aliasDepth = 0, aliasCount = 0;
  for (let i = 0; i < query.length; i++) {
    if (query[i] === '{') aliasDepth++;
    else if (query[i] === '}') aliasDepth--;
    else if (aliasDepth === 1 && query[i] === ':' && i > 0) {
      // Check that the character before colon is a word char (alias pattern: `name:`)
      const before = query.substring(0, i).trimEnd();
      if (/\w$/.test(before)) aliasCount++;
    }
  }
  if (aliasCount > 5) return 'Too many top-level aliases (max 5)';

  // Reject first argument values > 100
  const firstMatches = query.matchAll(/first\s*:\s*(\d+)/g);
  for (const m of firstMatches) {
    if (Number(m[1]) > 100) return 'first argument too large (max 100)';
  }

  // Max 50 total field selections (count word tokens that are not GraphQL keywords)
  const GRAPHQL_KEYWORDS = new Set([
    'query', 'mutation', 'subscription', 'fragment', 'on', 'true', 'false', 'null',
    'first', 'skip', 'where', 'orderBy', 'orderDirection', 'asc', 'desc',
  ]);
  // Strip strings, braces, parens, colons — count remaining identifiers as fields
  const stripped = query.replace(/"[^"]*"/g, '').replace(/[{}(),:!@$]/g, ' ');
  const tokens = stripped.match(/\b[a-zA-Z_]\w*\b/g) || [];
  const fieldCount = tokens.filter(t => !GRAPHQL_KEYWORDS.has(t)).length;
  if (fieldCount > 50) return 'Too many field selections (max 50)';

  return null;
}

// Lux V3 subgraph proxy
app.post('/subgraph/v3', async (req, res) => {
  try {
    const validationError = validateSubgraphQuery(req.body.query);
    if (validationError) return res.status(400).json({ errors: [{ message: validationError }] });
    const data = await querySubgraph(SUBGRAPH_V3_URL, req.body.query, req.body.variables);
    res.json({ data });
  } catch (error) {
    res.status(502).json({ errors: [{ message: 'Subgraph request failed' }] });
  }
});

// Lux V2 subgraph proxy
app.post('/subgraph/v2', async (req, res) => {
  try {
    const validationError = validateSubgraphQuery(req.body.query);
    if (validationError) return res.status(400).json({ errors: [{ message: validationError }] });
    const data = await querySubgraph(SUBGRAPH_V2_URL, req.body.query, req.body.variables);
    res.json({ data });
  } catch (error) {
    res.status(502).json({ errors: [{ message: 'Subgraph request failed' }] });
  }
});

// Zoo V3 subgraph proxy
app.post('/subgraph/zoo/v3', async (req, res) => {
  try {
    const validationError = validateSubgraphQuery(req.body.query);
    if (validationError) return res.status(400).json({ errors: [{ message: validationError }] });
    const data = await querySubgraph(ZOO_SUBGRAPH_V3_URL, req.body.query, req.body.variables);
    res.json({ data });
  } catch (error) {
    res.status(502).json({ errors: [{ message: 'Subgraph request failed' }] });
  }
});

// Zoo V2 subgraph proxy
app.post('/subgraph/zoo/v2', async (req, res) => {
  try {
    const validationError = validateSubgraphQuery(req.body.query);
    if (validationError) return res.status(400).json({ errors: [{ message: validationError }] });
    const data = await querySubgraph(SUBGRAPH_ZOO_V2_URL, req.body.query, req.body.variables);
    res.json({ data });
  } catch (error) {
    res.status(502).json({ errors: [{ message: 'Subgraph request failed' }] });
  }
});

// Pars V2 subgraph proxy
app.post('/subgraph/pars/v2', async (req, res) => {
  try {
    const validationError = validateSubgraphQuery(req.body.query);
    if (validationError) return res.status(400).json({ errors: [{ message: validationError }] });
    const data = await querySubgraph(SUBGRAPH_PARS_V2_URL, req.body.query, req.body.variables);
    res.json({ data });
  } catch (error) {
    res.status(502).json({ errors: [{ message: 'Subgraph request failed' }] });
  }
});

// Hanzo V2 subgraph proxy
app.post('/subgraph/hanzo/v2', async (req, res) => {
  try {
    const validationError = validateSubgraphQuery(req.body.query);
    if (validationError) return res.status(400).json({ errors: [{ message: validationError }] });
    const data = await querySubgraph(SUBGRAPH_HANZO_V2_URL, req.body.query, req.body.variables);
    res.json({ data });
  } catch (error) {
    res.status(502).json({ errors: [{ message: 'Subgraph request failed' }] });
  }
});

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`Exchange API running on port ${PORT}`);
  console.log(`  RPC: ${RPC_URL}`);
  console.log(`  Lux V2 Subgraph: ${SUBGRAPH_V2_URL || '(not configured)'}`);
  console.log(`  Lux V3 Subgraph: ${SUBGRAPH_V3_URL}`);
  console.log(`  Zoo V3 Subgraph: ${ZOO_SUBGRAPH_V3_URL}`);
  console.log(`  Zoo V2 Subgraph: ${SUBGRAPH_ZOO_V2_URL || '(not configured)'}`);
  console.log(`  Pars V2 Subgraph: ${SUBGRAPH_PARS_V2_URL || '(not configured)'}`);
  console.log(`  Hanzo V2 Subgraph: ${SUBGRAPH_HANZO_V2_URL || '(not configured)'}`);
});
