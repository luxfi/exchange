"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider, createConfig, http } from "wagmi"
import { mainnet, sepolia } from "wagmi/chains"
import { injected, walletConnect } from "wagmi/connectors"
import type { Chain } from "wagmi/chains"

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
} as const satisfies Chain

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
} as const satisfies Chain

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
} as const satisfies Chain

// Wagmi config - created outside component to prevent recreation
function createWagmiConfig() {
  return createConfig({
    chains: [luxMainnet, luxTestnet, zooMainnet, mainnet, sepolia],
    connectors: [
      injected(),
      walletConnect({
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo",
      }),
    ],
    transports: {
      [luxMainnet.id]: http(),
      [luxTestnet.id]: http(),
      [zooMainnet.id]: http(),
      [mainnet.id]: http(),
      [sepolia.id]: http(),
    },
    ssr: true, // Enable SSR mode to prevent hydration issues
  })
}

// Create query client with SSR-safe defaults
function createQueryClientInstance() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 60, // 1 hour
        refetchOnWindowFocus: false,
      },
    },
  })
}

interface Web3ProviderProps {
  children: React.ReactNode
}

export function Web3Provider({ children }: Web3ProviderProps) {
  // Use state to ensure stable instances across renders
  const [config] = React.useState(() => createWagmiConfig())
  const [queryClient] = React.useState(() => createQueryClientInstance())
  const [mounted, setMounted] = React.useState(false)

  // Handle SSR - only render provider after hydration
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // During SSR, render children without provider to avoid hydration mismatch
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

// Export chains for use elsewhere
export { luxMainnet, luxTestnet, zooMainnet }
