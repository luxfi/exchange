/**
 * useExchangeStats - Unified exchange data provider
 *
 * Data sources:
 * - Lux/Zoo chains: V3 Subgraph (AMM-derived prices from pool reserves)
 * - Other chains: CoinGecko (tokens) + static pool data
 */
import { useQuery } from '@tanstack/react-query'
import { ExploreStatsResponse } from '@luxamm/client-explore/dist/lx/explore/v1/service_pb'
import { GraphQLApi } from '@luxexchange/api'
import { isLuxChain } from '@luxexchange/lx/src/data/rest/luxGateway'
import { UniverseChainId } from '@luxexchange/lx/src/features/chains/types'
import {
  CHAIN_TO_GQL,
  fetchCoinGeckoPrices,
  getPublicTokensForChain,
  getPublicPoolsForChain,
  getAllNetworkTokens,
  getAllNetworkPools,
  hasPublicTokenData,
  type PublicToken,
  type PublicPool,
} from './publicTokenData'

// V3 subgraph endpoint — served by graph-node, proxied through exchange ingress
const SUBGRAPH_V3_URL =
  process.env.REACT_APP_SUBGRAPH_V3_URL ||
  process.env.NEXT_PUBLIC_SUBGRAPH_V3_URL ||
  'https://api-exchange.lux.network/subgraph/v3'

function chainIdToGqlChain(chainId: number): string {
  return CHAIN_TO_GQL[chainId] ?? GraphQLApi.Chain.Ethereum
}

const TOKEN_LOGOS: Record<string, string> = {
  LUX: '/tokens/lux.svg',
  WLUX: '/tokens/wlux.svg',
  ZOO: '/tokens/zoo.svg',
  WZOO: '/tokens/wzoo.svg',
  USDC: '/tokens/usdc.svg',
  USDT: '/tokens/usdt.svg',
  WETH: '/tokens/weth.svg',
  WBTC: '/tokens/wbtc.svg',
  DAI: '/tokens/dai.svg',
  ETH: '/tokens/eth.svg',
  LETH: '/tokens/leth.svg',
  LBTC: '/tokens/lbtc.svg',
  LUSD: '/tokens/lusd.svg',
  LSOL: '/tokens/lsol.svg',
  LTON: '/tokens/lton.svg',
  LBNB: '/tokens/lbnb.svg',
  LPOL: '/tokens/lpol.svg',
  LCELO: '/tokens/lcelo.svg',
  LFTM: '/tokens/lftm.svg',
  LXDAI: '/tokens/lxdai.svg',
  LBLAST: '/tokens/lblast.svg',
  LAVAX: '/tokens/lavax.svg',
  LZOO: '/tokens/lzoo.svg',
}

// ============================================================================
// Subgraph types
// ============================================================================

interface SubgraphToken {
  id: string
  symbol: string
  name: string
  decimals: string
  totalValueLockedUSD: string
  derivedETH: string
}

interface SubgraphPool {
  id: string
  token0: { id: string; symbol: string }
  token1: { id: string; symbol: string }
  feeTier: string
  totalValueLockedUSD: string
  token0Price: string
  token1Price: string
}

interface SubgraphDayData {
  date: number
  volumeUSD: string
}

interface SubgraphFactory {
  poolCount: string
  txCount: string
  totalVolumeUSD: string
  totalValueLockedUSD: string
}

interface SubgraphData {
  bundle: { ethPriceUSD: string }
  factory: SubgraphFactory | null
  tokens: SubgraphToken[]
  pools: SubgraphPool[]
  tokenVolume24h: Record<string, number> // token id → 24h volume in USD
  poolVolume24h: Record<string, number> // pool id → 24h volume in USD
}

// ============================================================================
// Subgraph query
// ============================================================================

