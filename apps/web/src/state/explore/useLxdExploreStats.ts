/**
 * Hook to fetch explore stats from LXD Gateway for Lux/Zoo chains
 */
import { useQuery } from '@tanstack/react-query'
import { ExploreStatsResponse, TokenStats, PoolStats } from '@luxdex/client-explore/dist/uniswap/explore/v1/service_pb'
import { GraphQLApi } from '@luxfi/api'
import { fetchLxdTokens, fetchLxdPools, isLxdChain, LxdToken, LxdPool } from 'lx/src/data/rest/lxdGateway'
import { UniverseChainId } from 'lx/src/features/chains/types'

// Convert chain ID to GraphQL chain enum
function chainIdToGqlChain(chainId: number): GraphQLApi.Chain {
  switch (chainId) {
    case UniverseChainId.Lux:
      return 'LUX' as GraphQLApi.Chain  // Custom chain name
    case UniverseChainId.Zoo:
      return 'ZOO' as GraphQLApi.Chain  // Custom chain name
    default:
      return GraphQLApi.Chain.Ethereum
  }
}

// Token logos for known symbols - L* tokens have black icons
const TOKEN_LOGOS: Record<string, string> = {
  // Native tokens
  LUX: '/tokens/lux.svg',
  WLUX: '/tokens/wlux.svg',
  ZOO: '/tokens/zoo.svg',
  WZOO: '/tokens/wzoo.svg',
  // Common tokens
  USDC: '/tokens/usdc.svg',
  USDT: '/tokens/usdt.svg',
  WETH: '/tokens/weth.svg',
  WBTC: '/tokens/wbtc.svg',
  DAI: '/tokens/dai.svg',
  ETH: '/tokens/eth.svg',
  // L* bridged tokens (black coin icons)
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

// Convert LXD token to TokenStats-like format
function lxdTokenToTokenStats(token: LxdToken): any {
  const chain = chainIdToGqlChain(token.chainId)
  const logo = TOKEN_LOGOS[token.symbol] || '/tokens/default.svg'
  return {
    address: token.address,
    chain,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    // Project info for display
    project: {
      name: token.name,
      logo,
      logoUrl: logo,
    },
    // Price data - would need real oracle data in production
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

async function fetchLxdExploreStats(chainId: number): Promise<ExploreStatsResponse> {
  const [tokens, pools] = await Promise.all([
    fetchLxdTokens(chainId),
    fetchLxdPools(chainId),
  ])

  // Convert to ExploreStatsResponse format
  const tokenStats = tokens.map(lxdTokenToTokenStats)
  const poolStats = pools.map(lxdPoolToPoolStats)

  // Create a minimal Stats object - cast to any to avoid protobuf type issues
  const stats = {
    tokenStats,
    poolStats,
  }

  // Create the response - ExploreStatsResponse expects stats property
  const response = {
    stats,
  } as any as ExploreStatsResponse

  return response
}

export function useLxdExploreStats(chainId?: number) {
  const isLxd = chainId && isLxdChain(chainId)

  return useQuery({
    queryKey: ['lxd-explore-stats', chainId],
    queryFn: () => fetchLxdExploreStats(chainId!),
    enabled: !!isLxd,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
  })
}
