"use client"

import * as React from "react"
import Link from "next/link"
import { Plus, TrendingUp, Droplets } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DualTokenIcon } from "@/components/ui/token-icon"
import { formatNumber, formatCurrency } from "@/lib/utils"

interface Pool {
  id: string
  token0: { symbol: string; logoUri?: string }
  token1: { symbol: string; logoUri?: string }
  fee: number
  tvl: number
  volume24h: number
  apr: number
}

// Mock pool data
const MOCK_POOLS: Pool[] = [
  {
    id: "lux-usdc-30",
    token0: { symbol: "LUX", logoUri: "/tokens/lux.svg" },
    token1: { symbol: "USDC", logoUri: "/tokens/usdc.svg" },
    fee: 0.3,
    tvl: 2500000,
    volume24h: 850000,
    apr: 24.5,
  },
  {
    id: "lux-eth-30",
    token0: { symbol: "LUX", logoUri: "/tokens/lux.svg" },
    token1: { symbol: "ETH", logoUri: "/tokens/eth.svg" },
    fee: 0.3,
    tvl: 1800000,
    volume24h: 620000,
    apr: 18.2,
  },
  {
    id: "eth-usdc-05",
    token0: { symbol: "ETH", logoUri: "/tokens/eth.svg" },
    token1: { symbol: "USDC", logoUri: "/tokens/usdc.svg" },
    fee: 0.05,
    tvl: 5200000,
    volume24h: 3200000,
    apr: 12.8,
  },
  {
    id: "zoo-lux-100",
    token0: { symbol: "ZOO", logoUri: "/tokens/zoo.svg" },
    token1: { symbol: "LUX", logoUri: "/tokens/lux.svg" },
    fee: 1.0,
    tvl: 450000,
    volume24h: 125000,
    apr: 45.3,
  },
]

export function PoolList() {
  const [pools] = React.useState<Pool[]>(MOCK_POOLS)

  const totalTVL = pools.reduce((sum, pool) => sum + pool.tvl, 0)
  const totalVolume = pools.reduce((sum, pool) => sum + pool.volume24h, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Liquidity Pools</h1>
          <p className="text-muted-foreground">
            Provide liquidity to earn trading fees
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Position
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Value Locked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">
                {formatCurrency(totalTVL)}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              24h Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">
                {formatCurrency(totalVolume)}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Pools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{pools.length}</span>
          </CardContent>
        </Card>
      </div>

      {/* Pool Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Pools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="pb-3 font-medium">Pool</th>
                  <th className="pb-3 font-medium">Fee</th>
                  <th className="pb-3 font-medium text-right">TVL</th>
                  <th className="pb-3 font-medium text-right">24h Volume</th>
                  <th className="pb-3 font-medium text-right">APR</th>
                  <th className="pb-3 font-medium text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pools.map((pool) => (
                  <tr key={pool.id} className="group">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <DualTokenIcon
                          token0Symbol={pool.token0.symbol}
                          token1Symbol={pool.token1.symbol}
                          token0Logo={pool.token0.logoUri}
                          token1Logo={pool.token1.logoUri}
                          size="md"
                        />
                        <span className="font-medium">
                          {pool.token0.symbol}/{pool.token1.symbol}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="rounded-full bg-muted px-2 py-1 text-xs">
                        {pool.fee}%
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      {formatCurrency(pool.tvl)}
                    </td>
                    <td className="py-4 text-right">
                      {formatCurrency(pool.volume24h)}
                    </td>
                    <td className="py-4 text-right">
                      <span className="text-green-500">
                        {formatNumber(pool.apr)}%
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Add
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Your Positions */}
      <Card>
        <CardHeader>
          <CardTitle>Your Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Droplets className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="mb-2 text-lg font-medium">No positions yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Add liquidity to a pool to start earning fees
            </p>
            <Button variant="outline">Connect Wallet</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