async function fetchSubgraph(chainId: number): Promise<SubgraphData | null> {
  try {
    // Compute the start of the current UTC day for 24h volume lookups
    const now = Math.floor(Date.now() / 1000)
    const dayStart = now - (now % 86400)

    const query = `{
      bundle(id: "1") { ethPriceUSD }
      factories(first: 1) { id poolCount txCount totalVolumeUSD totalValueLockedUSD }
      tokens(first: 50, orderBy: totalValueLockedUSD, orderDirection: desc) {
        id symbol name decimals totalValueLockedUSD derivedETH
      }
      pools(first: 50, orderBy: totalValueLockedUSD, orderDirection: desc) {
        id token0 { id symbol } token1 { id symbol }
        feeTier totalValueLockedUSD token0Price token1Price
      }
      tokenDayDatas(where: { date_gte: ${dayStart - 86400} }, orderBy: date, orderDirection: desc, first: 100) {
        token { id }
        date volumeUSD
      }
      poolDayDatas(where: { date_gte: ${dayStart - 86400} }, orderBy: date, orderDirection: desc, first: 100) {
        pool { id }
        date volumeUSD
      }
    }`

    const response = await fetch(SUBGRAPH_V3_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) throw new Error(`Subgraph ${response.status}`)
    const result = await response.json()
    if (result.errors) {
      console.warn('Subgraph query errors:', result.errors)
      return null
    }
    // Normalize factories array → factory single object
    const raw = result.data

    // Build 24h volume maps from day data (sum entries within last 24h)
    const tokenVolume24h: Record<string, number> = {}
    const poolVolume24h: Record<string, number> = {}
    const cutoff24h = now - 86400

    for (const entry of raw.tokenDayDatas ?? []) {
      if (entry.date >= cutoff24h) {
        const tokenId = entry.token?.id
        if (tokenId) {
          tokenVolume24h[tokenId] = (tokenVolume24h[tokenId] ?? 0) + parseFloat(entry.volumeUSD)
        }
      }
    }
    for (const entry of raw.poolDayDatas ?? []) {
      if (entry.date >= cutoff24h) {
        const poolId = entry.pool?.id
        if (poolId) {
          poolVolume24h[poolId] = (poolVolume24h[poolId] ?? 0) + parseFloat(entry.volumeUSD)
        }
      }
    }

    return {
      bundle: raw.bundle,
      factory: raw.factories?.[0] ?? raw.factory ?? null,
      tokens: raw.tokens ?? [],
      pools: raw.pools ?? [],
      tokenVolume24h,
      poolVolume24h,
    }
  } catch (error) {
    console.warn('Subgraph query failed:', error)
    return null
  }
}

// ============================================================================
// AMM price derivation from pool reserves
// ============================================================================

const STABLECOINS = new Set(['LUSD', 'USDC', 'USDT', 'DAI'])

/**
 * Derive token USD prices from pool data.
 * 1. Stablecoins → $1
 * 2. For each pool (TVL-sorted), propagate known prices to unknown tokens
 * 3. Fallback: derivedETH * ethPriceUSD
 */
function deriveTokenPrices(
  tokens: SubgraphToken[],
  pools: SubgraphPool[],
  ethPriceUSD: number,
): Record<string, number> {
  const priceMap: Record<string, number> = {}

  // Step 1: Stablecoins = $1
  for (const token of tokens) {
    if (STABLECOINS.has(token.symbol)) {
      priceMap[token.id] = 1.0
    }
  }

  // Step 2: Walk pools (sorted by TVL desc) to propagate prices
  // Do 3 passes to handle multi-hop chains (token → WLUX → stablecoin)
  for (let pass = 0; pass < 3; pass++) {
    for (const pool of pools) {
      const t0 = pool.token0.id
      const t1 = pool.token1.id
      const t0Price = parseFloat(pool.token0Price) // token1 per token0
      const t1Price = parseFloat(pool.token1Price) // token0 per token1

      if (priceMap[t1] !== undefined && priceMap[t0] === undefined && t0Price > 0) {
        // token0 price = (token1 per token0) * token1 USD price
        priceMap[t0] = t0Price * priceMap[t1]
      }
      if (priceMap[t0] !== undefined && priceMap[t1] === undefined && t1Price > 0) {
        // token1 price = (token0 per token1) * token0 USD price
        priceMap[t1] = t1Price * priceMap[t0]
      }
    }
  }

  // Step 3: Fallback to derivedETH * ethPriceUSD for any remaining tokens
  for (const token of tokens) {
    if (priceMap[token.id] === undefined) {
      const derivedETH = parseFloat(token.derivedETH)
      if (derivedETH > 0 && ethPriceUSD > 0) {
        priceMap[token.id] = derivedETH * ethPriceUSD
      } else {
        priceMap[token.id] = 0
      }
    }
  }

  return priceMap
}

