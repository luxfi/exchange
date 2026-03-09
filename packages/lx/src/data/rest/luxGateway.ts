/**
 * Lux Gateway API client for Lux chain data
 * Provides token and pool data for Lux mainnet
 *
 * Data source priority:
 * 1. G-Chain GraphQL (native blockchain data)
 * 2. Lux Gateway REST API
 * 3. Static fallback token lists
 */

import { UniverseChainId } from 'lx/src/features/chains/types'
import { getTopTokens, getTopPools, type GChainToken, type GChainPool } from 'lx/src/data/gchain'

// Lux Gateway base URL - can be overridden via environment
const LUX_GATEWAY_URL =
  process.env.LUX_GATEWAY_URL ||
  process.env.REACT_APP_LUX_GATEWAY_URL ||
  process.env.NEXT_PUBLIC_LUX_GATEWAY_URL ||
  'http://localhost:8080'

// Check if G-Chain should be used as primary data source
const USE_GCHAIN =
  process.env.REACT_APP_USE_LOCAL_DEX === 'true' ||
  process.env.NEXT_PUBLIC_USE_LOCAL_DEX === 'true' ||
  process.env.USE_GCHAIN === 'true'

// Static fallback token data for Lux/Zoo chains with correct deployed addresses
const FALLBACK_TOKENS: Record<number, LuxToken[]> = {
  // Lux Dev (chain ID 1337) - DeployFullStack.s.sol via anvil account 0 (deterministic CREATE addresses)
  // Nonces: WLUX(0), LETH(1), LBTC(2), LUSD(3)
  [UniverseChainId.LuxDev]: [
    { chainId: 1337, address: '0x0000000000000000000000000000000000000000', name: 'LUX', symbol: 'LUX', decimals: 18 },
    { chainId: 1337, address: '0x5FbDB2315678afecb367f032d93F642f64180aa3', name: 'Wrapped LUX', symbol: 'WLUX', decimals: 18 },
    { chainId: 1337, address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', name: 'Bridged ETH', symbol: 'LETH', decimals: 18 },
    { chainId: 1337, address: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0', name: 'Bridged BTC', symbol: 'LBTC', decimals: 8 },
    { chainId: 1337, address: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9', name: 'Lux USD', symbol: 'LUSD', decimals: 6 },
  ],
  [UniverseChainId.Lux]: [
    { chainId: 96369, address: '0x0000000000000000000000000000000000000000', name: 'LUX', symbol: 'LUX', decimals: 18 },
    { chainId: 96369, address: '0x4888e4a2ee0f03051c72d2bd3acf755ed3498b3e', name: 'Wrapped LUX', symbol: 'WLUX', decimals: 18 },
    { chainId: 96369, address: '0x848cff46eb323f323b6bbe1df274e40793d7f2c2', name: 'Lux USD', symbol: 'LUSD', decimals: 18 },
    { chainId: 96369, address: '0xdf1de693c31e2a5eb869c329529623556b20abf3', name: 'Tether', symbol: 'USDT', decimals: 18 },
    { chainId: 96369, address: '0x8031e9b0d02a792cfefaa2bdca6e1289d385426f', name: 'USD Coin', symbol: 'USDC', decimals: 18 },
    { chainId: 96369, address: '0x60e0a8167fc13de89348978860466c9cec24b9ba', name: 'Lux Ether', symbol: 'LETH', decimals: 18 },
    { chainId: 96369, address: '0x1e48d32a4f5e9f08db9ae4959163300faf8a6c8e', name: 'Lux Bitcoin', symbol: 'LBTC', decimals: 8 },
    { chainId: 96369, address: '0x5e5290f350352768bd2bfc59c2da15dd04a7cb88', name: 'Lux ZOO', symbol: 'LZOO', decimals: 18 },
    { chainId: 96369, address: '0x26b40f650156c7ebf9e087dd0dca181fe87625b7', name: 'Lux SOL', symbol: 'LSOL', decimals: 18 },
  ],
  [UniverseChainId.Zoo]: [
    { chainId: 200200, address: '0x0000000000000000000000000000000000000000', name: 'ZOO', symbol: 'ZOO', decimals: 18 },
    { chainId: 200200, address: '0x5491216406daB99b7032b83765F36790E27F8A61', name: 'Wrapped LUX', symbol: 'WLUX', decimals: 18 },
    { chainId: 200200, address: '0xb2ee1CE7b84853b83AA08702aD0aD4D79711882D', name: 'Lux USDC', symbol: 'LUSDC', decimals: 6 },
    { chainId: 200200, address: '0x4870621EA8be7a383eFCfdA225249d35888bD9f2', name: 'Lux ETH', symbol: 'LETH', decimals: 18 },
    { chainId: 200200, address: '0x6fc44509a32E513bE1aa00d27bb298e63830C6A8', name: 'Lux BTC', symbol: 'LBTC', decimals: 8 },
  ],
}

// Static fallback pool data (empty until pools are created on-chain)
const FALLBACK_POOLS: Record<number, LuxPool[]> = {
  [UniverseChainId.LuxDev]: [],
  [UniverseChainId.Lux]: [],
  [UniverseChainId.Zoo]: [],
}

export interface LuxToken {
  address: string
  chainId: number
  decimals: number
  symbol: string
  name: string
}

export interface LuxPool {
  address: string
  chainId: number
  protocol: string
  token0: LuxToken
  token1: LuxToken
  fee: number
  tvl: number
  apr: number
  tickData: Array<{
    tickLower: number
    tickUpper: number
    liquidity: number
  }>
}

export interface LuxQuoteRequest {
  chainId: number
  tokenIn: string
  tokenOut: string
  amountIn: string
  slippage?: number
}

export interface LuxQuoteResponse {
  success: boolean
  data?: {
    amountOut: string
    priceImpact: number
    route: Array<{
      pool: string
      tokenIn: string
      tokenOut: string
      fee: number
    }>
  }
}

async function fetchLux<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${LUX_GATEWAY_URL}${endpoint}`)
  if (!response.ok) {
    throw new Error(`Lux Gateway error: ${response.statusText}`)
  }
  const result = await response.json()
  if (!result.success) {
    throw new Error('Lux Gateway returned unsuccessful response')
  }
  return result.data
}

/**
 * Check if the Lux Gateway is healthy
 */
export async function checkLuxHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${LUX_GATEWAY_URL}/health`, { 
      signal: AbortSignal.timeout(2000) // 2 second timeout
    })
    const data = await response.json()
    // Check if Lux provider is healthy
    const luxProvider = data.data?.providers?.find((p: any) => p.provider === 'lux')
    return luxProvider?.healthy === true
  } catch {
    return false
  }
}

