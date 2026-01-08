/**
 * G-Chain React Hooks
 *
 * React Query hooks for accessing G-Chain blockchain data
 * including DEX/AMM data, oracle prices, and positions
 */

import { useQuery } from '@tanstack/react-query'
import {
  // Types
  type GChainAccount,
  type GChainBlock,
  type GChainBundle,
  type GChainChain,
  type GChainChainStats,
  type GChainFactory,
  type GChainInfo,
  type GChainPair,
  type GChainPool,
  type GChainPosition,
  type GChainSwap,
  type GChainTick,
  type GChainToken,
  type GChainTokenDayData,
  type GChainTransaction,
  getAccount,
  getAllChainsStats,
  getBalance,
  getBlock,
  getChainInfo,
  getFactoryStats,
  getLatestBlocks,
  getPair,
  getPool,
  getPoolByTokens,
  getPositions,
  // DEX/AMM functions
  getPriceBundle,
  getSwaps,
  getTicks,
  getToken,
  getTokenPriceHistory,
  getTokenPriceUSD,
  getTopPools,
  getTopTokens,
  getTransaction,
  getTWAP,
} from './client'

const GCHAIN_STALE_TIME = 10_000 // 10 seconds
const GCHAIN_CACHE_TIME = 60_000 // 1 minute

/**
 * Hook to get G-Chain info and connected chains
 */
export function useGChainInfo() {
  return useQuery<{ chainInfo: GChainInfo; chains: GChainChain[] }>({
    queryKey: ['gchain', 'info'],
    queryFn: getChainInfo,
    staleTime: GCHAIN_STALE_TIME,
    gcTime: GCHAIN_CACHE_TIME,
  })
}

/**
 * Hook to get a specific block by hash or height
 */
export function useGChainBlock(hashOrHeight: string | undefined) {
  return useQuery<GChainBlock | null>({
    queryKey: ['gchain', 'block', hashOrHeight],
    queryFn: () => (hashOrHeight ? getBlock(hashOrHeight) : null),
    enabled: !!hashOrHeight,
    staleTime: Infinity, // Blocks are immutable
    gcTime: GCHAIN_CACHE_TIME,
  })
}

/**
 * Hook to get latest blocks
 */
export function useGChainLatestBlocks(limit = 10) {
  return useQuery<GChainBlock[]>({
    queryKey: ['gchain', 'blocks', 'latest', limit],
    queryFn: () => getLatestBlocks(limit),
    staleTime: GCHAIN_STALE_TIME,
    gcTime: GCHAIN_CACHE_TIME,
    refetchInterval: 12_000, // Refetch every 12 seconds (approximate block time)
  })
}

/**
 * Hook to get a transaction by hash
 */
export function useGChainTransaction(hash: string | undefined) {
  return useQuery<GChainTransaction | null>({
    queryKey: ['gchain', 'transaction', hash],
    queryFn: () => (hash ? getTransaction(hash) : null),
    enabled: !!hash,
    staleTime: Infinity, // Transactions are immutable
    gcTime: GCHAIN_CACHE_TIME,
  })
}

/**
 * Hook to get account info by address
 */
export function useGChainAccount(address: string | undefined) {
  return useQuery<GChainAccount>({
    queryKey: ['gchain', 'account', address],
    queryFn: () => getAccount(address!),
    enabled: !!address,
    staleTime: GCHAIN_STALE_TIME,
    gcTime: GCHAIN_CACHE_TIME,
  })
}

/**
 * Hook to get balance by address
 */
export function useGChainBalance(address: string | undefined) {
  return useQuery<string>({
    queryKey: ['gchain', 'balance', address],
    queryFn: () => getBalance(address!),
    enabled: !!address,
    staleTime: GCHAIN_STALE_TIME,
    gcTime: GCHAIN_CACHE_TIME,
  })
}

// ============================================================================
// DEX/AMM Hooks - Unified Oracle and Pool Data
// ============================================================================

const PRICE_STALE_TIME = 5_000 // 5 seconds for prices
const POOL_STALE_TIME = 15_000 // 15 seconds for pool data