// ============================================================================
// Convert subgraph data → Explore page format
// ============================================================================

function subgraphTokenToTokenStats(
  token: SubgraphToken,
  chainId: number,
  priceUSD: number,
  volume24h: number,
): any {
  const chain = chainIdToGqlChain(chainId)
  const logo = TOKEN_LOGOS[token.symbol] || '/tokens/default.svg'

  return {
    address: token.id,
    chain,
    name: token.name,
    symbol: token.symbol,
    decimals: parseInt(token.decimals),
    project: { name: token.name, logo, logoUrl: logo },
    price: { value: priceUSD, currency: 'USD' },
    pricePercentChange1Hour: { value: 0 },
    pricePercentChange1Day: { value: 0 },
    fullyDilutedValuation: { value: 0, currency: 'USD' },
    volume1Hour: { value: 0, currency: 'USD' },
    volume1Day: { value: volume24h, currency: 'USD' },
    volume1Week: { value: 0, currency: 'USD' },
    volume1Month: { value: 0, currency: 'USD' },
    volume1Year: { value: 0, currency: 'USD' },
    totalValueLocked: { value: parseFloat(token.totalValueLockedUSD), currency: 'USD' },
    logo,
  }
}

function subgraphPoolToPoolStats(pool: SubgraphPool, chainId: number, volume24h: number): any {
  const chain = chainIdToGqlChain(chainId)
  return {
    id: pool.id,
    poolAddress: pool.id,
    chain,
    token0: { address: pool.token0.id, name: pool.token0.symbol, symbol: pool.token0.symbol, chain },
    token1: { address: pool.token1.id, name: pool.token1.symbol, symbol: pool.token1.symbol, chain },
    feeTier: parseInt(pool.feeTier),
    protocolVersion: 'V3',
    totalLiquidity: { value: parseFloat(pool.totalValueLockedUSD), currency: 'USD' },
    volume1Day: { value: volume24h, currency: 'USD' },
    volume30Day: { value: 0, currency: 'USD' },
    txCount1Day: 0,
  }
}

// ============================================================================
// Lux/Zoo chain stats from subgraph
// ============================================================================

