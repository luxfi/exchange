"use client"

import * as React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider, createConfig, http } from "wagmi"
import { mainnet, sepolia } from "wagmi/chains"
import { injected, walletConnect } from "wagmi/connectors"

// Define Lux chains
const luxMainnet = {
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
} as const

const luxTestnet = {
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
} as const

const zooMainnet = {
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
} as const

// Wagmi config
const config = createConfig({
  chains: [luxMainnet, luxTestnet, zooMainnet, mainnet, sepolia],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
    }),
  ],
  transports: {
    [luxMainnet.id]: http(),
    [luxTestnet.id]: http(),
    [zooMainnet.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

// React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60, // 1 hour
    },
  },
})

interface Web3ProviderProps {
  children: React.ReactNode
}

export function Web3Provider({ children }: Web3ProviderProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
