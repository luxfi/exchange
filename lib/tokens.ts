/**
 * Lux Exchange - Token Definitions
 *
 * Comprehensive token list with chain mapping.
 * Tokens are organized by chain with Lux/Zoo tokens as primary.
 */

import type { Address } from "./contracts"
import {
  luxMainnet,
  luxTestnet,
  zooMainnet,
  zooTestnet,
  ethereum,
  sepolia,
  isLuxChain,
  isZooChain,
} from "./chains"

// =============================================================================
// TYPES
// =============================================================================

export interface Token {
  symbol: string
  name: string
  decimals: number
  address: Address | null // null = native token
  logoUri: string
  chainId: number
  isNative?: boolean
  isWrappedNative?: boolean
  balance?: string
}

export interface TokenList {
  name: string
  tokens: Token[]
}

// =============================================================================
// NATIVE TOKEN ADDRESS (represents native currency)
// =============================================================================

export const NATIVE_TOKEN_ADDRESS = null

// =============================================================================
// LUX MAINNET TOKENS (Chain ID: 96369)
// =============================================================================

export const LUX_MAINNET_TOKENS: Token[] = [
  {
    symbol: "LUX",
    name: "Lux",
    decimals: 18,
    address: null,
    logoUri: "/tokens/lux.svg",
    chainId: luxMainnet.id,
    isNative: true,
  },
  {
    symbol: "WLUX",
    name: "Wrapped LUX",
    decimals: 18,
    address: "0x0000000000000000000000000000000000000001",
    logoUri: "/tokens/wlux.svg",
    chainId: luxMainnet.id,
    isWrappedNative: true,
  },
  {
    symbol: "LETH",
    name: "Lux Ether",
    decimals: 18,
    address: "0x0000000000000000000000000000000000000002",
    logoUri: "/tokens/leth.svg",
    chainId: luxMainnet.id,
  },
  {
    symbol: "LBTC",
    name: "Lux Bitcoin",
    decimals: 8,
    address: "0x0000000000000000000000000000000000000003",
    logoUri: "/tokens/lbtc.svg",
    chainId: luxMainnet.id,
  },
  {
    symbol: "LUSD",
    name: "Lux USD",
    decimals: 18,
    address: "0x0000000000000000000000000000000000000004",
    logoUri: "/tokens/lusd.svg",
    chainId: luxMainnet.id,
  },
]

// =============================================================================
// LUX TESTNET TOKENS (Chain ID: 96368)
// =============================================================================

export const LUX_TESTNET_TOKENS: Token[] = [
  {
    symbol: "LUX",
    name: "Lux",
    decimals: 18,
    address: null,
    logoUri: "/tokens/lux.svg",
    chainId: luxTestnet.id,
    isNative: true,
  },
  {
    symbol: "WLUX",
    name: "Wrapped LUX",
    decimals: 18,
    address: "0x0000000000000000000000000000000000000001",
    logoUri: "/tokens/wlux.svg",
    chainId: luxTestnet.id,
    isWrappedNative: true,
  },
  {
    symbol: "LETH",
    name: "Lux Ether",
    decimals: 18,
    address: "0x0000000000000000000000000000000000000002",
    logoUri: "/tokens/leth.svg",
    chainId: luxTestnet.id,
  },
  {
    symbol: "LBTC",
    name: "Lux Bitcoin",
    decimals: 8,
    address: "0x0000000000000000000000000000000000000003",
    logoUri: "/tokens/lbtc.svg",
    chainId: luxTestnet.id,
  },
  {
    symbol: "LUSD",
    name: "Lux USD",
    decimals: 18,
    address: "0x0000000000000000000000000000000000000004",
    logoUri: "/tokens/lusd.svg",
    chainId: luxTestnet.id,
  },
]

// =============================================================================
// ZOO MAINNET TOKENS (Chain ID: 200200)
// =============================================================================

