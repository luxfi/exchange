/**
 * Environment configuration
 */

export const ENV = {
  // Chain IDs
  DEFAULT_CHAIN_ID: parseInt(process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID || '96369'),

  // API URLs
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.lux.exchange',

  // RPC URLs
  LUX_MAINNET_RPC: process.env.NEXT_PUBLIC_LUX_MAINNET_RPC || 'https://api.lux.network/rpc',
  LUX_TESTNET_RPC: process.env.NEXT_PUBLIC_LUX_TESTNET_RPC || 'https://api.lux-test.network/rpc',
  ZOO_MAINNET_RPC: process.env.NEXT_PUBLIC_ZOO_MAINNET_RPC || 'https://api.zoo.network/rpc',
  ZOO_TESTNET_RPC: process.env.NEXT_PUBLIC_ZOO_TESTNET_RPC || 'https://api.zoo-test.network/rpc',

  // Feature flags
  ENABLE_TESTNET: process.env.NEXT_PUBLIC_ENABLE_TESTNET === 'true',
  ENABLE_DEX_PRECOMPILES: process.env.NEXT_PUBLIC_ENABLE_DEX_PRECOMPILES === 'true',
  ENABLE_CROSS_CHAIN: process.env.NEXT_PUBLIC_ENABLE_CROSS_CHAIN === 'true',

  // WalletConnect
  WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
} as const

export type Env = typeof ENV