/**
 * Hook to get ETH and LUX prices in USD
 */
export function useGChainPriceBundle() {
  return useQuery<GChainBundle>({
    queryKey: ['gchain', 'bundle'],
    queryFn: getPriceBundle,
    staleTime: PRICE_STALE_TIME,
    gcTime: GCHAIN_CACHE_TIME,
    refetchInterval: 10_000, // Refetch every 10 seconds
  })
}

/**
 * Hook to get factory statistics (TVL, volume, pairs count)
 */
export function useGChainFactoryStats() {
  return useQuery<GChainFactory>({
    queryKey: ['gchain', 'factory'],
    queryFn: getFactoryStats,
    staleTime: POOL_STALE_TIME,
    gcTime: GCHAIN_CACHE_TIME,
  })
}

/**
 * Hook to get token data by address
 */
export function useGChainToken(address: string | undefined) {
  return useQuery<GChainToken | null>({
    queryKey: ['gchain', 'token', address],
    queryFn: () => (address ? getToken(address) : null),
    enabled: !!address,
    staleTime: POOL_STALE_TIME,
    gcTime: GCHAIN_CACHE_TIME,
  })
}

/**
 * Hook to get token price in USD
 */
export function useGChainTokenPrice(address: string | undefined) {
  return useQuery<number>({
    queryKey: ['gchain', 'token', 'price', address],
    queryFn: () => (address ? getTokenPriceUSD(address) : 0),
    enabled: !!address,
    staleTime: PRICE_STALE_TIME,
    gcTime: GCHAIN_CACHE_TIME,
    refetchInterval: 10_000,
  })
}

/**
 * Hook to get top tokens by TVL or volume
 */
export function useGChainTopTokens(limit = 20, orderBy: 'totalValueLockedUSD' | 'volumeUSD' = 'totalValueLockedUSD') {
  return useQuery<GChainToken[]>({
    queryKey: ['gchain', 'tokens', 'top', limit, orderBy],
    queryFn: () => getTopTokens(limit, orderBy),
    staleTime: POOL_STALE_TIME,
    gcTime: GCHAIN_CACHE_TIME,
  })
}

/**
 * Hook to get pool data by address
 */
export function useGChainPool(address: string | undefined) {
  return useQuery<GChainPool | null>({
    queryKey: ['gchain', 'pool', address],
    queryFn: () => (address ? getPool(address) : null),
    enabled: !!address,
    staleTime: POOL_STALE_TIME,
    gcTime: GCHAIN_CACHE_TIME,
  })
}

/**
 * Hook to find pool by token pair and fee tier
 */
export function useGChainPoolByTokens(token0: string | undefined, token1: string | undefined, feeTier: number = 3000) {
  return useQuery<GChainPool | null>({
    queryKey: ['gchain', 'pool', 'byTokens', token0, token1, feeTier],
    queryFn: () => (token0 && token1 ? getPoolByTokens(token0, token1, feeTier) : null),
    enabled: !!token0 && !!token1,
    staleTime: POOL_STALE_TIME,
    gcTime: GCHAIN_CACHE_TIME,
  })
}

/**
 * Hook to get top pools by TVL
 */
export function useGChainTopPools(limit = 20) {
  return useQuery<GChainPool[]>({
    queryKey: ['gchain', 'pools', 'top', limit],
    queryFn: () => getTopPools(limit),
    staleTime: POOL_STALE_TIME,
    gcTime: GCHAIN_CACHE_TIME,
  })
}

/**
 * Hook to get V2 pair data by address
 */
export function useGChainPair(address: string | undefined) {
  return useQuery<GChainPair | null>({
    queryKey: ['gchain', 'pair', address],
    queryFn: () => (address ? getPair(address) : null),
    enabled: !!address,
    staleTime: POOL_STALE_TIME,
    gcTime: GCHAIN_CACHE_TIME,
  })
}

/**
 * Hook to get user's LP positions
 */
