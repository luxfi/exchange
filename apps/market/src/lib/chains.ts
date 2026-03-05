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

export const supportedChains = [luxMainnet, zooMainnet] as const
