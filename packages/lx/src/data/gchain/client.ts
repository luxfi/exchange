/**
 * G-Chain GraphQL Client
 *
 * Native Lux blockchain data layer providing read-only access to:
 * - Blocks and transactions
 * - Accounts and balances
 * - Chain metadata
 * - Cross-chain data (C, P, X, D chains)
 *
 * G-Chain endpoint: /ext/bc/G/graphql
 */

import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import { getGChainGraphqlHttpLink } from 'lx/src/data/links'

// Create a dedicated Apollo client for G-Chain
let gChainClient: ApolloClient<object> | null = null

export function getGChainClient(): ApolloClient<object> {
  if (!gChainClient) {
    gChainClient = new ApolloClient({
      link: getGChainGraphqlHttpLink(),
      cache: new InMemoryCache(),
      defaultOptions: {
        query: {
          fetchPolicy: 'network-only', // Always fetch fresh data from G-Chain
        },
      },
    })
  }
  return gChainClient
}

// G-Chain GraphQL Queries

export const GCHAIN_INFO_QUERY = gql`
  query GChainInfo {
    chainInfo {
      vmName
      version
      readOnly
      timestamp
    }
    chains {
      id
      name
      type
    }
  }
`

export const GCHAIN_BLOCK_QUERY = gql`
  query GChainBlock($hash: String, $height: String) {
    block(hash: $hash, height: $height) {
      hash
      height
      timestamp
      transactions
    }
  }
`

export const GCHAIN_BLOCKS_QUERY = gql`
  query GChainBlocks($limit: String) {
    blocks(limit: $limit) {
      hash
      height
      timestamp
    }
  }
`

export const GCHAIN_TRANSACTION_QUERY = gql`
  query GChainTransaction($hash: String!) {
    transaction(hash: $hash) {
      hash
      from
      to
      value
    }
  }
`

export const GCHAIN_ACCOUNT_QUERY = gql`
  query GChainAccount($address: String!) {
    account(address: $address) {
      address
      balance
      nonce
    }
  }
`

export const GCHAIN_BALANCE_QUERY = gql`
  query GChainBalance($address: String!) {
    balance(address: $address)
  }
`

// G-Chain data types
export interface GChainInfo {
  vmName: string
  version: string
  readOnly: boolean
  timestamp: number
}

export interface GChainChain {
  id: string
  name: string
  type: string
}

export interface GChainBlock {
  hash: string
  height: number
  timestamp: number
  transactions?: string[]
}

export interface GChainTransaction {
  hash: string
  from: string
  to: string
  value: string
}

export interface GChainAccount {
  address: string
  balance: string
  nonce: number
}

// Helper functions

export async function getChainInfo(): Promise<{ chainInfo: GChainInfo; chains: GChainChain[] }> {
  const client = getGChainClient()
  const { data } = await client.query({ query: GCHAIN_INFO_QUERY })
  return data
}

export async function getBlock(hashOrHeight: string): Promise<GChainBlock | null> {
  const client = getGChainClient()
  const isHash = hashOrHeight.startsWith('0x')
  const { data } = await client.query({
    query: GCHAIN_BLOCK_QUERY,
    variables: isHash ? { hash: hashOrHeight } : { height: hashOrHeight },
  })
  return data.block
}

export async function getLatestBlocks(limit = 10): Promise<GChainBlock[]> {
  const client = getGChainClient()
  const { data } = await client.query({
    query: GCHAIN_BLOCKS_QUERY,
    variables: { limit: String(limit) },
  })
  return data.blocks || []
}

export async function getTransaction(hash: string): Promise<GChainTransaction | null> {
  const client = getGChainClient()
  const { data } = await client.query({
    query: GCHAIN_TRANSACTION_QUERY,
    variables: { hash },
  })
  return data.transaction
}

export async function getAccount(address: string): Promise<GChainAccount> {
  const client = getGChainClient()
  const { data } = await client.query({
    query: GCHAIN_ACCOUNT_QUERY,
    variables: { address },
  })
  return data.account
}

export async function getBalance(address: string): Promise<string> {
  const client = getGChainClient()
  const { data } = await client.query({
    query: GCHAIN_BALANCE_QUERY,
    variables: { address },
  })
  return data.balance || '0'
}

// =============================================================================
// DEX / AMM Queries
// =============================================================================

