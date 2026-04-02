"use client"

import * as React from "react"
// Inline SVG icons — no lucide dependency
const SearchIcon = () => <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
const ChevronDownIcon = () => <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="m6 9 6 6 6-6"/></svg>
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { TokenIcon } from "./ui/token-icon"
import { cn } from "./ui/cn"
import type { Token } from "./types"

interface SymbolSearchProps {
  selectedToken: Token | null
  onSelect: (token: Token) => void
  tokens: Token[]
  className?: string
}

export function SymbolSearch({
  selectedToken,
  onSelect,
  tokens,
  className,
}: SymbolSearchProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const ref = React.useRef<HTMLDivElement>(null)

  const filtered = React.useMemo(() => {
    if (!query) return tokens
    const q = query.toLowerCase()
    return tokens.filter(
      (t) =>
        t.symbol.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q)
    )
  }, [tokens, query])

  // Close on outside click
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <div ref={ref} className={cn("relative", className)}>
      <Button
        variant="outline"
        className="flex items-center gap-2 h-10 px-3"
        onClick={() => setOpen(!open)}
      >
        {selectedToken ? (
          <>
            <TokenIcon
              symbol={selectedToken.symbol}
              logoUri={selectedToken.logoUri}
              size="sm"
            />
            <span className="font-semibold">{selectedToken.symbol}</span>
          </>
        ) : (
          <span className="text-muted-foreground">Select token</span>
        )}
        <span className="text-muted-foreground"><ChevronDownIcon /></span>
      </Button>

      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 w-72 rounded-lg border bg-popover p-2 shadow-lg">
          <div className="relative mb-2">
            <span className="absolute left-2.5 top-2.5 text-muted-foreground"><SearchIcon /></span>
            <Input
              placeholder="Search tokens..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8 h-9"
              autoFocus
            />
          </div>
          <div className="max-h-64 overflow-y-auto space-y-0.5">
            {filtered.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No tokens found
              </div>
            ) : (
              filtered.map((token) => (
                <button
                  key={`${token.chainId}-${token.symbol}-${token.address}`}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-accent",
                    selectedToken?.symbol === token.symbol &&
                      selectedToken?.chainId === token.chainId &&
                      "bg-accent"
                  )}
                  onClick={() => {
                    onSelect(token)
                    setOpen(false)
                    setQuery("")
                  }}
                >
                  <TokenIcon
                    symbol={token.symbol}
                    logoUri={token.logoUri}
                    size="sm"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{token.symbol}</span>
                    <span className="text-xs text-muted-foreground">
                      {token.name}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
