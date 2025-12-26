import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { luxMainnet, luxTestnet, zooMainnet, zooTestnet } from './chains'

/**
 * Wagmi configuration for Lux Exchange
 */
export const wagmiConfig = createConfig({
  chains: [luxMainnet, luxTestnet, zooMainnet, zooTestnet, mainnet, sepolia],
  transports: {
    // Lux chains
    [luxMainnet.id]: http('https://api.lux.network/rpc'),
    [luxTestnet.id]: http('https://api.lux-test.network/rpc'),
    [zooMainnet.id]: http('https://api.zoo.network/rpc'),
    [zooTestnet.id]: http('https://api.zoo-test.network/rpc'),
    // Ethereum (for bridging)
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

export type WagmiConfig = typeof wagmiConfig
