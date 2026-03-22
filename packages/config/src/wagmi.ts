import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { luxMainnet, luxTestnet, zooMainnet, zooTestnet, hanzoMainnet, spcMainnet, parsMainnet, liquidEvm } from './chains'

/**
 * Wagmi configuration for Lux Exchange
 */
export const wagmiConfig = createConfig({
  chains: [luxMainnet, zooMainnet, hanzoMainnet, spcMainnet, parsMainnet, liquidEvm, luxTestnet, zooTestnet, mainnet, sepolia],
  transports: {
    // Lux C-Chain
    [luxMainnet.id]: http(luxMainnet.rpcUrls.default.http[0]),
    [luxTestnet.id]: http(luxTestnet.rpcUrls.default.http[0]),
    // Subnet chains
    [zooMainnet.id]: http(zooMainnet.rpcUrls.default.http[0]),
    [zooTestnet.id]: http(zooTestnet.rpcUrls.default.http[0]),
    [hanzoMainnet.id]: http(hanzoMainnet.rpcUrls.default.http[0]),
    [spcMainnet.id]: http(spcMainnet.rpcUrls.default.http[0]),
    [parsMainnet.id]: http(parsMainnet.rpcUrls.default.http[0]),
    [liquidEvm.id]: http(liquidEvm.rpcUrls.default.http[0]),
    // Ethereum (for bridging)
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

export type WagmiConfig = typeof wagmiConfig