export const ZOO_MAINNET_TOKENS: Token[] = [
  {
    symbol: "ZOO",
    name: "Zoo",
    decimals: 18,
    address: null,
    logoUri: "/tokens/zoo.svg",
    chainId: zooMainnet.id,
    isNative: true,
  },
  {
    symbol: "WZOO",
    name: "Wrapped ZOO",
    decimals: 18,
    address: "0x0000000000000000000000000000000000000005",
    logoUri: "/tokens/wzoo.svg",
    chainId: zooMainnet.id,
    isWrappedNative: true,
  },
  {
    symbol: "WLUX",
    name: "Wrapped LUX",
    decimals: 18,
    address: "0x0000000000000000000000000000000000000001",
    logoUri: "/tokens/wlux.svg",
    chainId: zooMainnet.id,
  },
]

// =============================================================================
// ZOO TESTNET TOKENS (Chain ID: 200201)
// =============================================================================

export const ZOO_TESTNET_TOKENS: Token[] = [
  {
    symbol: "ZOO",
    name: "Zoo",
    decimals: 18,
    address: null,
    logoUri: "/tokens/zoo.svg",
    chainId: zooTestnet.id,
    isNative: true,
  },
  {
    symbol: "WZOO",
    name: "Wrapped ZOO",
    decimals: 18,
    address: "0x0000000000000000000000000000000000000005",
    logoUri: "/tokens/wzoo.svg",
    chainId: zooTestnet.id,
    isWrappedNative: true,
  },
  {
    symbol: "WLUX",
    name: "Wrapped LUX",
    decimals: 18,
    address: "0x0000000000000000000000000000000000000001",
    logoUri: "/tokens/wlux.svg",
    chainId: zooTestnet.id,
  },
]

// =============================================================================
// ETHEREUM MAINNET TOKENS (Chain ID: 1)
// =============================================================================

export const ETHEREUM_MAINNET_TOKENS: Token[] = [
  {
    symbol: "ETH",
    name: "Ether",
    decimals: 18,
    address: null,
    logoUri: "/tokens/eth.svg",
    chainId: ethereum.id,
    isNative: true,
  },
  {
    symbol: "WETH",
    name: "Wrapped Ether",
    decimals: 18,
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    logoUri: "/tokens/weth.svg",
    chainId: ethereum.id,
    isWrappedNative: true,
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    logoUri: "/tokens/usdc.svg",
    chainId: ethereum.id,
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    logoUri: "/tokens/usdt.svg",
    chainId: ethereum.id,
  },
  {
    symbol: "DAI",
    name: "Dai Stablecoin",
    decimals: 18,
    address: "0x6B175474E89094C44Da98b954EescdeCB5BE3830",
    logoUri: "/tokens/dai.svg",
    chainId: ethereum.id,
  },
  {
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    decimals: 8,
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    logoUri: "/tokens/wbtc.svg",
    chainId: ethereum.id,
  },
]

// =============================================================================
// SEPOLIA TESTNET TOKENS (Chain ID: 11155111)
// =============================================================================

export const SEPOLIA_TOKENS: Token[] = [
  {
    symbol: "ETH",
    name: "Sepolia Ether",
    decimals: 18,
    address: null,
    logoUri: "/tokens/eth.svg",
    chainId: sepolia.id,
    isNative: true,
  },
  {
    symbol: "WETH",
    name: "Wrapped Ether",
    decimals: 18,
    address: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
    logoUri: "/tokens/weth.svg",
    chainId: sepolia.id,
    isWrappedNative: true,
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    logoUri: "/tokens/usdc.svg",
    chainId: sepolia.id,
  },
]

// =============================================================================
// TOKEN LISTS BY CHAIN
// =============================================================================

export const TOKENS_BY_CHAIN: Record<number, Token[]> = {
  [luxMainnet.id]: LUX_MAINNET_TOKENS,
  [luxTestnet.id]: LUX_TESTNET_TOKENS,
  [zooMainnet.id]: ZOO_MAINNET_TOKENS,
  [zooTestnet.id]: ZOO_TESTNET_TOKENS,
  [ethereum.id]: ETHEREUM_MAINNET_TOKENS,
  [sepolia.id]: SEPOLIA_TOKENS,
}

// =============================================================================
// ALL TOKENS (for backward compatibility)
// =============================================================================

export const DEFAULT_TOKENS: Token[] = LUX_MAINNET_TOKENS

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get tokens for a specific chain
 */
