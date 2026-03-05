/**
 * Hook to fetch explore stats for all chains
 * - Lux/Zoo chains: G-Chain → LXD Gateway → static fallback
 * - Other chains: CoinGecko free API → static fallback
 */
import { useQuery } from '@tanstack/react-query'
import { ExploreStatsResponse } from '@luxdex/client-explore/dist/uniswap/explore/v1/service_pb'
import { GraphQLApi } from '@luxfi/api'
import { fetchLxdTokens, fetchLxdPools, isLxdChain, LxdToken, LxdPool } from 'lx/src/data/rest/lxdGateway'
import { UniverseChainId } from 'lx/src/features/chains/types'
import {
  CHAIN_TO_GQL,
  fetchCoinGeckoPrices,
  getPublicTokensForChain,
  getAllNetworkTokens,
  hasPublicTokenData,
  type PublicToken,
} from './publicTokenData'

// Convert chain ID to GraphQL chain enum
function chainIdToGqlChain(chainId: number): string {
  return CHAIN_TO_GQL[chainId] ?? GraphQLApi.Chain.Ethereum
}

// Token logos for known Lux/Zoo symbols
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

// Convert LXD token to TokenStats-like format (for Lux/Zoo chains)
function lxdTokenToTokenStats(token: LxdToken): any {
  const chain = chainIdToGqlChain(token.chainId)
  const logo = TOKEN_LOGOS[token.symbol] || '/tokens/default.svg'
  return {
    address: token.address,
    chain,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    project: {
      name: token.name,
      logo,
      logoUrl: logo,
    },
    price: { value: token.symbol === 'LUX' ? 1.0 : token.symbol === 'ZOO' ? 0.5 : 0, currency: 'USD' },
    pricePercentChange1Hour: { value: 0 },
    pricePercentChange1Day: { value: 0 },
    fullyDilutedValuation: { value: 0, currency: 'USD' },
    volume1Hour: { value: 0, currency: 'USD' },
    volume1Day: { value: 0, currency: 'USD' },
    volume1Week: { value: 0, currency: 'USD' },
    volume1Month: { value: 0, currency: 'USD' },
    volume1Year: { value: 0, currency: 'USD' },
    logo,
  }
}

// Convert public token + CoinGecko price data to TokenStats format (for non-Lux chains)
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
    project: {
      name: token.name,
      logo: token.logoUrl,
      logoUrl: token.logoUrl,
    },
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

// Convert LXD pool to PoolStats-like format
function lxdPoolToPoolStats(pool: LxdPool): any {
  const chain = chainIdToGqlChain(pool.chainId)
  return {
    poolAddress: pool.address,
    chain,
    token0: pool.token0.address,
    token0Name: pool.token0.name,
    token0Symbol: pool.token0.symbol,
    token1: pool.token1.address,
    token1Name: pool.token1.name,
    token1Symbol: pool.token1.symbol,
    feeTier: pool.fee,
    protocolVersion: 'V4',
    tvl: { value: pool.tvl / 1e18, currency: 'USD' },
    volume1Day: { value: 0, currency: 'USD' },
    txCount1Day: 0,
  }
}

/**
 * Fetch explore stats for Lux/Zoo chains (existing path)
 */
async function fetchLxdChainStats(chainId: number): Promise<ExploreStatsResponse> {
  const [tokens, pools] = await Promise.all([fetchLxdTokens(chainId), fetchLxdPools(chainId)])

  const tokenStats = tokens.map(lxdTokenToTokenStats)
  const poolStats = pools.map(lxdPoolToPoolStats)

  return {
    stats: { tokenStats, poolStats },
  } as any as ExploreStatsResponse
}

/**
 * Fetch explore stats for public chains using CoinGecko
 */
async function fetchPublicChainStats(chainId?: number): Promise<ExploreStatsResponse> {
  // Get tokens for the chain (or all networks)
  const tokens = chainId && hasPublicTokenData(chainId) ? await getPublicTokensForChain(chainId) : getAllNetworkTokens()

  // Fetch live prices from CoinGecko
  const prices = await fetchCoinGeckoPrices()

  // Convert to TokenStats format with live prices
  const effectiveChainId = chainId ?? UniverseChainId.Mainnet
  const tokenStats = tokens.map((token) => {
    const priceData = prices[token.coingeckoId]
    return publicTokenToTokenStats(token, effectiveChainId, priceData)
  })

  // Sort by market cap (FDV) descending
  tokenStats.sort((a: any, b: any) => (b.fullyDilutedValuation?.value ?? 0) - (a.fullyDilutedValuation?.value ?? 0))

  return {
    stats: { tokenStats, poolStats: [] },
  } as any as ExploreStatsResponse
}

/**
 * Fetch explore stats — routes to LXD or CoinGecko based on chain
 * For "All Networks" (no chainId), merges Lux tokens with public chain tokens
 */
async function fetchExploreStats(chainId?: number): Promise<ExploreStatsResponse> {
  if (chainId && isLxdChain(chainId)) {
    return fetchLxdChainStats(chainId)
  }

  const publicStats = await fetchPublicChainStats(chainId)

  // For "All Networks" view, prepend Lux and Zoo tokens
  if (!chainId) {
    try {
      const [luxTokens, zooTokens] = await Promise.all([fetchLxdTokens(UniverseChainId.Lux), fetchLxdTokens(UniverseChainId.Zoo)])
      const luxStats = luxTokens.map(lxdTokenToTokenStats)
      const zooStats = zooTokens.map(lxdTokenToTokenStats)
      const combined = [...luxStats, ...zooStats, ...(publicStats.stats as any)?.tokenStats ?? []]
      return {
        stats: { tokenStats: combined, poolStats: (publicStats.stats as any)?.poolStats ?? [] },
      } as any as ExploreStatsResponse
    } catch {
      // If LXD fetch fails, just return public data
    }
  }

  return publicStats
}

export function useLxdExploreStats(chainId?: number) {
  return useQuery({
    queryKey: ['explore-stats', chainId ?? 'all'],
    queryFn: () => fetchExploreStats(chainId),
    staleTime: 30000,
    refetchInterval: 60000,
  })
}
