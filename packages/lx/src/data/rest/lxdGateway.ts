/**
 * LXD Gateway API client for Lux chain data
 * This provides token and pool data for Lux mainnet
 *
 * Data source priority:
 * 1. G-Chain GraphQL (native blockchain data)
 * 2. LXD Gateway REST API
 * 3. Static fallback token lists
 */

import { UniverseChainId } from 'lx/src/features/chains/types'
import { getTopTokens, getTopPools, type GChainToken, type GChainPool } from 'lx/src/data/gchain'

// LXD Gateway base URL - can be overridden via environment
const LXD_GATEWAY_URL =
  process.env.LXD_GATEWAY_URL ||
  process.env.REACT_APP_LXD_GATEWAY_URL ||
  process.env.NEXT_PUBLIC_LXD_GATEWAY_URL ||
  process.env.LUX_GATEWAY_URL ||
  'http://localhost:8080'

// Check if G-Chain should be used as primary data source
const USE_GCHAIN =
  process.env.REACT_APP_USE_LOCAL_DEX === 'true' ||
  process.env.NEXT_PUBLIC_USE_LOCAL_DEX === 'true' ||
  process.env.USE_GCHAIN === 'true'

// Static fallback token data for Lux/Zoo chains with correct deployed addresses
const FALLBACK_TOKENS: Record<number, LxdToken[]> = {
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
    { chainId: 96369, address: '0x55750d6CA62a041c06a8E28626b10Be6c688f471', name: 'Wrapped LUX', symbol: 'WLUX', decimals: 18 },
    { chainId: 96369, address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', name: 'USD Coin', symbol: 'USDC', decimals: 6 },
    { chainId: 96369, address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', name: 'Tether USD', symbol: 'USDT', decimals: 6 },
    { chainId: 96369, address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', name: 'Wrapped Ether', symbol: 'WETH', decimals: 18 },
    { chainId: 96369, address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', name: 'Wrapped Bitcoin', symbol: 'WBTC', decimals: 8 },
    { chainId: 96369, address: '0xAA3AE95816a4A6FbC6b8Ed5a6C06f22A96A80C8C', name: 'Lux Ether', symbol: 'LETH', decimals: 18 },
    { chainId: 96369, address: '0x526903E35E7106D62ED3B5d77E14e51d024Aa1D3', name: 'Lux Bitcoin', symbol: 'LBTC', decimals: 8 },
    { chainId: 96369, address: '0x4B1BfA76eD63F1A0aD2E4f40b3F46C45E8F7A4E2', name: 'Lux USD', symbol: 'LUSD', decimals: 18 },
  ],
  [UniverseChainId.Zoo]: [
    { chainId: 200200, address: '0x0000000000000000000000000000000000000000', name: 'ZOO', symbol: 'ZOO', decimals: 18 },
    { chainId: 200200, address: '0x55750d6CA62a041c06a8E28626b10Be6c688f471', name: 'Wrapped ZOO', symbol: 'WZOO', decimals: 18 },
    { chainId: 200200, address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', name: 'USD Coin', symbol: 'USDC', decimals: 6 },
    { chainId: 200200, address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', name: 'Tether USD', symbol: 'USDT', decimals: 6 },
    { chainId: 200200, address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', name: 'Wrapped Ether', symbol: 'WETH', decimals: 18 },
    { chainId: 200200, address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', name: 'Wrapped Bitcoin', symbol: 'WBTC', decimals: 8 },
  ],
}

// Static fallback pool data (empty until pools are created on-chain)
const FALLBACK_POOLS: Record<number, LxdPool[]> = {
  [UniverseChainId.LuxDev]: [],
  [UniverseChainId.Lux]: [],
  [UniverseChainId.Zoo]: [],
}

export interface LxdToken {
  address: string
  chainId: number
  decimals: number
  symbol: string
  name: string
}

export interface LxdPool {
  address: string
  chainId: number
  protocol: string
  token0: LxdToken
  token1: LxdToken
  fee: number
  tvl: number
  apr: number
  tickData: Array<{
    tickLower: number
    tickUpper: number
    liquidity: number
  }>
}

export interface LxdQuoteRequest {
  chainId: number
  tokenIn: string
  tokenOut: string
  amountIn: string
  slippage?: number
}

export interface LxdQuoteResponse {
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

async function fetchLxd<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${LXD_GATEWAY_URL}${endpoint}`)
  if (!response.ok) {
    throw new Error(`LXD Gateway error: ${response.statusText}`)
  }
  const result = await response.json()
  if (!result.success) {
    throw new Error('LXD Gateway returned unsuccessful response')
  }
  return result.data
}

/**
 * Check if the LXD Gateway is healthy
 */
export async function checkLxdHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${LXD_GATEWAY_URL}/health`, { 
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
 * Convert G-Chain token to LxdToken format
 */
function gchainTokenToLxdToken(token: GChainToken, chainId: number): LxdToken {
  return {
    address: token.id,
    chainId,
    decimals: token.decimals,
    symbol: token.symbol,
    name: token.name,
  }
}

/**
 * Convert G-Chain pool to LxdPool format
 */
function gchainPoolToLxdPool(pool: GChainPool, chainId: number): LxdPool {
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
    tvl: parseFloat(pool.totalValueLockedUSD) * 1e18,
    apr: 0,
    tickData: [],
  }
}

/**
 * Fetch tokens from G-Chain (primary) or LXD Gateway (fallback)
 * Data source priority: G-Chain GraphQL > LXD Gateway > Static fallback
 */
export async function fetchLxdTokens(chainId: number = UniverseChainId.Lux): Promise<LxdToken[]> {
  // Try G-Chain first (native blockchain data)
  if (USE_GCHAIN || isLxdChain(chainId)) {
    try {
      const gchainTokens = await getTopTokens(50)
      if (gchainTokens.length > 0) {
        return gchainTokens.map((t) => gchainTokenToLxdToken(t, chainId))
      }
    } catch (error) {
      console.warn('G-Chain token fetch failed, trying LXD Gateway:', error)
    }
  }

  // Try LXD Gateway
  try {
    return await fetchLxd<LxdToken[]>(`/v1/tokens?chainId=${chainId}`)
  } catch (error) {
    // Fallback to static tokens
    console.warn('LXD Gateway unavailable, using fallback token list:', error)
    return FALLBACK_TOKENS[chainId] || []
  }
}

/**
 * Fetch pools from G-Chain (primary) or LXD Gateway (fallback)
 * Data source priority: G-Chain GraphQL > LXD Gateway > Static fallback
 */
export async function fetchLxdPools(chainId: number = UniverseChainId.Lux): Promise<LxdPool[]> {
  // Try G-Chain first (native blockchain data)
  if (USE_GCHAIN || isLxdChain(chainId)) {
    try {
      const gchainPools = await getTopPools(50)
      if (gchainPools.length > 0) {
        return gchainPools.map((p) => gchainPoolToLxdPool(p, chainId))
      }
    } catch (error) {
      console.warn('G-Chain pool fetch failed, trying LXD Gateway:', error)
    }
  }

  // Try LXD Gateway
  try {
    return await fetchLxd<LxdPool[]>(`/v1/pools?chainId=${chainId}`)
  } catch (error) {
    // Fallback to empty pools (no pools yet)
    console.warn('LXD Gateway unavailable, using fallback pool list:', error)
    return FALLBACK_POOLS[chainId] || []
  }
}

/**
 * Get a swap quote from LXD Gateway
 */
export async function fetchLxdQuote(request: LxdQuoteRequest): Promise<LxdQuoteResponse> {
  const response = await fetch(`${LXD_GATEWAY_URL}/v1/quote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })
  return response.json()
}

/**
 * Check if a chain ID should use LXD Gateway
 */
export function isLxdChain(chainId: number): boolean {
  return chainId === UniverseChainId.LuxDev || chainId === UniverseChainId.Lux || chainId === UniverseChainId.Zoo
}

/**
 * Search tokens on Lux/Zoo chains using G-Chain or fallback data
 * Searches by symbol, name, or address
 */
export async function searchLxdTokens(
  query: string,
  chainId: number = UniverseChainId.Lux
): Promise<LxdToken[]> {
  const normalizedQuery = query.toLowerCase().trim()

  // Fetch all tokens first
  const allTokens = await fetchLxdTokens(chainId)

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
): Promise<LxdToken | null> {
  const normalizedAddress = address.toLowerCase()

  // Fetch all tokens
  const allTokens = await fetchLxdTokens(chainId)

  // Find by address
  return allTokens.find((t) => t.address.toLowerCase() === normalizedAddress) || null
}