export function getTokensForChain(chainId: number): Token[] {
  return TOKENS_BY_CHAIN[chainId] || []
}

/**
 * Get native token for a chain
 */
export function getNativeToken(chainId: number): Token | undefined {
  const tokens = getTokensForChain(chainId)
  return tokens.find((t) => t.isNative)
}

/**
 * Get wrapped native token for a chain
 */
export function getWrappedNativeToken(chainId: number): Token | undefined {
  const tokens = getTokensForChain(chainId)
  return tokens.find((t) => t.isWrappedNative)
}

/**
 * Get token by symbol on a specific chain
 */
export function getTokenBySymbol(
  chainId: number,
  symbol: string
): Token | undefined {
  const tokens = getTokensForChain(chainId)
  return tokens.find((t) => t.symbol.toLowerCase() === symbol.toLowerCase())
}

/**
 * Get token by address on a specific chain
 */
export function getTokenByAddress(
  chainId: number,
  address: string
): Token | undefined {
  const tokens = getTokensForChain(chainId)
  return tokens.find(
    (t) => t.address?.toLowerCase() === address.toLowerCase()
  )
}

/**
 * Get default input token for a chain (native token)
 */
export function getDefaultInputToken(chainId: number): Token | undefined {
  return getNativeToken(chainId)
}

/**
 * Get default output token for a chain
 * - Lux chains: LUSD
 * - Zoo chains: WZOO
 * - Ethereum: USDC
 */
export function getDefaultOutputToken(chainId: number): Token | undefined {
  if (isLuxChain(chainId)) {
    return getTokenBySymbol(chainId, "LUSD")
  }
  if (isZooChain(chainId)) {
    return getTokenBySymbol(chainId, "WZOO")
  }
  // Ethereum/Sepolia
  return getTokenBySymbol(chainId, "USDC")
}

/**
 * Get default token pair for a chain
 */
export function getDefaultTokenPair(
  chainId: number
): { input: Token; output: Token } | undefined {
  const input = getDefaultInputToken(chainId)
  const output = getDefaultOutputToken(chainId)

  if (!input || !output) return undefined

  return { input, output }
}

/**
 * Search tokens by query (symbol or name)
 */
export function searchTokens(chainId: number, query: string): Token[] {
  const tokens = getTokensForChain(chainId)
  const lowerQuery = query.toLowerCase().trim()

  if (!lowerQuery) return tokens

  return tokens.filter(
    (t) =>
      t.symbol.toLowerCase().includes(lowerQuery) ||
      t.name.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Format token amount with proper decimals
 */
export function formatTokenAmount(
  amount: bigint,
  decimals: number,
  displayDecimals = 4
): string {
  const divisor = BigInt(10 ** decimals)
  const integerPart = amount / divisor
  const remainder = amount % divisor

  const fractionalStr = remainder.toString().padStart(decimals, "0")
  const truncatedFractional = fractionalStr.slice(0, displayDecimals)

  if (parseInt(truncatedFractional) === 0) {
    return integerPart.toString()
  }

  return `${integerPart}.${truncatedFractional.replace(/0+$/, "")}`
}

/**
 * Parse token amount string to bigint
 */
export function parseTokenAmount(amount: string, decimals: number): bigint {
  if (!amount || amount === "") return BigInt(0)

  const [integerPart, fractionalPart = ""] = amount.split(".")
  const paddedFractional = fractionalPart.padEnd(decimals, "0").slice(0, decimals)

  return BigInt(integerPart + paddedFractional)
}

/**
 * Check if two tokens are the same
 */
export function isSameToken(tokenA: Token, tokenB: Token): boolean {
  if (tokenA.chainId !== tokenB.chainId) return false
  if (tokenA.isNative && tokenB.isNative) return true
  if (tokenA.address === null || tokenB.address === null) return false
  return tokenA.address.toLowerCase() === tokenB.address.toLowerCase()
}

/**
 * Get display address for a token (shortened)
 */
export function getDisplayAddress(token: Token): string {
  if (token.isNative || !token.address) return "Native"
  return `${token.address.slice(0, 6)}...${token.address.slice(-4)}`
}
