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
    default: { http: ["https://api.lux.network/mainnet/ext/bc/C/rpc"] },
    public: { http: ["https://api.lux.network/mainnet/ext/bc/C/rpc"] },
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
    default: { http: ["https://api.lux.network/testnet/ext/bc/C/rpc"] },
    public: { http: ["https://api.lux.network/testnet/ext/bc/C/rpc"] },
  },
  blockExplorers: {
    default: { name: "Lux Explorer", url: "https://explore.lux-test.network" },
  },
  testnet: true,
} as const satisfies Chain

export const luxDev = {
  id: 1337,
  name: "Lux Dev",
  nativeCurrency: {
    decimals: 18,
    name: "LUX",
    symbol: "LUX",
  },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545/ext/bc/C/rpc"] },
    public: { http: ["http://127.0.0.1:8545/ext/bc/C/rpc"] },
  },
  blockExplorers: {
    default: { name: "Dev Explorer", url: "http://localhost:4000" },
  },
  testnet: false,
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
// SUBNET CHAINS
// =============================================================================

export const hanzoMainnet = {
  id: 36963,
  name: "Hanzo Network",
  nativeCurrency: {
    decimals: 18,
    name: "HANZO",
    symbol: "HANZO",
  },
  rpcUrls: {
    default: { http: ["https://api.lux.network/mainnet/ext/bc/2GiQb73CeJESjc4omFv2YtQHZrRgJf25NXPzAr5J6UNHRcDV2F/rpc"] },
    public: { http: ["https://api.lux.network/mainnet/ext/bc/2GiQb73CeJESjc4omFv2YtQHZrRgJf25NXPzAr5J6UNHRcDV2F/rpc"] },
  },
  blockExplorers: {
    default: { name: "Hanzo Explorer", url: "https://explore-hanzo.lux.network" },
  },
} as const satisfies Chain

export const spcMainnet = {
  id: 36911,
  name: "SPC Network",
  nativeCurrency: {
    decimals: 18,
    name: "SPC",
    symbol: "SPC",
  },
  rpcUrls: {
    default: { http: ["https://api.lux.network/mainnet/ext/bc/rtjwvtE1tEvrokmpeYdTq7b2zqZgmybKwR5MLjKMGAR1W78dQ/rpc"] },
    public: { http: ["https://api.lux.network/mainnet/ext/bc/rtjwvtE1tEvrokmpeYdTq7b2zqZgmybKwR5MLjKMGAR1W78dQ/rpc"] },
  },
  blockExplorers: {
    default: { name: "SPC Explorer", url: "https://explore-spc.lux.network" },
  },
} as const satisfies Chain

export const parsMainnet = {
  id: 494949,
  name: "Pars Network",
  nativeCurrency: {
    decimals: 18,
    name: "PARS",
    symbol: "PARS",
  },
  rpcUrls: {
    default: { http: ["https://api.lux.network/mainnet/ext/bc/2pUskxqaL5Bpx7uRUGG1fDjPckjxQ4UKX4sLKeaS1NdSVBJd3F/rpc"] },
    public: { http: ["https://api.lux.network/mainnet/ext/bc/2pUskxqaL5Bpx7uRUGG1fDjPckjxQ4UKX4sLKeaS1NdSVBJd3F/rpc"] },
  },
  blockExplorers: {
    default: { name: "Pars Explorer", url: "https://explore-pars.lux.network" },
  },
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
  hanzoMainnet,
  spcMainnet,
  parsMainnet,
  luxTestnet,
  zooTestnet,
  ethereum,
  sepolia,
] as const

/**
 * Mainnet chains only (no testnets)
 */
export const MAINNET_CHAINS = [luxMainnet, zooMainnet, hanzoMainnet, spcMainnet, parsMainnet, ethereum] as const

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
  hanzoMainnet,
  spcMainnet,
  parsMainnet,
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
  [luxDev.id]: luxDev,
  [zooMainnet.id]: zooMainnet,
  [zooTestnet.id]: zooTestnet,
  [hanzoMainnet.id]: hanzoMainnet,
  [spcMainnet.id]: spcMainnet,
  [parsMainnet.id]: parsMainnet,
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
  const luxEcosystemIds: number[] = [luxMainnet.id, luxTestnet.id, zooMainnet.id, zooTestnet.id, hanzoMainnet.id, spcMainnet.id, parsMainnet.id]
  return luxEcosystemIds.includes(chainId)
}

/**
 * Check if chain is a Lux chain (not Zoo)
 */
export function isLuxChain(chainId: number): boolean {
  const luxChainIds: number[] = [luxMainnet.id, luxTestnet.id, luxDev.id]
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
    case luxDev.id:
      return "/tokens/lux.svg"
    case zooMainnet.id:
    case zooTestnet.id:
      return "/tokens/zoo.svg"
    case hanzoMainnet.id:
      return "/tokens/hanzo.svg"
    case spcMainnet.id:
      return "/tokens/spc.svg"
    case parsMainnet.id:
      return "/tokens/pars.svg"
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