// Price Bundle Query - ETH and LUX prices in USD
export const GCHAIN_BUNDLE_QUERY = gql`
  query GChainBundle {
    bundle(id: "1") {
      ethPriceUSD
      luxPriceUSD
    }
  }
`

// Factory Stats Query
export const GCHAIN_FACTORY_QUERY = gql`
  query GChainFactory {
    factory(id: "1") {
      poolCount
      pairCount
      txCount
      totalVolumeUSD
      totalValueLockedUSD
    }
  }
`

// Token Query
export const GCHAIN_TOKEN_QUERY = gql`
  query GChainToken($id: String!) {
    token(id: $id) {
      id
      symbol
      name
      decimals
      volumeUSD
      totalValueLockedUSD
      derivedETH
      derivedLUX
    }
  }
`

// Tokens List Query
export const GCHAIN_TOKENS_QUERY = gql`
  query GChainTokens($first: Int, $orderBy: String, $orderDirection: String) {
    tokens(first: $first, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      symbol
      name
      decimals
      volumeUSD
      totalValueLockedUSD
      derivedETH
    }
  }
`

// Pool Query (V3)
export const GCHAIN_POOL_QUERY = gql`
  query GChainPool($id: String!) {
    pool(id: $id) {
      id
      token0 {
        id
        symbol
        decimals
      }
      token1 {
        id
        symbol
        decimals
      }
      feeTier
      liquidity
      sqrtPrice
      tick
      token0Price
      token1Price
      volumeUSD
      totalValueLockedUSD
      feesUSD
    }
  }
`

// Pools List Query
export const GCHAIN_POOLS_QUERY = gql`
  query GChainPools($first: Int, $orderBy: String, $orderDirection: String) {
    pools(first: $first, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      token0 {
        id
        symbol
      }
      token1 {
        id
        symbol
      }
      feeTier
      liquidity
      volumeUSD
      totalValueLockedUSD
    }
  }
`

// Pool by Token Pair Query
export const GCHAIN_POOL_BY_TOKENS_QUERY = gql`
  query GChainPoolByTokens($token0: String!, $token1: String!, $feeTier: Int) {
    pools(where: { token0: $token0, token1: $token1, feeTier: $feeTier }) {
      id
      feeTier
      liquidity
      sqrtPrice
      tick
      token0Price
      token1Price
      totalValueLockedUSD
    }
  }
`

// Pair Query (V2)
export const GCHAIN_PAIR_QUERY = gql`
  query GChainPair($id: String!) {
    pair(id: $id) {
      id
      token0 {
        id
        symbol
        decimals
      }
      token1 {
        id
        symbol
        decimals
      }
      reserve0
      reserve1
      reserveUSD
      token0Price
      token1Price
      volumeUSD
    }
  }
`

// Positions Query
export const GCHAIN_POSITIONS_QUERY = gql`
  query GChainPositions($owner: String!) {
    positions(where: { owner: $owner }) {
      id
      owner
      pool {
        id
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
        feeTier
      }
      tickLower {
        tickIdx
        price0
      }
      tickUpper {
        tickIdx
        price0
      }
      liquidity
      depositedToken0
      depositedToken1
      collectedFeesToken0
      collectedFeesToken1
    }
  }
`

// Swaps Query
export const GCHAIN_SWAPS_QUERY = gql`
  query GChainSwaps($first: Int, $pool: String) {
    swaps(first: $first, where: { pool: $pool }, orderBy: timestamp, orderDirection: desc) {
      id
      timestamp
      sender
      recipient
      amount0
      amount1
      amountUSD
      pool {
        token0 {
          symbol
        }
        token1 {
          symbol
        }
      }
    }
  }
`

// Ticks Query (for liquidity depth)
export const GCHAIN_TICKS_QUERY = gql`
  query GChainTicks($pool: String!, $tickLower: Int, $tickUpper: Int) {
    ticks(where: { pool: $pool, tickIdx_gte: $tickLower, tickIdx_lte: $tickUpper }, orderBy: tickIdx) {
      tickIdx
      liquidityNet
      liquidityGross
      price0
      price1
    }
  }
`

// Token Day Data Query (price history)
export const GCHAIN_TOKEN_DAY_DATA_QUERY = gql`
  query GChainTokenDayData($token: String!, $days: Int) {
    tokenDayDatas(first: $days, where: { token: $token }, orderBy: date, orderDirection: desc) {
      date
      priceUSD
      volumeUSD
      totalValueLockedUSD
      open
      high
      low
      close
    }
  }
`

