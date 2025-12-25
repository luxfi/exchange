"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronDown, Check } from "lucide-react"
import { useAccount, useChainId, useSwitchChain } from "wagmi"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  SUPPORTED_CHAINS,
  getChainById,
  getChainIcon,
  isTestnet,
  luxMainnet,
} from "@/lib/chains"

interface ChainSelectorProps {
  className?: string
}

export function ChainSelector({ className }: ChainSelectorProps) {
  const chainId = useChainId()
  const { isConnected } = useAccount()
  const { switchChain, isPending } = useSwitchChain()

  const currentChain = getChainById(chainId) || luxMainnet

  // Group chains: mainnets first, then testnets
  const mainnets = SUPPORTED_CHAINS.filter((c) => !isTestnet(c.id))
  const testnets = SUPPORTED_CHAINS.filter((c) => isTestnet(c.id))

  const handleChainSelect = (newChainId: number) => {
    if (newChainId !== chainId && switchChain) {
      switchChain({ chainId: newChainId })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "gap-2 h-9 px-3",
            isPending && "opacity-70 cursor-wait",
            className
          )}
          disabled={isPending}
        >
          <Image
            src={getChainIcon(currentChain.id)}
            alt={currentChain.name}
            width={20}
            height={20}
            className="rounded-full"
            unoptimized
          />
          <span className="hidden sm:inline font-medium">
            {currentChain.name}
          </span>
          <ChevronDown className="h-4 w-4 opacity-60" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {/* Mainnets */}
        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
          Mainnets
        </div>
        {mainnets.map((chain) => (
          <DropdownMenuItem
            key={chain.id}
            onClick={() => handleChainSelect(chain.id)}
            className="gap-3 cursor-pointer"
          >
            <Image
              src={getChainIcon(chain.id)}
              alt={chain.name}
              width={20}
              height={20}
              className="rounded-full"
              unoptimized
            />
            <span className="flex-1">{chain.name}</span>
            {chain.id === chainId && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        {/* Testnets */}
        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
          Testnets
        </div>
        {testnets.map((chain) => (
          <DropdownMenuItem
            key={chain.id}
            onClick={() => handleChainSelect(chain.id)}
            className="gap-3 cursor-pointer"
          >
            <Image
              src={getChainIcon(chain.id)}
              alt={chain.name}
              width={20}
              height={20}
              className="rounded-full"
              unoptimized
            />
            <span className="flex-1">{chain.name}</span>
            {chain.id === chainId && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
