/**
 * Lux Exchange - Environment Configuration
 *
 * Provides environment-aware configuration for:
 * - RPC endpoints (local, testnet, mainnet)
 * - G-Chain GraphQL endpoints
 * - Contract addresses
 * - Feature flags
 */

// =============================================================================
// TYPES
// =============================================================================

export interface ChainConfig {
  id: number
  name: string
  rpcUrl: string
  wsUrl?: string
  graphqlUrl?: string
  blockExplorer?: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
}

export interface ContractAddresses {
  wlux: `0x${string}` | null
  lusd: `0x${string}` | null
  weth: `0x${string}` | null
  factory: `0x${string}` | null
  router: `0x${string}` | null
  multicall: `0x${string}` | null
  // Pairs
  wluxLusdPair?: `0x${string}` | null
  wluxWethPair?: `0x${string}` | null
}

export interface Config {
  environment: "local" | "testnet" | "mainnet"
  chain: ChainConfig
  contracts: ContractAddresses
  gchain: {
    enabled: boolean
    graphqlUrl: string
  }
  features: {
    enableTestnets: boolean
    enableLocal: boolean
  }
}

// =============================================================================
// CHAIN CONFIGURATIONS
// =============================================================================

export const CHAIN_CONFIGS: Record<number, ChainConfig> = {
  // Local Development (Anvil/Hardhat)
  31337: {
    id: 31337,
    name: "Lux Local",
    rpcUrl: "http://localhost:9650/ext/bc/C/rpc",
    wsUrl: "ws://localhost:9650/ext/bc/C/ws",
    graphqlUrl: "http://localhost:9650/ext/bc/G/graphql",
    nativeCurrency: {
      name: "LUX",
      symbol: "LUX",
      decimals: 18,
    },
  },

  // Lux Testnet
  96368: {
    id: 96368,
    name: "Lux Testnet",
    rpcUrl: "https://api.lux-test.network/rpc",
    wsUrl: "wss://api.lux-test.network/ws",
    graphqlUrl: "https://api.lux-test.network/graphql",
    blockExplorer: "https://explorer.lux-test.network",
    nativeCurrency: {
      name: "LUX",
      symbol: "LUX",
      decimals: 18,
    },
  },

  // Lux Mainnet
  96369: {
    id: 96369,
    name: "Lux Network",
    rpcUrl: "https://api.lux.network/rpc",
    wsUrl: "wss://api.lux.network/ws",
    graphqlUrl: "https://api.lux.network/graphql",
    blockExplorer: "https://explorer.lux.network",
    nativeCurrency: {
      name: "LUX",
      symbol: "LUX",
      decimals: 18,
    },
  },

  // Zoo Network
  200200: {
    id: 200200,
    name: "Zoo Network",
    rpcUrl: "https://api.zoo.network/rpc",
    wsUrl: "wss://api.zoo.network/ws",
    graphqlUrl: "https://api.zoo.network/graphql",
    blockExplorer: "https://explorer.zoo.network",
    nativeCurrency: {
      name: "ZOO",
      symbol: "ZOO",
      decimals: 18,
    },
  },
}

// =============================================================================
// CONTRACT ADDRESSES BY CHAIN
// =============================================================================

/**
 * Contract addresses per chain
 * Local addresses are loaded from environment or .local-deployments.json
 */
export const CONTRACT_ADDRESSES: Record<number, ContractAddresses> = {
  // Local - loaded from environment
  31337: {
    wlux: getEnvAddress("NEXT_PUBLIC_WLUX_ADDRESS"),
    lusd: getEnvAddress("NEXT_PUBLIC_LUSD_ADDRESS"),
    weth: getEnvAddress("NEXT_PUBLIC_WETH_ADDRESS"),
    factory: getEnvAddress("NEXT_PUBLIC_V2_FACTORY_ADDRESS"),
    router: getEnvAddress("NEXT_PUBLIC_V2_ROUTER_ADDRESS"),
    multicall: getEnvAddress("NEXT_PUBLIC_MULTICALL_ADDRESS"),
  },

  // Lux Testnet
  96368: {
    wlux: "0x1234567890123456789012345678901234567890", // TODO: Deploy
    lusd: "0x1234567890123456789012345678901234567891",
    weth: "0x1234567890123456789012345678901234567892",
    factory: "0x1234567890123456789012345678901234567893",
    router: "0x1234567890123456789012345678901234567894",
    multicall: "0x1234567890123456789012345678901234567895",
  },

  // Lux Mainnet
  96369: {
    wlux: null, // TODO: Deploy
    lusd: null,
    weth: null,
    factory: null,
    router: null,
    multicall: null,
  },
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get address from environment variable
 */
function getEnvAddress(key: string): `0x${string}` | null {
  if (typeof process === "undefined") return null

  const value = process.env[key]
  if (!value || value === "") return null

  // Validate it looks like an address
  if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
    console.warn(`Invalid address in ${key}: ${value}`)
    return null
  }

  return value as `0x${string}`
}

/**
 * Detect current environment
 */