// Pool Hour Data Query (for TWAP)
export const GCHAIN_POOL_HOUR_DATA_QUERY = gql`
  query GChainPoolHourData($pool: String!, $hours: Int) {
    poolHourDatas(first: $hours, where: { pool: $pool }, orderBy: periodStartUnix, orderDirection: desc) {
      periodStartUnix
      token0Price
      token1Price
      volumeUSD
      tvlUSD
    }
  }
`

// Cross-Chain TVL Query
export const GCHAIN_ALL_CHAINS_QUERY = gql`
  query GChainAllChains {
    allChains {
      chainId
      chainName
      tvlUSD
      volumeUSD24h
      poolCount
    }
  }
`

// =============================================================================
// DEX / AMM Types
// =============================================================================

export interface GChainBundle {
  ethPriceUSD: string
  luxPriceUSD: string
}

export interface GChainFactory {
  poolCount: number
  pairCount: number
  txCount: string
  totalVolumeUSD: string
  totalValueLockedUSD: string
}

export interface GChainToken {
  id: string
  symbol: string
  name: string
  decimals: number
  volumeUSD: string
  totalValueLockedUSD: string
  derivedETH: string
  derivedLUX?: string
}

export interface GChainPool {
  id: string
  token0: { id: string; symbol: string; decimals?: number }
  token1: { id: string; symbol: string; decimals?: number }
  feeTier: number
  liquidity: string
  sqrtPrice: string
  tick: number
  token0Price: string
  token1Price: string
  volumeUSD: string
  totalValueLockedUSD: string
  feesUSD?: string
}

export interface GChainPair {
  id: string
  token0: { id: string; symbol: string; decimals: number }
  token1: { id: string; symbol: string; decimals: number }
  reserve0: string
  reserve1: string
  reserveUSD: string
  token0Price: string
  token1Price: string
  volumeUSD: string
}

export interface GChainPosition {
  id: string
  owner: string
  pool: {
    id: string
    token0: { id: string; symbol: string }
    token1: { id: string; symbol: string }
    feeTier: number
  }
  tickLower: { tickIdx: number; price0: string }
  tickUpper: { tickIdx: number; price0: string }
  liquidity: string
  depositedToken0: string
  depositedToken1: string
  collectedFeesToken0: string
  collectedFeesToken1: string
}

export interface GChainSwap {
  id: string
  timestamp: string
  sender: string
  recipient: string
  amount0: string
  amount1: string
  amountUSD: string
  pool: {
    token0: { symbol: string }
    token1: { symbol: string }
  }
}

export interface GChainTick {
  tickIdx: number
  liquidityNet: string
  liquidityGross: string
  price0: string
  price1: string
}

export interface GChainTokenDayData {
  date: number
  priceUSD: string
  volumeUSD: string
  totalValueLockedUSD: string
  open: string
  high: string
  low: string
  close: string
}

export interface GChainChainStats {
  chainId: string
  chainName: string
  tvlUSD: string
  volumeUSD24h: string
  poolCount: number
}

// =============================================================================
// Oracle / Price Helper Functions
// =============================================================================

/**
 * Get ETH and LUX prices in USD
 */
export async function getPriceBundle(): Promise<GChainBundle> {
  const client = getGChainClient()
  const { data } = await client.query({ query: GCHAIN_BUNDLE_QUERY })
  return data.bundle
}

/**
 * Get factory statistics (TVL, volume, pool count)
 */
export async function getFactoryStats(): Promise<GChainFactory> {
  const client = getGChainClient()
  const { data } = await client.query({ query: GCHAIN_FACTORY_QUERY })
  return data.factory
}

/**
 * Get token info and price
 */
export async function getToken(address: string): Promise<GChainToken | null> {
  const client = getGChainClient()
  const { data } = await client.query({
    query: GCHAIN_TOKEN_QUERY,
    variables: { id: address.toLowerCase() },
  })
  return data.token
}

/**
 * Get token price in USD
 */
export async function getTokenPriceUSD(address: string): Promise<number> {
  const [token, bundle] = await Promise.all([getToken(address), getPriceBundle()])
  if (!token || !bundle) return 0

  const derivedETH = parseFloat(token.derivedETH)
  const ethPrice = parseFloat(bundle.ethPriceUSD)
  return derivedETH * ethPrice
}

/**
 * Get top tokens by TVL or volume
 */