/**
 * Convert G-Chain token to LuxToken format
 */
function gchainTokenToLuxToken(token: GChainToken, chainId: number): LuxToken {
  return {
    address: token.id,
    chainId,
    decimals: token.decimals,
    symbol: token.symbol,
    name: token.name,
  }
}

/**
 * Convert G-Chain pool to LuxPool format
 */
function gchainPoolToLuxPool(pool: GChainPool, chainId: number): LuxPool {
  return {
    address: pool.id,
    chainId,
    protocol: 'v3',
    token0: {
      address: pool.token0.id,
      chainId,
      decimals: pool.token0.decimals || 18,
      symbol: pool.token0.symbol,
      name: pool.token0.symbol,
    },
    token1: {
      address: pool.token1.id,
      chainId,
      decimals: pool.token1.decimals || 18,
      symbol: pool.token1.symbol,
      name: pool.token1.symbol,
    },
    fee: pool.feeTier,
    tvl: parseFloat(pool.totalValueLockedUSD),
    apr: 0,
    tickData: [],
  }
}

/**
 * Fetch tokens from G-Chain (primary) or Lux Gateway (fallback)
 * Data source priority: G-Chain GraphQL > Lux Gateway > Static fallback
 */
export async function fetchLuxTokens(chainId: number = UniverseChainId.Lux): Promise<LuxToken[]> {
  // Try G-Chain first (native blockchain data)
  if (USE_GCHAIN || isLuxChain(chainId)) {
    try {
      const gchainTokens = await getTopTokens(50)
      if (gchainTokens.length > 0) {
        return gchainTokens.map((t) => gchainTokenToLuxToken(t, chainId))
      }
    } catch (error) {
      console.warn('G-Chain token fetch failed, trying Lux Gateway:', error)
    }
  }

  // Try Lux Gateway
  try {
    return await fetchLux<LuxToken[]>(`/v1/tokens?chainId=${chainId}`)
  } catch (error) {
    // Fallback to static tokens
    console.warn('Lux Gateway unavailable, using fallback token list:', error)
    return FALLBACK_TOKENS[chainId] || []
  }
}

