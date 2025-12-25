/**
 * Lux Exchange - Chain Definitions
 *
 * Defines all supported chains with Lux/Zoo as primary networks.
 * Chain order matters - Lux chains appear first in all selectors.
 */

import type { Chain } from "wagmi/chains"

// =============================================================================
// LUX CHAINS (PRIMARY)
// =============================================================================

export const luxMainnet = {
  id: 96369,
  name: "Lux Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "LUX",
    symbol: "LUX",
  },
  rpcUrls: {
    default: { http: ["https://api.lux.network/rpc"] },
    public: { http: ["https://api.lux.network/rpc"] },
  },
  blockExplorers: {
    default: { name: "Lux Explorer", url: "https://explore.lux.network" },
  },
} as const satisfies Chain

export const luxTestnet = {
  id: 96368,
  name: "Lux Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "LUX",
    symbol: "LUX",
  },
  rpcUrls: {
    default: { http: ["https://api.lux-test.network/rpc"] },
    public: { http: ["https://api.lux-test.network/rpc"] },
  },
  blockExplorers: {
    default: { name: "Lux Explorer", url: "https://explore.lux-test.network" },
  },
  testnet: true,
} as const satisfies Chain

// =============================================================================
// ZOO CHAINS
// =============================================================================

export const zooMainnet = {
  id: 200200,
  name: "Zoo Network",
  nativeCurrency: {
    decimals: 18,
    name: "ZOO",
    symbol: "ZOO",
  },
  rpcUrls: {
    default: { http: ["https://api.zoo.network/rpc"] },
    public: { http: ["https://api.zoo.network/rpc"] },
  },
  blockExplorers: {
    default: { name: "Zoo Explorer", url: "https://explore.zoo.network" },
  },
} as const satisfies Chain

export const zooTestnet = {
  id: 200201,
  name: "Zoo Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "ZOO",
    symbol: "ZOO",
  },
  rpcUrls: {
    default: { http: ["https://api.zoo-test.network/rpc"] },
    public: { http: ["https://api.zoo-test.network/rpc"] },
  },
  blockExplorers: {
    default: { name: "Zoo Explorer", url: "https://explore.zoo-test.network" },
  },
  testnet: true,
} as const satisfies Chain

// =============================================================================
// ETHEREUM CHAINS (for bridging reference)
// =============================================================================

export const ethereum = {
  id: 1,
  name: "Ethereum",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["https://eth.llamarpc.com"] },
    public: { http: ["https://eth.llamarpc.com"] },
  },
  blockExplorers: {
    default: { name: "Etherscan", url: "https://etherscan.io" },
  },
} as const satisfies Chain

export const sepolia = {
  id: 11155111,
  name: "Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Sepolia Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["https://rpc.sepolia.org"] },
    public: { http: ["https://rpc.sepolia.org"] },
  },
  blockExplorers: {
    default: { name: "Etherscan", url: "https://sepolia.etherscan.io" },
  },
  testnet: true,
} as const satisfies Chain

// =============================================================================
// CHAIN LISTS
// =============================================================================

/**
 * All supported chains in priority order.
 * Lux/Zoo chains appear first as they are the primary networks.
 */
export const SUPPORTED_CHAINS = [
  luxMainnet,
  zooMainnet,
  luxTestnet,
  zooTestnet,
  ethereum,
  sepolia,
] as const

/**
 * Mainnet chains only (no testnets)
 */
export const MAINNET_CHAINS = [luxMainnet, zooMainnet, ethereum] as const

/**
 * Testnet chains only
 */
export const TESTNET_CHAINS = [luxTestnet, zooTestnet, sepolia] as const

/**
 * Lux ecosystem chains (Lux + Zoo)
 */
export const LUX_ECOSYSTEM_CHAINS = [
  luxMainnet,
  zooMainnet,
  luxTestnet,
  zooTestnet,
] as const

// =============================================================================
// CHAIN UTILITIES
// =============================================================================

/**
 * Chain ID to chain mapping for quick lookup
 */
export const CHAIN_BY_ID: Record<number, Chain> = {
  [luxMainnet.id]: luxMainnet,
  [luxTestnet.id]: luxTestnet,
  [zooMainnet.id]: zooMainnet,
  [zooTestnet.id]: zooTestnet,
  [ethereum.id]: ethereum,
  [sepolia.id]: sepolia,
}

/**
 * Get chain by ID
 */
export function getChainById(chainId: number): Chain | undefined {
  return CHAIN_BY_ID[chainId]
}

/**
 * Check if chain is a Lux ecosystem chain
 */
export function isLuxEcosystem(chainId: number): boolean {
  const luxEcosystemIds: number[] = [luxMainnet.id, luxTestnet.id, zooMainnet.id, zooTestnet.id]
  return luxEcosystemIds.includes(chainId)
}

/**
 * Check if chain is a Lux chain (not Zoo)
 */
export function isLuxChain(chainId: number): boolean {
  const luxChainIds: number[] = [luxMainnet.id, luxTestnet.id]
  return luxChainIds.includes(chainId)
}

/**
 * Check if chain is a Zoo chain
 */
export function isZooChain(chainId: number): boolean {
  const zooChainIds: number[] = [zooMainnet.id, zooTestnet.id]
  return zooChainIds.includes(chainId)
}

/**
 * Check if chain is a testnet
 */
export function isTestnet(chainId: number): boolean {
  const testnetIds: number[] = [luxTestnet.id, zooTestnet.id, sepolia.id]
  return testnetIds.includes(chainId)
}

/**
 * Get the default chain (Lux Mainnet)
 */
export function getDefaultChain(): Chain {
  return luxMainnet
}

/**
 * Get chain icon path
 */
export function getChainIcon(chainId: number): string {
  switch (chainId) {
    case luxMainnet.id:
    case luxTestnet.id:
      return "/tokens/lux.svg"
    case zooMainnet.id:
    case zooTestnet.id:
      return "/tokens/zoo.svg"
    case ethereum.id:
    case sepolia.id:
      return "/tokens/eth.svg"
    default:
      return "/tokens/default.svg"
  }
}

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type SupportedChainId = (typeof SUPPORTED_CHAINS)[number]["id"]