export async function getTopTokens(
  limit = 20,
  orderBy: 'totalValueLockedUSD' | 'volumeUSD' = 'totalValueLockedUSD'
): Promise<GChainToken[]> {
  const client = getGChainClient()
  const { data } = await client.query({
    query: GCHAIN_TOKENS_QUERY,
    variables: { first: limit, orderBy, orderDirection: 'desc' },
  })
  return data.tokens || []
}

/**
 * Get pool by address
 */
export async function getPool(address: string): Promise<GChainPool | null> {
  const client = getGChainClient()
  const { data } = await client.query({
    query: GCHAIN_POOL_QUERY,
    variables: { id: address.toLowerCase() },
  })
  return data.pool
}

/**
 * Get pool by token pair and fee tier
 */
export async function getPoolByTokens(token0: string, token1: string, feeTier?: number): Promise<GChainPool | null> {
  const client = getGChainClient()
  const { data } = await client.query({
    query: GCHAIN_POOL_BY_TOKENS_QUERY,
    variables: {
      token0: token0.toLowerCase(),
      token1: token1.toLowerCase(),
      feeTier,
    },
  })
  return data.pools?.[0] || null
}

/**
 * Get top pools
 */
export async function getTopPools(limit = 20): Promise<GChainPool[]> {
  const client = getGChainClient()
  const { data } = await client.query({
    query: GCHAIN_POOLS_QUERY,
    variables: { first: limit, orderBy: 'totalValueLockedUSD', orderDirection: 'desc' },
  })
  return data.pools || []
}

/**
 * Get V2 pair by address
 */
export async function getPair(address: string): Promise<GChainPair | null> {
  const client = getGChainClient()
  const { data } = await client.query({
    query: GCHAIN_PAIR_QUERY,
    variables: { id: address.toLowerCase() },
  })
  return data.pair
}

/**
 * Get user's LP positions
 */
export async function getPositions(owner: string): Promise<GChainPosition[]> {
  const client = getGChainClient()
  const { data } = await client.query({
    query: GCHAIN_POSITIONS_QUERY,
    variables: { owner: owner.toLowerCase() },
  })
  return data.positions || []
}

/**
 * Get recent swaps for a pool
 */
export async function getSwaps(poolAddress: string, limit = 20): Promise<GChainSwap[]> {
  const client = getGChainClient()
  const { data } = await client.query({
    query: GCHAIN_SWAPS_QUERY,
    variables: { first: limit, pool: poolAddress.toLowerCase() },
  })
  return data.swaps || []
}

/**
 * Get liquidity depth (ticks) for a pool
 */
export async function getTicks(
  poolAddress: string,
  tickLower: number = -887272,
  tickUpper: number = 887272
): Promise<GChainTick[]> {
  const client = getGChainClient()
  const { data } = await client.query({
    query: GCHAIN_TICKS_QUERY,
    variables: { pool: poolAddress.toLowerCase(), tickLower, tickUpper },
  })
  return data.ticks || []
}

/**
 * Get token price history (OHLCV)
 */
export async function getTokenPriceHistory(tokenAddress: string, days = 30): Promise<GChainTokenDayData[]> {
  const client = getGChainClient()
  const { data } = await client.query({
    query: GCHAIN_TOKEN_DAY_DATA_QUERY,
    variables: { token: tokenAddress.toLowerCase(), days },
  })
  return data.tokenDayDatas || []
}

/**
 * Get TWAP price from pool hour data
 */
export async function getTWAP(poolAddress: string, hours = 24): Promise<{ token0Price: number; token1Price: number }> {
  const client = getGChainClient()
  const { data } = await client.query({
    query: GCHAIN_POOL_HOUR_DATA_QUERY,
    variables: { pool: poolAddress.toLowerCase(), hours },
  })

  const hourData = data.poolHourDatas || []
  if (hourData.length === 0) {
    return { token0Price: 0, token1Price: 0 }
  }

  // Calculate time-weighted average
  let totalToken0 = 0
  let totalToken1 = 0
  for (const h of hourData) {
    totalToken0 += parseFloat(h.token0Price)
    totalToken1 += parseFloat(h.token1Price)
  }

  return {
    token0Price: totalToken0 / hourData.length,
    token1Price: totalToken1 / hourData.length,
  }
}

/**
 * Get cross-chain TVL and stats
 */
export async function getAllChainsStats(): Promise<GChainChainStats[]> {
  const client = getGChainClient()
  const { data } = await client.query({ query: GCHAIN_ALL_CHAINS_QUERY })
  return data.allChains || []
}
