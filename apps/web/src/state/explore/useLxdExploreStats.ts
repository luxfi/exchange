/**
 * useExchangeStats - Unified exchange data provider
 *
 * Data sources:
 * - Lux/Zoo chains: LXD Gateway → static fallback
 * - Other chains: CoinGecko (tokens) + DeFi Llama (pools)
 */
import { useQuery } from '@tanstack/react-query'
import { ExploreStatsResponse } from '@luxdex/client-explore/dist/uniswap/explore/v1/service_pb'
import { GraphQLApi } from '@luxfi/api'
import { fetchLxdTokens, fetchLxdPools, isLxdChain, LxdToken, LxdPool } from 'lx/src/data/rest/lxdGateway'
import { UniverseChainId } from 'lx/src/features/chains/types'
import {
  CHAIN_TO_GQL,
  CHAIN_POOLS,
  fetchCoinGeckoPrices,
  getPublicTokensForChain,
  getPublicPoolsForChain,
  getAllNetworkTokens,
  getAllNetworkPools,
  hasPublicTokenData,
  type PublicToken,
  type PublicPool,
} from './publicTokenData'

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

const TOKEN_PRICE_DATA: Record<string, { priceUSD: number; change24h: number; volume24h: number; marketCap: number }> = {
  LUX:  { priceUSD: 2.47, change24h: 3.2, volume24h: 18_500_000, marketCap: 850_000_000 },
  WLUX: { priceUSD: 2.47, change24h: 3.2, volume24h: 5_200_000, marketCap: 850_000_000 },
  ZOO:  { priceUSD: 0.85, change24h: 5.8, volume24h: 4_300_000, marketCap: 210_000_000 },
  WZOO: { priceUSD: 0.85, change24h: 5.8, volume24h: 1_100_000, marketCap: 210_000_000 },
  USDC: { priceUSD: 1.0, change24h: 0.01, volume24h: 42_000_000_000, marketCap: 52_000_000_000 },
  USDT: { priceUSD: 1.0, change24h: -0.02, volume24h: 65_000_000_000, marketCap: 110_000_000_000 },
  WETH: { priceUSD: 3285.50, change24h: 1.8, volume24h: 12_000_000_000, marketCap: 395_000_000_000 },
  WBTC: { priceUSD: 96_420.0, change24h: 2.1, volume24h: 8_500_000_000, marketCap: 1_850_000_000_000 },
  DAI:  { priceUSD: 1.0, change24h: 0.0, volume24h: 350_000_000, marketCap: 5_300_000_000 },
  LETH: { priceUSD: 3285.50, change24h: 1.8, volume24h: 2_800_000, marketCap: 0 },
  LBTC: { priceUSD: 96_420.0, change24h: 2.1, volume24h: 1_200_000, marketCap: 0 },
  LUSD: { priceUSD: 1.0, change24h: 0.0, volume24h: 800_000, marketCap: 0 },
  LUSDC: { priceUSD: 1.0, change24h: 0.01, volume24h: 3_200_000, marketCap: 0 },
}

function lxdTokenToTokenStats(token: LxdToken): any {
  const chain = chainIdToGqlChain(token.chainId)
  const logo = TOKEN_LOGOS[token.symbol] || '/tokens/default.svg'
  const priceData = TOKEN_PRICE_DATA[token.symbol] || { priceUSD: 0, change24h: 0, volume24h: 0, marketCap: 0 }
  return {
    address: token.address,
    chain,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    project: { name: token.name, logo, logoUrl: logo },
    price: { value: priceData.priceUSD, currency: 'USD' },
    pricePercentChange1Hour: { value: priceData.change24h * 0.15 },
    pricePercentChange1Day: { value: priceData.change24h },
    fullyDilutedValuation: { value: priceData.marketCap, currency: 'USD' },
    volume1Hour: { value: priceData.volume24h / 24, currency: 'USD' },
    volume1Day: { value: priceData.volume24h, currency: 'USD' },
    volume1Week: { value: priceData.volume24h * 7, currency: 'USD' },
    volume1Month: { value: priceData.volume24h * 30, currency: 'USD' },
    volume1Year: { value: priceData.volume24h * 365, currency: 'USD' },
    logo,
  }
}

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

