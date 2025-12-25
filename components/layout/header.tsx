"use client"

import * as React from "react"
import Link from "next/link"
import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { cn, shortenAddress } from "@/lib/utils"
import { ConnectButton } from "@/components/wallet/connect-button"

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">Lux</span>
            <span className="text-sm text-muted-foreground">Exchange</span>
          </Link>

          <nav className="hidden md:flex items-center gap-4">
            <Link href="/swap">
              <Button variant="ghost" size="sm">
                Swap
              </Button>
            </Link>
            <Link href="/pool">
              <Button variant="ghost" size="sm">
                Pool
              </Button>
            </Link>
            <Link href="/tokens">
              <Button variant="ghost" size="sm">
                Tokens
              </Button>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ConnectButton />
        </div>
      </div>
    </header>
  )
}
