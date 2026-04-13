/**
 * Lux V3 Graph Engine Data Hooks
 *
 * Fetches tokens, pools, and swap history from the luxfi/graph engine.
 * Used when the explore page is filtered to the Lux chain (96369).
 */
import { useQuery } from '@tanstack/react-query'

// ─── Constants ─────────────────────────────────────────────────────

export const LUX_CHAIN_ID = 96369
export const GRAPH_ENGINE_URL =
  process.env.REACT_APP_GRAPH_ENGINE_URL ||
  process.env.NEXT_PUBLIC_GRAPH_ENGINE_URL ||
  'https://api-exchange.lux.network/v1/graphql'

// ─── Types ─────────────────────────────────────────────────────────

export interface LuxToken {
  id: string
  symbol: string
  name: string
  decimals: string
  volumeUSD: string
  totalValueLockedUSD: string
  derivedETH: string
  txCount: string
}

export interface LuxPoolToken {
  id: string
  symbol: string
  name: string
  decimals: string
}

export interface LuxPool {
  id: string
  token0: LuxPoolToken
  token1: LuxPoolToken
  feeTier: string
  liquidity: string
  totalValueLockedUSD: string
  volumeUSD: string
  token0Price: string
  token1Price: string
  txCount: string
}

export interface LuxSwap {
  id: string
  timestamp: string
  amount0: string
  amount1: string
  amountUSD: string
  sender: string
  pool: {
    token0: { symbol: string }
    token1: { symbol: string }
  }
}

export interface LuxFactory {
  poolCount: string
  txCount: string
  totalVolumeUSD: string
  totalValueLockedUSD: string
}

// ─── Query Helper ──────────────────────────────────────────────────

async function sgQuery<T>(query: string): Promise<T> {
  try {
    const res = await fetch(GRAPH_ENGINE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) throw new Error(`graph engine ${res.status}`)
    const json = await res.json()
    if (json.errors) throw new Error(json.errors[0].message)
    return json.data
  } catch {
    // Graph engine unreachable -- use fallback from TradePage fallback data
    const { matchFallbackQuery } = await import('~/pages/Trade/fallbackData')
    const fallback = matchFallbackQuery(query)
    if (fallback) return fallback as T
    throw new Error('Graph engine unavailable and no fallback for this query')
  }
}

// ─── Hooks ─────────────────────────────────────────────────────────

export function useLuxSubgraphTokens() {
  return useQuery({
    queryKey: ['lux-sg-tokens'],
    queryFn: () =>
      sgQuery<{ tokens: LuxToken[] }>(`{
        tokens(first: 50, orderBy: volumeUSD, orderDirection: desc) {
          id symbol name decimals volumeUSD totalValueLockedUSD derivedETH txCount
        }
      }`),
    select: (d) => d.tokens,
    refetchInterval: 30000,
  })
}

export function useLuxSubgraphPools() {
  return useQuery({
    queryKey: ['lux-sg-pools'],
    queryFn: () =>
      sgQuery<{ pools: LuxPool[] }>(`{
        pools(first: 50, orderBy: totalValueLockedUSD, orderDirection: desc) {
          id token0 { id symbol name decimals } token1 { id symbol name decimals }
          feeTier liquidity totalValueLockedUSD volumeUSD token0Price token1Price txCount
        }
      }`),
    select: (d) => d.pools,
    refetchInterval: 15000,
  })
}

export function useLuxPoolSwapHistory(poolId: string) {
  return useQuery({
    queryKey: ['lux-sg-swaps', poolId],
    queryFn: () =>
      sgQuery<{ swaps: LuxSwap[] }>(`{
        swaps(first: 200, orderBy: timestamp, orderDirection: desc, where: { pool: "${poolId}" }) {
          id timestamp amount0 amount1 amountUSD sender
          pool { token0 { symbol } token1 { symbol } }
        }
      }`),
    select: (d) => d.swaps,
    refetchInterval: 10000,
    enabled: !!poolId,
  })
}

export function useLuxFactory() {
  return useQuery({
    queryKey: ['lux-sg-factory'],
    queryFn: () =>
      sgQuery<{ factories: LuxFactory[] }>(`{
        factories(first: 1) { poolCount txCount totalVolumeUSD totalValueLockedUSD }
      }`),
    select: (d) => d.factories[0],
    refetchInterval: 30000,
  })
}

export function useLuxPoolDayData(poolId: string) {
  return useQuery({
    queryKey: ['lux-sg-pool-day', poolId],
    queryFn: () =>
      sgQuery<{
        poolDayDatas: Array<{
          date: number
          volumeUSD: string
          tvlUSD: string
          open: string
          high: string
          low: string
          close: string
        }>
      }>(`{
        poolDayDatas(first: 90, orderBy: date, orderDirection: desc, where: { pool: "${poolId}" }) {
          date volumeUSD tvlUSD open high low close
        }
      }`),
    select: (d) => d.poolDayDatas.slice().reverse(),
    refetchInterval: 60000,
    enabled: !!poolId,
  })
}

// ─── Utility: check if a chainId is Lux ────────────────────────────

export function isLuxChainId(chainId: number | undefined): boolean {
  return chainId === LUX_CHAIN_ID
}
