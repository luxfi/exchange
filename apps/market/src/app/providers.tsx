'use client'

import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { WagmiProvider } from 'wagmi'
import { config } from '@/lib/wagmi'
import { ChainContext } from '@/hooks/useChain'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
})

export function Providers({ children }: { children: ReactNode }) {
  const [chainId, setChainId] = useState(96369) // Default to Lux mainnet

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#E8E8E8',
            accentColorForeground: '#000',
            borderRadius: 'medium',
          })}
        >
          <ChainContext.Provider value={{ chainId, setChainId }}>
            {children}
          </ChainContext.Provider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
