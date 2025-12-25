"use client"

import * as React from "react"
import { Search, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { TokenIcon } from "@/components/ui/token-icon"
import { cn } from "@/lib/utils"
import {
  type Token,
  getTokensForChain,
  searchTokens,
  getDisplayAddress,
  isSameToken,
} from "@/lib/tokens"

interface TokenSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (token: Token) => void
  chainId: number
  selectedToken?: Token
  excludeToken?: Token
  title?: string
}

export function TokenSelector({
  open,
  onOpenChange,
  onSelect,
  chainId,
  selectedToken,
  excludeToken,
  title = "Select a token",
}: TokenSelectorProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Get filtered tokens
  const tokens = React.useMemo(() => {
    let result = searchQuery
      ? searchTokens(chainId, searchQuery)
      : getTokensForChain(chainId)

    // Exclude the other selected token to prevent selecting same token for both sides
    if (excludeToken) {
      result = result.filter((t) => !isSameToken(t, excludeToken))
    }

    return result
  }, [chainId, searchQuery, excludeToken])

  // Focus input when dialog opens
  React.useEffect(() => {
    if (open) {
      setSearchQuery("")
      // Small delay to ensure dialog is rendered
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  const handleSelect = (token: Token) => {
    onSelect(token)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by name or symbol"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-10 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>

        {/* Token List */}
        <div className="max-h-[400px] overflow-y-auto -mx-6 px-6">
          {tokens.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No tokens found
            </div>
          ) : (
            <div className="space-y-1">
              {tokens.map((token) => {
                const isSelected =
                  selectedToken && isSameToken(token, selectedToken)

                return (
                  <button
                    key={`${token.chainId}-${token.symbol}-${token.address}`}
                    onClick={() => handleSelect(token)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors",
                      "hover:bg-muted/70",
                      isSelected && "bg-muted"
                    )}
                  >
                    <TokenIcon
                      symbol={token.symbol}
                      logoUri={token.logoUri}
                      size="lg"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{token.symbol}</span>
                        {token.isNative && (
                          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs text-primary">
                            Native
                          </span>
                        )}
                        {token.isWrappedNative && (
                          <span className="rounded bg-muted-foreground/10 px-1.5 py-0.5 text-xs text-muted-foreground">
                            Wrapped
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="truncate">{token.name}</span>
                        {token.address && (
                          <span className="text-xs">
                            {getDisplayAddress(token)}
                          </span>
                        )}
                      </div>
                    </div>
                    {token.balance && (
                      <div className="text-right">
                        <div className="font-medium">{token.balance}</div>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t pt-4 text-sm text-muted-foreground">
          <span>{tokens.length} tokens available</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
