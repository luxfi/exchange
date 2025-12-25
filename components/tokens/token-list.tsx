"use client"

import * as React from "react"
import { Search, TrendingUp, TrendingDown, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TokenIcon } from "@/components/ui/token-icon"
import { formatCurrency, formatNumber, formatPercent, cn } from "@/lib/utils"

interface TokenData {
  symbol: string
  name: string
  logoUri?: string
  price: number
  priceChange24h: number
  volume24h: number
  marketCap: number
  isFavorite?: boolean
}

// Mock token data
const MOCK_TOKENS: TokenData[] = [
  {
    symbol: "LUX",
    name: "Lux",
    logoUri: "/tokens/lux.svg",
    price: 2.5,
    priceChange24h: 5.2,
    volume24h: 12500000,
    marketCap: 250000000,
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    logoUri: "/tokens/eth.svg",
    price: 3450.0,
    priceChange24h: 2.1,
    volume24h: 8500000000,
    marketCap: 415000000000,
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    logoUri: "/tokens/usdc.svg",
    price: 1.0,
    priceChange24h: 0.01,
    volume24h: 5200000000,
    marketCap: 32000000000,
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    logoUri: "/tokens/usdt.svg",
    price: 1.0,
    priceChange24h: -0.02,
    volume24h: 6800000000,
    marketCap: 95000000000,
  },
  {
    symbol: "ZOO",
    name: "Zoo Token",
    logoUri: "/tokens/zoo.svg",
    price: 0.15,
    priceChange24h: 12.5,
    volume24h: 2500000,
    marketCap: 15000000,
  },
  {
    symbol: "WETH",
    name: "Wrapped Ether",
    logoUri: "/tokens/weth.svg",
    price: 3450.0,
    priceChange24h: 2.1,
    volume24h: 1200000000,
    marketCap: 8500000000,
  },
]

export function TokenList() {
  const [tokens] = React.useState<TokenData[]>(MOCK_TOKENS)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [favorites, setFavorites] = React.useState<Set<string>>(new Set())

  const filteredTokens = React.useMemo(() => {
    if (!searchQuery) return tokens
    const query = searchQuery.toLowerCase()
    return tokens.filter(
      (token) =>
        token.symbol.toLowerCase().includes(query) ||
        token.name.toLowerCase().includes(query)
    )
  }, [tokens, searchQuery])

  const toggleFavorite = (symbol: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(symbol)) {
        next.delete(symbol)
      } else {
        next.add(symbol)
      }
      return next
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tokens</h1>
          <p className="text-muted-foreground">
            Explore and trade tokens on Lux Exchange
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or symbol..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Token Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="pb-3 font-medium w-8"></th>
                  <th className="pb-3 font-medium">#</th>
                  <th className="pb-3 font-medium">Token</th>
                  <th className="pb-3 font-medium text-right">Price</th>
                  <th className="pb-3 font-medium text-right">24h Change</th>
                  <th className="pb-3 font-medium text-right">24h Volume</th>
                  <th className="pb-3 font-medium text-right">Market Cap</th>
                  <th className="pb-3 font-medium text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredTokens.map((token, index) => (
                  <tr key={token.symbol} className="group">
                    <td className="py-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => toggleFavorite(token.symbol)}
                      >
                        <Star
                          className={cn(
                            "h-4 w-4",
                            favorites.has(token.symbol)
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-muted-foreground"
                          )}
                        />
                      </Button>
                    </td>
                    <td className="py-4 text-muted-foreground">{index + 1}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <TokenIcon
                          symbol={token.symbol}
                          logoUri={token.logoUri}
                          size="md"
                        />
                        <div>
                          <span className="font-medium">{token.name}</span>
                          <span className="ml-2 text-sm text-muted-foreground">
                            {token.symbol}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-right font-mono">
                      {formatCurrency(token.price, "USD", token.price < 1 ? 4 : 2)}
                    </td>
                    <td className="py-4 text-right">
                      <div
                        className={cn(
                          "flex items-center justify-end gap-1",
                          token.priceChange24h >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        )}
                      >
                        {token.priceChange24h >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span>{formatPercent(token.priceChange24h)}</span>
                      </div>
                    </td>
                    <td className="py-4 text-right text-muted-foreground">
                      {formatCurrency(token.volume24h, "USD", 0)}
                    </td>
                    <td className="py-4 text-right text-muted-foreground">
                      {formatCurrency(token.marketCap, "USD", 0)}
                    </td>
                    <td className="py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        asChild
                      >
                        <a href={`/swap?input=${token.symbol}`}>Trade</a>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTokens.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-medium">No tokens found</h3>
              <p className="text-sm text-muted-foreground">
                Try a different search term
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