export function detectEnvironment(): "local" | "testnet" | "mainnet" {
  const chainId = getChainId()

  if (chainId === 31337) return "local"
  if (chainId === 96368) return "testnet"
  if (chainId === 96369) return "mainnet"

  // Default based on NODE_ENV
  if (process.env.NODE_ENV === "development") return "local"
  if (process.env.NODE_ENV === "test") return "testnet"

  return "mainnet"
}

/**
 * Get current chain ID from environment
 */
export function getChainId(): number {
  const envChainId = process.env.NEXT_PUBLIC_CHAIN_ID

  if (envChainId) {
    const parsed = parseInt(envChainId, 10)
    if (!isNaN(parsed)) return parsed
  }

  // Default to local
  return 31337
}

/**
 * Get chain config for a specific chain ID
 */
export function getChainConfig(chainId: number): ChainConfig | null {
  return CHAIN_CONFIGS[chainId] ?? null
}

/**
 * Get contract addresses for a specific chain ID
 */
export function getContractAddresses(chainId: number): ContractAddresses | null {
  return CONTRACT_ADDRESSES[chainId] ?? null
}

/**
 * Get full configuration for current environment
 */
export function getConfig(): Config {
  const environment = detectEnvironment()
  const chainId = getChainId()

  const chain = getChainConfig(chainId) ?? CHAIN_CONFIGS[31337]
  const contracts = getContractAddresses(chainId) ?? CONTRACT_ADDRESSES[31337]

  // Override RPC URL from environment if set
  if (process.env.NEXT_PUBLIC_LOCAL_RPC_URL && chainId === 31337) {
    chain.rpcUrl = process.env.NEXT_PUBLIC_LOCAL_RPC_URL
  } else if (process.env.NEXT_PUBLIC_LUX_RPC_URL) {
    chain.rpcUrl = process.env.NEXT_PUBLIC_LUX_RPC_URL
  }

  // G-Chain configuration
  const gchainUrl =
    process.env.NEXT_PUBLIC_GCHAIN_GRAPHQL_URL ??
    process.env.NEXT_PUBLIC_LOCAL_GCHAIN_URL ??
    chain.graphqlUrl ??
    ""

  return {
    environment,
    chain,
    contracts,
    gchain: {
      enabled: gchainUrl !== "",
      graphqlUrl: gchainUrl,
    },
    features: {
      enableTestnets: process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true",
      enableLocal: process.env.NEXT_PUBLIC_ENABLE_LOCAL === "true",
    },
  }
}

// =============================================================================
// G-CHAIN GRAPHQL CLIENT
// =============================================================================

export interface GChainQueryResult<T = unknown> {
  data: T | null
  errors?: Array<{ message: string }>
}

/**
 * Execute a GraphQL query against G-Chain
 */
export async function gchainQuery<T = unknown>(
  query: string,
  variables?: Record<string, unknown>
): Promise<GChainQueryResult<T>> {
  const config = getConfig()

  if (!config.gchain.enabled) {
    return { data: null, errors: [{ message: "G-Chain not enabled" }] }
  }

  try {
    const response = await fetch(config.gchain.graphqlUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    })

    if (!response.ok) {
      return {
        data: null,
        errors: [{ message: `HTTP ${response.status}: ${response.statusText}` }],
      }
    }

    const result = await response.json()
    return result as GChainQueryResult<T>
  } catch (error) {
    return {
      data: null,
      errors: [{ message: error instanceof Error ? error.message : "Unknown error" }],
    }
  }
}

// =============================================================================
// GRAPHQL QUERIES FOR G-CHAIN
// =============================================================================

export const GCHAIN_QUERIES = {
  // Get all tokens
  tokens: `
    query GetTokens {
      tokens {
        id
        symbol
        name
        decimals
        totalSupply
      }
    }
  `,

  // Get all pairs
  pairs: `
    query GetPairs {
      pairs {
        id
        token0 { id symbol name decimals }
        token1 { id symbol name decimals }
        reserve0
        reserve1
        totalSupply
      }
    }
  `,

  // Get recent swaps
  recentSwaps: `
    query GetRecentSwaps($first: Int = 10) {
      swaps(first: $first, orderBy: timestamp, orderDirection: desc) {
        id
        pair { id token0 { symbol } token1 { symbol } }
        sender
        amount0In
        amount1In
        amount0Out
        amount1Out
        to
        timestamp
      }
    }
  `,

  // Get swaps for address
  swapsForAddress: `
    query GetSwapsForAddress($address: String!) {
      swaps(where: { or: [{ sender: $address }, { to: $address }] }) {
        id
        pair { id token0 { symbol } token1 { symbol } }
        sender
        amount0In
        amount1In
        amount0Out
        amount1Out
        to
        timestamp
      }
    }
  `,

  // Get liquidity positions
  liquidityPositions: `
    query GetLiquidityPositions($user: String!) {
      mints(where: { sender: $user }) {
        id
        pair { id token0 { symbol } token1 { symbol } }
        sender
        amount0
        amount1
        liquidity
        timestamp
      }
      burns(where: { sender: $user }) {
        id
        pair { id token0 { symbol } token1 { symbol } }
        sender
        amount0
        amount1
        liquidity
        to
        timestamp
      }
    }
  `,
}

// =============================================================================
// EXPORTS
// =============================================================================

export default getConfig
