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

export const zooMainnet = defineChain({
  id: 200200,
  name: 'Zoo',
  nativeCurrency: { name: 'ZOO', symbol: 'ZOO', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api.lux.network/mainnet/ext/bc/zoo/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Zoo Explorer', url: 'https://explore-zoo.lux.network' },
  },
})

export const hanzoMainnet = defineChain({
  id: 36963,
  name: 'Hanzo',
  nativeCurrency: { name: 'HANZO', symbol: 'HNZ', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api.lux.network/mainnet/ext/bc/hanzo/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Hanzo Explorer', url: 'https://explore-hanzo.lux.network' },
  },
})

export const spcMainnet = defineChain({
  id: 36911,
  name: 'SPC',
  nativeCurrency: { name: 'SPC', symbol: 'SPC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api.lux.network/mainnet/ext/bc/spc/rpc'] },
  },
  blockExplorers: {
    default: { name: 'SPC Explorer', url: 'https://explore-spc.lux.network' },
  },
})

export const parsMainnet = defineChain({
  id: 494949,
  name: 'Pars',
  nativeCurrency: { name: 'PARS', symbol: 'PARS', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api.lux.network/mainnet/ext/bc/pars/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Pars Explorer', url: 'https://explore-pars.lux.network' },
  },
})

export const supportedChains = [luxMainnet, zooMainnet, hanzoMainnet, spcMainnet, parsMainnet] as const

/** Map chain ID to Explorer API base URL */
export const EXPLORER_API: Record<number, string> = {
  96369: 'https://explore.lux.network/api/v2',
  200200: 'https://explore-zoo.lux.network/api/v2',
  36963: 'https://explore-hanzo.lux.network/api/v2',
  36911: 'https://explore-spc.lux.network/api/v2',
  494949: 'https://explore-pars.lux.network/api/v2',
}

/** Chain display info for UI */
export const CHAIN_INFO: Record<number, { name: string; symbol: string; color: string }> = {
  96369: { name: 'Lux', symbol: 'LUX', color: '#E8E8E8' },
  200200: { name: 'Zoo', symbol: 'ZOO', color: '#7C5CFC' },
  36963: { name: 'Hanzo', symbol: 'HNZ', color: '#FF6B35' },
  36911: { name: 'SPC', symbol: 'SPC', color: '#00C2FF' },
  494949: { name: 'Pars', symbol: 'PARS', color: '#FFD700' },
}
