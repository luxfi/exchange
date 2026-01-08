import type { Address } from 'viem'

/**
 * Token type definition
 */
export interface Token {
  address: Address
  chainId: number
  decimals: number
  symbol: string
  name: string
  logoURI?: string
  isNative?: boolean
}

/**
 * Native tokens
 */
export const NATIVE_LUX: Token = {
  address: '0x0000000000000000000000000000000000000000',
  chainId: 96369,
  decimals: 18,
  symbol: 'LUX',
  name: 'LUX',
  isNative: true,
}

export const NATIVE_ZOO: Token = {
  address: '0x0000000000000000000000000000000000000000',
  chainId: 200200,
  decimals: 18,
  symbol: 'ZOO',
  name: 'ZOO',
  isNative: true,
}

/**
 * Wrapped native tokens
 */
export const WLUX_MAINNET: Token = {
  address: '0x55750d6CA62a041c06a8E28626b10Be6c688f471',
  chainId: 96369,
  decimals: 18,
  symbol: 'WLUX',
  name: 'Wrapped LUX',
}

export const WLUX_TESTNET: Token = {
  address: '0x732740c5c895C9FCF619930ed4293fc858eb44c7',
  chainId: 96368,
  decimals: 18,
  symbol: 'WLUX',
  name: 'Wrapped LUX',
}

export const WLUX_DEV: Token = {
  // Deterministic CREATE address from DeployFullStack.s.sol (nonce 0)
  address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  chainId: 1337,
  decimals: 18,
  symbol: 'WLUX',
  name: 'Wrapped LUX',
}

/**
 * Stablecoins
 */
export const LUSD: Token = {
  address: '0x4B1BfA76eD63F1A0aD2E4f40b3F46C45E8F7A4E2',
  chainId: 96369,
  decimals: 6, // USDC-compatible decimals
  symbol: 'LUSD',
  name: 'Lux Dollar',
}

/**
 * Bridge tokens (L-prefix for assets bridged to Lux)
 * These are the canonical mainnet addresses from @luxfi/config
 */
export const LETH: Token = {
  address: '0xAA3AE95816a4A6FbC6b8Ed5a6C06f22A96A80C8C',
  chainId: 96369,
  decimals: 18,
  symbol: 'LETH',
  name: 'Lux ETH',
}

export const LBTC: Token = {
  address: '0x526903E35E7106D62ED3B5d77E14e51d024Aa1D3',
  chainId: 96369,
  decimals: 8,
  symbol: 'LBTC',
  name: 'Lux BTC',
}

/**
 * Testnet bridge tokens
 */
export const LETH_TESTNET: Token = {
  address: '0x60E0a8167FC13dE89348978860466C9ceC24B9ba',
  chainId: 96368,
  decimals: 18,
  symbol: 'LETH',
  name: 'Lux ETH',
}

export const LBTC_TESTNET: Token = {
  address: '0x1E48D32a4F5e9f08DB9aE4959163300FaF8A6C8e',
  chainId: 96368,
  decimals: 8,
  symbol: 'LBTC',
  name: 'Lux BTC',
}

export const LUSD_TESTNET: Token = {
  address: '0xb84112ac9318a0b2319aa11d4d10e9762b25f7f4',
  chainId: 96368,
  decimals: 18,
  symbol: 'LUSD',
  name: 'Lux Dollar',
}

/**
 * Dev mode bridge tokens (deterministic CREATE addresses)
 */
export const LETH_DEV: Token = {
  address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  chainId: 1337,
  decimals: 18,
  symbol: 'LETH',
  name: 'Lux ETH',
}

export const LBTC_DEV: Token = {
  address: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  chainId: 1337,
  decimals: 8,
  symbol: 'LBTC',
  name: 'Lux BTC',
}

export const LUSD_DEV: Token = {
  address: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
  chainId: 1337,
  decimals: 6,
  symbol: 'LUSD',
  name: 'Lux Dollar',
}

/**
 * Major tokens on Lux Mainnet
 */
export const USDC_LUX: Token = {
  address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  chainId: 96369,
  decimals: 6,
  symbol: 'USDC',
  name: 'USD Coin',
}

export const USDT_LUX: Token = {
  address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  chainId: 96369,
  decimals: 6,
  symbol: 'USDT',
  name: 'Tether USD',
}

export const WETH_LUX: Token = {
  address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  chainId: 96369,
  decimals: 18,
  symbol: 'WETH',
  name: 'Wrapped Ether',
}

export const WBTC_LUX: Token = {
  address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  chainId: 96369,
  decimals: 8,
  symbol: 'WBTC',
  name: 'Wrapped Bitcoin',
}

export const DAI_LUX: Token = {
  address: '0x6B175474E89094C44Da98b954EesdscdKD34eL55',
  chainId: 96369,
  decimals: 18,
  symbol: 'DAI',
  name: 'Dai Stablecoin',
}

/**
 * Zoo chain tokens
 */
export const WZOO: Token = {
  address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  chainId: 200200,
  decimals: 18,
  symbol: 'WZOO',
  name: 'Wrapped ZOO',
}

export const USDC_ZOO: Token = {
  address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  chainId: 200200,
  decimals: 6,
  symbol: 'USDC',
  name: 'USD Coin',
}

export const USDT_ZOO: Token = {
  address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  chainId: 200200,
  decimals: 6,
  symbol: 'USDT',
  name: 'Tether USD',
}

export const WETH_ZOO: Token = {
  address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  chainId: 200200,
  decimals: 18,
  symbol: 'WETH',
  name: 'Wrapped Ether',
}

/**
 * Default token list for Lux Mainnet
 */
export const LUX_MAINNET_TOKENS: Token[] = [
  NATIVE_LUX,
  WLUX_MAINNET,
  USDC_LUX,
  USDT_LUX,
  WETH_LUX,
  WBTC_LUX,
  DAI_LUX,
  LETH,
  LBTC,
  LUSD,
]

/**
 * Default token list for Zoo Mainnet
 */
export const ZOO_MAINNET_TOKENS: Token[] = [
  NATIVE_ZOO,
  WZOO,
  USDC_ZOO,
  USDT_ZOO,
  WETH_ZOO,
]

/**
 * Default token list for Lux Testnet
 */
export const LUX_TESTNET_TOKENS: Token[] = [
  WLUX_TESTNET,
  LETH_TESTNET,
  LBTC_TESTNET,
  LUSD_TESTNET,
]

/**
 * Default token list for Lux Dev
 */
export const LUX_DEV_TOKENS: Token[] = [
  WLUX_DEV,
  LETH_DEV,
  LBTC_DEV,
  LUSD_DEV,
]

/**
 * Get tokens for a chain
 */
export function getTokensForChain(chainId: number): Token[] {
  switch (chainId) {
    case 96369:
      return LUX_MAINNET_TOKENS
    case 96368:
      return LUX_TESTNET_TOKENS
    case 1337:
      return LUX_DEV_TOKENS
    case 200200:
      return ZOO_MAINNET_TOKENS
    default:
      return []
  }
}

/**
 * Get wrapped native token for chain
 */
export function getWrappedNative(chainId: number): Token | undefined {
  switch (chainId) {
    case 96369:
      return WLUX_MAINNET
    case 96368:
      return WLUX_TESTNET
    case 1337:
      return WLUX_DEV
    default:
      return undefined
  }
}

/**
 * Check if token is native
 */
export function isNativeToken(token: Token): boolean {
  return token.isNative === true || token.address === '0x0000000000000000000000000000000000000000'
}
