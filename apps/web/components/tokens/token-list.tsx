"use client"

import * as React from "react"
import { Search, TrendingUp, TrendingDown, Star, RefreshCw } from "lucide-react"
import { useChainId } from "wagmi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TokenIcon } from "@/components/ui/token-icon"
import { formatCurrency, formatPercent, cn } from "@/lib/utils"
import { type Token, getTokensForChain } from "@/lib/tokens"
import { luxMainnet, isLuxEcosystem } from "@/lib/chains"

// LXD Gateway URL for live data
const LXD_GATEWAY_URL = process.env.NEXT_PUBLIC_LXD_GATEWAY_URL || "http://localhost:8080"

interface TokenWithStats extends Token {
  price: number
  priceChange24h: number
  volume24h: number
  marketCap: number
}

interface LxdTokenStats {
  address: string
  price: number
  priceChange24h: number
  volume24h: number
  marketCap: number
  tvl: number
}

async function fetchTokenStats(chainId: number): Promise<Map<string, LxdTokenStats>> {
  try {
    const response = await fetch(`${LXD_GATEWAY_URL}/v1/tokens/stats?chainId=${chainId}`)
    if (!response.ok) {
      console.warn("LXD Gateway not available, using fallback")
      return new Map()
    }
    const data = await response.json()
    if (!data.success || !Array.isArray(data.data)) {
      return new Map()
    }
    const stats = new Map<string, LxdTokenStats>()
    for (const token of data.data) {
      stats.set(token.address?.toLowerCase() || "native", token)
    }
    return stats
  } catch (error) {
    console.warn("Failed to fetch token stats from LXD Gateway:", error)
    return new Map()
  }
}

export function TokenList() {
  const chainId = useChainId()
  const effectiveChainId = chainId || luxMainnet.id
  
  const [tokens, setTokens] = React.useState<TokenWithStats[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [favorites, setFavorites] = React.useState<Set<string>>(new Set())

  // Load tokens and stats
  const loadTokens = React.useCallback(async () => {
    setLoading(true)
    try {
      const chainTokens = getTokensForChain(effectiveChainId)
      
      // Try to get live stats from LXD gateway if on Lux ecosystem
      let stats = new Map<string, LxdTokenStats>()
      if (isLuxEcosystem(effectiveChainId)) {
        stats = await fetchTokenStats(effectiveChainId)
      }
      
      // Merge token data with stats
      const tokensWithStats: TokenWithStats[] = chainTokens.map((token) => {
        const key = token.address?.toLowerCase() || "native"
        const tokenStats = stats.get(key)
        return {
          ...token,
          price: tokenStats?.price ?? 0,
          priceChange24h: tokenStats?.priceChange24h ?? 0,
          volume24h: tokenStats?.volume24h ?? 0,
          marketCap: tokenStats?.marketCap ?? 0,
        }
      })
      
      setTokens(tokensWithStats)
    } catch (error) {
      console.error("Failed to load tokens:", error)
      // Fallback to just token list without stats
      const chainTokens = getTokensForChain(effectiveChainId)
      setTokens(chainTokens.map(t => ({
        ...t,
        price: 0,
        priceChange24h: 0,
        volume24h: 0,
        marketCap: 0,
      })))
    } finally {
      setLoading(false)
    }
  }, [effectiveChainId])

  React.useEffect(() => {
    loadTokens()
  }, [loadTokens])

  const filteredTokens = React.useMemo(() => {
    if (!searchQuery) return tokens
    const query = searchQuery.toLowerCase()
    return tokens.filter(
      (token) =>
        token.symbol.toLowerCase().includes(query) ||
        token.name.toLowerCase().includes(query) ||
        token.address?.toLowerCase().includes(query)
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
            Explore tokens on Lux Exchange
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadTokens}
          disabled={loading}
        >
          <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, symbol, or address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Token Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filteredTokens.length} Tokens
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
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
                    <tr key={`${token.chainId}-${token.symbol}-${token.address}`} className="group">
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
                            {token.isNative && (
                              <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-xs text-primary">
                                Native
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-right font-mono">
                        {token.price > 0
                          ? formatCurrency(token.price, "USD", token.price < 1 ? 6 : 2)
                          : "-"}
                      </td>
                      <td className="py-4 text-right">
                        {token.priceChange24h !== 0 ? (
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
                            <span>{formatPercent(Math.abs(token.priceChange24h))}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="py-4 text-right text-muted-foreground">
                        {token.volume24h > 0
                          ? formatCurrency(token.volume24h, "USD", 0)
                          : "-"}
                      </td>
                      <td className="py-4 text-right text-muted-foreground">
                        {token.marketCap > 0
                          ? formatCurrency(token.marketCap, "USD", 0)
                          : "-"}
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
          )}

          {!loading && filteredTokens.length === 0 && (
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
