"use client"

import * as React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider, createConfig, http } from "wagmi"
import { injected, walletConnect } from "wagmi/connectors"
import {
  SUPPORTED_CHAINS,
  luxMainnet,
  luxTestnet,
  zooMainnet,
  zooTestnet,
  ethereum,
  sepolia,
} from "@/lib/chains"

// Wagmi config - created outside component to prevent recreation
function createWagmiConfig() {
  return createConfig({
    chains: SUPPORTED_CHAINS,
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
      [zooTestnet.id]: http(),
      [ethereum.id]: http(),
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

  // Always wrap children in providers - wagmi has ssr: true for hydration safety
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

// Re-export chains for use elsewhere
export {
  luxMainnet,
  luxTestnet,
  zooMainnet,
  zooTestnet,
  ethereum,
  sepolia,
}
