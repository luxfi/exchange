import { defineChain } from 'viem'

export const luxMainnet = defineChain({
  id: 96369,
  name: 'Lux',
  nativeCurrency: { name: 'LUX', symbol: 'LUX', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api.lux.network/mainnet/ext/bc/C/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Lux Explorer', url: 'https://explore.lux.network' },
  },
})

// P-Chain API endpoints (not EVM — direct RPC)
export const PLATFORM_API = {
  mainnet: 'https://api.lux.network/mainnet/ext/bc/P',
  testnet: 'https://api.lux.network/testnet/ext/bc/P',
  devnet: 'https://api.lux.network/devnet/ext/bc/P',
} as const

export const INFO_API = {
  mainnet: 'https://api.lux.network/mainnet/ext/info',
  testnet: 'https://api.lux.network/testnet/ext/info',
  devnet: 'https://api.lux.network/devnet/ext/info',
} as const