async function fetchLuxChainStats(chainId: number): Promise<ExploreStatsResponse> {
  // Fetch subgraph data and CoinGecko prices in parallel
  const [data, coinGeckoPrices] = await Promise.all([
    fetchSubgraph(chainId),
    fetchCoinGeckoPrices(),
  ])

  // Build a lookup from static token data (address → PublicToken)
  const staticTokens = await getPublicTokensForChain(chainId)
  const staticByAddress: Record<string, PublicToken> = {}
  for (const t of staticTokens) {
    staticByAddress[t.address.toLowerCase()] = t
  }

  const ethPriceUSD = data ? parseFloat(data.bundle.ethPriceUSD) : 0
  const hasSubgraphPrices = ethPriceUSD > 0

  // Derive prices: prefer subgraph AMM prices, fall back to CoinGecko
  const priceMap: Record<string, number> = {}
  if (data && hasSubgraphPrices) {
    Object.assign(priceMap, deriveTokenPrices(data.tokens, data.pools, ethPriceUSD))
  }

  // Enrich with CoinGecko prices for any token still at $0
  for (const [addr, staticToken] of Object.entries(staticByAddress)) {
    if (!priceMap[addr] || priceMap[addr] === 0) {
      const cgPrice = coinGeckoPrices[staticToken.coingeckoId]
      if (cgPrice?.usd) {
        priceMap[addr] = cgPrice.usd
      }
    }
  }

  // Build token stats — merge subgraph tokens with static token data
  const chain = chainIdToGqlChain(chainId)

  // Start with static tokens (guaranteed names/symbols/logos)
  const seenAddresses = new Set<string>()
  const tokenStats: any[] = []

  for (const staticToken of staticTokens) {
    const addr = staticToken.address.toLowerCase()
    seenAddresses.add(addr)
    const price = priceMap[addr] ?? 0
    const cgData = coinGeckoPrices[staticToken.coingeckoId]
    const volume24h = data?.tokenVolume24h[addr] ?? cgData?.usd_24h_vol ?? 0
    const change24h = cgData?.usd_24h_change ?? 0
    const marketCap = cgData?.usd_market_cap ?? 0

    // Find matching subgraph token for TVL
    const subToken = data?.tokens.find((t) => t.id.toLowerCase() === addr)
    const tvl = subToken ? parseFloat(subToken.totalValueLockedUSD) : 0

    const logo = TOKEN_LOGOS[staticToken.symbol] || staticToken.logoUrl

    tokenStats.push({
      address: staticToken.address,
      chain,
      name: staticToken.name,
      symbol: staticToken.symbol,
      decimals: staticToken.decimals,
      project: { name: staticToken.name, logo, logoUrl: logo },
      price: { value: price, currency: 'USD' },
      pricePercentChange1Hour: { value: 0 },
      pricePercentChange1Day: { value: change24h },
      fullyDilutedValuation: { value: marketCap, currency: 'USD' },
      volume1Hour: { value: 0, currency: 'USD' },
      volume1Day: { value: volume24h, currency: 'USD' },
      volume1Week: { value: 0, currency: 'USD' },
      volume1Month: { value: 0, currency: 'USD' },
      volume1Year: { value: 0, currency: 'USD' },
      totalValueLocked: { value: tvl, currency: 'USD' },
      logo,
    })
  }

  // Add any subgraph tokens not in static list (with subgraph names)
  if (data) {
    for (const t of data.tokens) {
      if (!seenAddresses.has(t.id.toLowerCase())) {
        const price = priceMap[t.id] ?? 0
        const volume24h = data.tokenVolume24h[t.id] ?? 0
        // Skip tokens with no price, no name, and truncated hex symbols
        if (price === 0 && t.symbol.startsWith('0x')) continue
        tokenStats.push(
          subgraphTokenToTokenStats(t, chainId, price, volume24h),
        )
      }
    }
  }

  // Build pool stats — use subgraph pool data with enriched token names
  const poolStats: any[] = []
  if (data) {
    for (const pool of data.pools) {
      const volume24h = data.poolVolume24h[pool.id] ?? 0
      // Enrich token symbols from static data
      const t0Static = staticByAddress[pool.token0.id.toLowerCase()]
      const t1Static = staticByAddress[pool.token1.id.toLowerCase()]
      const enrichedPool = {
        ...pool,
        token0: { id: pool.token0.id, symbol: t0Static?.symbol ?? pool.token0.symbol },
        token1: { id: pool.token1.id, symbol: t1Static?.symbol ?? pool.token1.symbol },
      }
      poolStats.push(subgraphPoolToPoolStats(enrichedPool, chainId, volume24h))
    }
  }

  // Factory stats
  const factoryStats = data?.factory
    ? {
        poolCount: parseInt(data.factory.poolCount),
        txCount: parseInt(data.factory.txCount),
        totalValueLockedUSD: parseFloat(data.factory.totalValueLockedUSD),
      }
    : null

  return { stats: { tokenStats, poolStats, factoryStats } } as any as ExploreStatsResponse
}

// ============================================================================
// Non-Lux chains (CoinGecko + static pool data)
// ============================================================================

function publicTokenToTokenStats(
  token: PublicToken,
  chainId: number,
  priceData?: { usd: number; usd_24h_change?: number; usd_24h_vol?: number; usd_market_cap?: number },
): any {
  const chain = chainIdToGqlChain(chainId)
  const price = priceData?.usd ?? 0
  const change24h = priceData?.usd_24h_change ?? 0
  const volume24h = priceData?.usd_24h_vol ?? 0
  const marketCap = priceData?.usd_market_cap ?? 0

  return {
    address: token.address,
    chain,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    project: { name: token.name, logo: token.logoUrl, logoUrl: token.logoUrl },
    price: { value: price, currency: 'USD' },
    pricePercentChange1Hour: { value: 0 },
    pricePercentChange1Day: { value: change24h },
    fullyDilutedValuation: { value: marketCap, currency: 'USD' },
    volume1Hour: { value: 0, currency: 'USD' },
    volume1Day: { value: volume24h, currency: 'USD' },
    volume1Week: { value: 0, currency: 'USD' },
    volume1Month: { value: 0, currency: 'USD' },
    volume1Year: { value: 0, currency: 'USD' },
    logo: token.logoUrl,
  }
}