export function useGChainPositions(owner: string | undefined) {
  return useQuery<GChainPosition[]>({
    queryKey: ['gchain', 'positions', owner],
    queryFn: () => (owner ? getPositions(owner) : []),
    enabled: !!owner,
    staleTime: POOL_STALE_TIME,
    gcTime: GCHAIN_CACHE_TIME,
  })
}

/**
 * Hook to get recent swaps for a pool
 */
export function useGChainSwaps(poolAddress: string | undefined, limit = 20) {
  return useQuery<GChainSwap[]>({
    queryKey: ['gchain', 'swaps', poolAddress, limit],
    queryFn: () => (poolAddress ? getSwaps(poolAddress, limit) : []),
    enabled: !!poolAddress,
    staleTime: PRICE_STALE_TIME,
    gcTime: GCHAIN_CACHE_TIME,
  })
}

/**
 * Hook to get tick data for a pool
 */
export function useGChainTicks(poolAddress: string | undefined, tickLower?: number, tickUpper?: number) {
  return useQuery<GChainTick[]>({
    queryKey: ['gchain', 'ticks', poolAddress, tickLower, tickUpper],
    queryFn: () => (poolAddress ? getTicks(poolAddress, tickLower, tickUpper) : []),
    enabled: !!poolAddress,
    staleTime: POOL_STALE_TIME,
    gcTime: GCHAIN_CACHE_TIME,
  })
}

/**
 * Hook to get token price history (OHLCV)
 */
export function useGChainTokenPriceHistory(tokenAddress: string | undefined, days = 30) {
  return useQuery<GChainTokenDayData[]>({
    queryKey: ['gchain', 'token', 'history', tokenAddress, days],
    queryFn: () => (tokenAddress ? getTokenPriceHistory(tokenAddress, days) : []),
    enabled: !!tokenAddress,
    staleTime: GCHAIN_STALE_TIME * 6, // 1 minute for historical data
    gcTime: GCHAIN_CACHE_TIME * 5, // 5 minutes
  })
}

/**
 * Hook to get TWAP price for a pool
 */
export function useGChainTWAP(poolAddress: string | undefined, hours = 24) {
  return useQuery<{ token0Price: number; token1Price: number }>({
    queryKey: ['gchain', 'twap', poolAddress, hours],
    queryFn: () => (poolAddress ? getTWAP(poolAddress, hours) : { token0Price: 0, token1Price: 0 }),
    enabled: !!poolAddress,
    staleTime: POOL_STALE_TIME,
    gcTime: GCHAIN_CACHE_TIME,
  })
}

/**
 * Hook to get cross-chain TVL stats
 */
export function useGChainAllChainsStats() {
  return useQuery<GChainChainStats[]>({
    queryKey: ['gchain', 'chains', 'stats'],
    queryFn: getAllChainsStats,
    staleTime: GCHAIN_STALE_TIME * 6, // 1 minute
    gcTime: GCHAIN_CACHE_TIME * 5, // 5 minutes
  })
}

// ============================================================================
// Composite Hooks - Combine multiple queries for common use cases
// ============================================================================

/**
 * Hook to get complete pool data with current prices
 */
export function useGChainPoolWithPrices(poolAddress: string | undefined) {
  const poolQuery = useGChainPool(poolAddress)
  const bundleQuery = useGChainPriceBundle()

  return {
    ...poolQuery,
    data: poolQuery.data
      ? {
          ...poolQuery.data,
          ethPriceUSD: bundleQuery.data?.ethPriceUSD ?? 0,
          luxPriceUSD: bundleQuery.data?.luxPriceUSD ?? 0,
        }
      : null,
    isLoading: poolQuery.isLoading || bundleQuery.isLoading,
  }
}

/**
 * Hook to get user positions with current values
 */
export function useGChainPositionsWithValue(owner: string | undefined) {
  const positionsQuery = useGChainPositions(owner)
  const bundleQuery = useGChainPriceBundle()

  return {
    ...positionsQuery,
    data: positionsQuery.data?.map((position) => ({
      ...position,
      ethPriceUSD: bundleQuery.data?.ethPriceUSD ?? 0,
    })),
    isLoading: positionsQuery.isLoading || bundleQuery.isLoading,
  }
}
