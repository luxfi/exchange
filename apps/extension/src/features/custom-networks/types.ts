/**
 * Custom Network Types
 * Support for wallet_addEthereumChain RPC method
 */

export interface CustomNetwork {
  chainId: string // Hex string (e.g., "0x1")
  chainName: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls: string[]
  blockExplorerUrls?: string[]
  iconUrls?: string[]
  isTestnet?: boolean
  addedAt: number // Timestamp
}

export interface AddEthereumChainParameter {
  chainId: string
  chainName: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls: string[]
  blockExplorerUrls?: string[]
  iconUrls?: string[]
}

export interface CustomNetworkState {
  networks: Record<string, CustomNetwork> // Keyed by chainId
  isLoading: boolean
  error: string | null
}

export interface SwitchEthereumChainParameter {
  chainId: string
}

// Validation helpers
export function isValidChainId(chainId: string): boolean {
  if (!chainId.startsWith('0x')) return false
  const parsed = parseInt(chainId, 16)
  return !isNaN(parsed) && parsed > 0
}

export function normalizeChainId(chainId: string | number): string {
  if (typeof chainId === 'number') {
    return '0x' + chainId.toString(16)
  }
  if (chainId.startsWith('0x')) {
    return chainId.toLowerCase()
  }
  return '0x' + parseInt(chainId, 10).toString(16)
}

export function chainIdToNumber(chainId: string): number {
  return parseInt(chainId, 16)
}

// Built-in networks that cannot be removed
export const BUILT_IN_CHAIN_IDS = new Set([
  '0x1', // Ethereum Mainnet
  '0x89', // Polygon
  '0xa4b1', // Arbitrum One
  '0xa', // Optimism
  '0x2105', // Base
  '0x38', // BNB Chain
  '0xa86a', // Avalanche
  '0xfa', // Fantom
  // Lux Network chains
  '0x1d51', // Lux Mainnet (7505)
  '0x1d52', // Lux Testnet (7506)
])

export function isBuiltInChain(chainId: string): boolean {
  return BUILT_IN_CHAIN_IDS.has(normalizeChainId(chainId))
}
