import { createConfig, http } from 'wagmi'
import { mainnet, avalanche, avalancheFuji } from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'
import { createClient } from 'viem'
import { createPublicClient, createWalletClient, custom } from 'viem'

// Define Lux X-Chain
export const luxXChain = {
  id: 9000,
  name: 'Lux X-Chain',
  network: 'lux-x',
  nativeCurrency: {
    decimals: 18,
    name: 'LUX',
    symbol: 'LUX',
  },
  rpcUrls: {
    default: {
      http: ['https://api.lux.network/ext/bc/X'],
      webSocket: ['wss://api.lux.network/ext/bc/X/ws'],
    },
    public: {
      http: ['https://api.lux.network/ext/bc/X'],
      webSocket: ['wss://api.lux.network/ext/bc/X/ws'],
    },
  },
  blockExplorers: {
    default: { name: 'Lux Explorer', url: 'https://explorer.lux.network' },
  },
  contracts: {
    dex: {
      address: '0x0000000000000000000000000000000000000000',
      blockCreated: 0,
    },
  },
} as const

// Define Lux C-Chain (EVM compatible)
export const luxCChain = {
  id: 9001,
  name: 'Lux C-Chain',
  network: 'lux-c',
  nativeCurrency: {
    decimals: 18,
    name: 'LUX',
    symbol: 'LUX',
  },
  rpcUrls: {
    default: {
      http: ['https://api.lux.network/ext/bc/C/rpc'],
      webSocket: ['wss://api.lux.network/ext/bc/C/ws'],
    },
    public: {
      http: ['https://api.lux.network/ext/bc/C/rpc'],
      webSocket: ['wss://api.lux.network/ext/bc/C/ws'],
    },
  },
  blockExplorers: {
    default: { name: 'Lux Explorer', url: 'https://explorer.lux.network' },
  },
} as const

// Create wagmi config
export const wagmiConfig = createConfig({
  chains: [luxXChain, luxCChain, avalanche, avalancheFuji, mainnet],
  connectors: [
    injected({
      target() {
        return {
          id: 'luxwallet',
          name: 'LuxWallet',
          provider: typeof window !== 'undefined' ? (window as any).luxwallet : undefined,
        }
      },
    }),
    injected(),
    walletConnect({ 
      projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || '',
    }),
    coinbaseWallet({
      appName: 'LUX DEX',
      appLogoUrl: 'https://lux.network/logo.png',
    }),
  ],
  transports: {
    [luxXChain.id]: http(),
    [luxCChain.id]: http(),
    [avalanche.id]: http(),
    [avalancheFuji.id]: http(),
    [mainnet.id]: http(),
  },
})

// Create viem clients
export const publicClient = createPublicClient({
  chain: luxXChain,
  transport: http(),
})

export const walletClient = createWalletClient({
  chain: luxXChain,
  transport: custom((window as any).luxwallet || (window as any).ethereum),
})