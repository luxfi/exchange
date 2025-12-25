"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { Toaster } from "@/components/ui/sonner"

// Dynamic import Web3Provider to avoid SSR issues with wagmi
const Web3Provider = dynamic(
  () => import("@/components/providers/web3-provider").then((mod) => mod.Web3Provider),
  { ssr: false }
)

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <Web3Provider>
        {children}
        <Toaster />
      </Web3Provider>
    </ThemeProvider>
  )
}