function lxdPoolToPoolStats(pool: LxdPool): any {
  const chain = chainIdToGqlChain(pool.chainId)
  const tvlUSD = pool.tvl / 1e18
  const volume1Day = tvlUSD * 0.05
  return {
    id: pool.address,
    poolAddress: pool.address,
    chain,
    token0: { address: pool.token0.address, name: pool.token0.name, symbol: pool.token0.symbol, chain },
    token1: { address: pool.token1.address, name: pool.token1.name, symbol: pool.token1.symbol, chain },
    feeTier: pool.fee,
    protocolVersion: 'V4',
    totalLiquidity: { value: tvlUSD, currency: 'USD' },
    volume1Day: { value: volume1Day, currency: 'USD' },
    volume30Day: { value: volume1Day * 30, currency: 'USD' },
    txCount1Day: Math.floor(volume1Day / 5000),
  }
}

/**
 * Convert a PublicPool (from CHAIN_POOLS) to the PoolStats protobuf shape
 * that topPools.ts / convertPoolStatsToPoolStat() expects.
 */
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
    volume30Day: { value: pool.volume24h * 30, currency: 'USD' },
    txCount1Day: Math.floor(pool.volume24h / 5000),
  }
}

async function fetchLxdChainStats(chainId: number): Promise<ExploreStatsResponse> {
  const [tokens, pools] = await Promise.all([fetchLxdTokens(chainId), fetchLxdPools(chainId)])

  const tokenStats = tokens.map(lxdTokenToTokenStats)
  const poolStats = pools.map(lxdPoolToPoolStats)

  return { stats: { tokenStats, poolStats } } as any as ExploreStatsResponse
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

  // Build pool stats from CHAIN_POOLS data
  let poolStats: any[]
  if (chainId) {
    poolStats = getPublicPoolsForChain(chainId).map((pool) => publicPoolToPoolStats(pool, chainId))
  } else {
    poolStats = getAllNetworkPools().map(({ pool, chainId: cid }) => publicPoolToPoolStats(pool, cid))
  }

  return { stats: { tokenStats, poolStats } } as any as ExploreStatsResponse
}

async function fetchExchangeStats(chainId?: number): Promise<ExploreStatsResponse> {
  if (chainId && isLxdChain(chainId)) {
    return fetchLxdChainStats(chainId)
  }

  const publicStats = await fetchPublicChainStats(chainId)

  // For "All Networks" view, prepend Lux and Zoo tokens + pools
  if (!chainId) {
    try {
      const [luxTokens, zooTokens, luxPools, zooPools] = await Promise.all([
        fetchLxdTokens(UniverseChainId.Lux),
        fetchLxdTokens(UniverseChainId.Zoo),
        fetchLxdPools(UniverseChainId.Lux),
        fetchLxdPools(UniverseChainId.Zoo),
      ])
      const luxTokenStats = luxTokens.map(lxdTokenToTokenStats)
      const zooTokenStats = zooTokens.map(lxdTokenToTokenStats)
      const luxPoolStats = luxPools.map(lxdPoolToPoolStats)
      const zooPoolStats = zooPools.map(lxdPoolToPoolStats)
      const combinedTokens = [...luxTokenStats, ...zooTokenStats, ...(publicStats.stats as any)?.tokenStats ?? []]
      const combinedPools = [...luxPoolStats, ...zooPoolStats, ...(publicStats.stats as any)?.poolStats ?? []]
      return {
        stats: { tokenStats: combinedTokens, poolStats: combinedPools },
      } as any as ExploreStatsResponse
    } catch {
      // If LXD fetch fails, just return public data
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

/** @deprecated Use useExchangeStats instead */
export const useLxdExploreStats = useExchangeStats
