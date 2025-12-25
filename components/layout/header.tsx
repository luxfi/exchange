"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ConnectButton } from "@/components/wallet/connect-button"

interface HeaderProps {
  className?: string
}

const NAV_ITEMS = [
  { href: "/swap", label: "Swap" },
  { href: "/pool", label: "Pool" },
  { href: "/tokens", label: "Tokens" },
] as const

export function Header({ className }: HeaderProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/swap") {
      return pathname === "/" || pathname === "/swap" || pathname === "/swap/"
    }
    return pathname === href || pathname === `${href}/`
  }

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
            <Image
              src="/tokens/lux.svg"
              alt="Lux"
              width={32}
              height={32}
              className="rounded-full"
              unoptimized
            />
            <span className="text-xl font-bold">Lux</span>
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Exchange
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive(item.href) ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "transition-colors",
                    isActive(item.href) && "font-semibold"
                  )}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ConnectButton />
        </div>
      </div>
    </header>
  )
}