/**
 * Fetch pools from G-Chain (primary) or Lux Gateway (fallback)
 * Data source priority: G-Chain GraphQL > Lux Gateway > Static fallback
 */
export async function fetchLuxPools(chainId: number = UniverseChainId.Lux): Promise<LuxPool[]> {
  // Try G-Chain first (native blockchain data)
  if (USE_GCHAIN || isLuxChain(chainId)) {
    try {
      const gchainPools = await getTopPools(50)
      if (gchainPools.length > 0) {
        return gchainPools.map((p) => gchainPoolToLuxPool(p, chainId))
      }
    } catch (error) {
      console.warn('G-Chain pool fetch failed, trying Lux Gateway:', error)
    }
  }

  // Try Lux Gateway
  try {
    return await fetchLux<LuxPool[]>(`/v1/pools?chainId=${chainId}`)
  } catch (error) {
    // Fallback to empty pools (no pools yet)
    console.warn('Lux Gateway unavailable, using fallback pool list:', error)
    return FALLBACK_POOLS[chainId] || []
  }
}

/**
 * Get a swap quote from Lux Gateway
 */
export async function fetchLuxQuote(request: LuxQuoteRequest): Promise<LuxQuoteResponse> {
  const response = await fetch(`${LUX_GATEWAY_URL}/v1/quote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })
  return response.json()
}

/**
 * Check if a chain ID should use Lux Gateway
 */
export function isLuxChain(chainId: number): boolean {
  return chainId === UniverseChainId.LuxDev || chainId === UniverseChainId.Lux || chainId === UniverseChainId.Zoo
}

/**
 * Search tokens on Lux/Zoo chains using G-Chain or fallback data
 * Searches by symbol, name, or address
 */
export async function searchLuxTokens(
  query: string,
  chainId: number = UniverseChainId.Lux
): Promise<LuxToken[]> {
  const normalizedQuery = query.toLowerCase().trim()

  // Fetch all tokens first
  const allTokens = await fetchLuxTokens(chainId)

  // Filter by query
  return allTokens.filter((token) => {
    return (
      token.symbol.toLowerCase().includes(normalizedQuery) ||
      token.name.toLowerCase().includes(normalizedQuery) ||
      token.address.toLowerCase() === normalizedQuery ||
      token.address.toLowerCase().startsWith(normalizedQuery)
    )
  })
}

/**
 * Get a single token by address from G-Chain or fallback
 */
export async function getTokenByAddress(
  address: string,
  chainId: number = UniverseChainId.Lux
): Promise<LuxToken | null> {
  const normalizedAddress = address.toLowerCase()

  // Fetch all tokens
  const allTokens = await fetchLuxTokens(chainId)

  // Find by address
  return allTokens.find((t) => t.address.toLowerCase() === normalizedAddress) || null
}