function publicPoolToPoolStats(pool: PublicPool, chainId: number): any {
  const chain = chainIdToGqlChain(chainId)
  return {
    id: pool.address,
    poolAddress: pool.address,
    chain,
    token0: { address: pool.token0.address, name: pool.token0.name, symbol: pool.token0.symbol, chain },
    token1: { address: pool.token1.address, name: pool.token1.name, symbol: pool.token1.symbol, chain },
    feeTier: pool.feeTier,
    protocolVersion: pool.protocolVersion,
    totalLiquidity: { value: pool.tvl, currency: 'USD' },
    volume1Day: { value: pool.volume24h, currency: 'USD' },
    volume30Day: { value: 0, currency: 'USD' },
    txCount1Day: 0,
  }
}

async function fetchPublicChainStats(chainId?: number): Promise<ExploreStatsResponse> {
  const tokens = chainId && hasPublicTokenData(chainId) ? await getPublicTokensForChain(chainId) : getAllNetworkTokens()
  const prices = await fetchCoinGeckoPrices()
  const effectiveChainId = chainId ?? UniverseChainId.Mainnet

  const tokenStats = tokens.map((token) => {
    const priceData = prices[token.coingeckoId]
    return publicTokenToTokenStats(token, effectiveChainId, priceData)
  })
  tokenStats.sort((a: any, b: any) => (b.fullyDilutedValuation?.value ?? 0) - (a.fullyDilutedValuation?.value ?? 0))

  let poolStats: any[]
  if (chainId) {
    poolStats = getPublicPoolsForChain(chainId).map((pool) => publicPoolToPoolStats(pool, chainId))
  } else {
    poolStats = getAllNetworkPools().map(({ pool, chainId: cid }) => publicPoolToPoolStats(pool, cid))
  }

  return { stats: { tokenStats, poolStats } } as any as ExploreStatsResponse
}

// ============================================================================
// Main entry point
// ============================================================================

async function fetchExchangeStats(chainId?: number): Promise<ExploreStatsResponse> {
  if (chainId && isLuxChain(chainId)) {
    return fetchLuxChainStats(chainId)
  }

  const publicStats = await fetchPublicChainStats(chainId)

  // For "All Networks" view, prepend Lux and Zoo data (with CoinGecko fallback)
  if (!chainId) {
    try {
      const [luxStats, zooStats] = await Promise.all([
        fetchLuxChainStats(UniverseChainId.Lux),
        fetchLuxChainStats(UniverseChainId.Zoo),
      ])

      const luxTokens = (luxStats.stats as any)?.tokenStats ?? []
      const luxPools = (luxStats.stats as any)?.poolStats ?? []
      const zooTokens = (zooStats.stats as any)?.tokenStats ?? []
      const zooPools = (zooStats.stats as any)?.poolStats ?? []
      const luxFactory = (luxStats.stats as any)?.factoryStats
      const zooFactory = (zooStats.stats as any)?.factoryStats

      const combinedTokens = [...luxTokens, ...zooTokens, ...(publicStats.stats as any)?.tokenStats ?? []]
      const combinedPools = [...luxPools, ...zooPools, ...(publicStats.stats as any)?.poolStats ?? []]

      const factoryStats = (luxFactory || zooFactory)
        ? {
            poolCount: (luxFactory?.poolCount ?? 0) + (zooFactory?.poolCount ?? 0),
            txCount: (luxFactory?.txCount ?? 0) + (zooFactory?.txCount ?? 0),
            totalValueLockedUSD: (luxFactory?.totalValueLockedUSD ?? 0) + (zooFactory?.totalValueLockedUSD ?? 0),
          }
        : null

      return {
        stats: { tokenStats: combinedTokens, poolStats: combinedPools, factoryStats },
      } as any as ExploreStatsResponse
    } catch {
      // If Lux chain fetch fails, return public data only
    }
  }

  return publicStats
}

export function useExchangeStats(chainId?: number) {
  return useQuery({
    queryKey: ['exchange-stats', chainId ?? 'all'],
    queryFn: () => fetchExchangeStats(chainId),
    staleTime: 30000,
    refetchInterval: 60000,
  })
}

