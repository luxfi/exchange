"use client"

import * as React from "react"
import { useAccount } from "wagmi"
import { Wallet } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// =============================================================================
// TYPES
// =============================================================================

export interface OptionPosition {
  id: string
  underlying: string
  strike: number
  side: "call" | "put"
  direction: "long" | "short"
  quantity: number
  avgEntry: number
  markPrice: number
  expiration: string
  pnl: number
  pnlPercent: number
}

interface PositionsTableProps {
  positions: OptionPosition[]
  className?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

export function PositionsTable({ positions, className }: PositionsTableProps) {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Wallet className="mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="mb-1 text-sm font-medium">Connect your wallet</p>
            <p className="text-xs text-muted-foreground">
              View and manage your options positions
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (positions.length === 0) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="mb-1 text-sm font-medium">No open positions</p>
            <p className="text-xs text-muted-foreground">
              Your options positions will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            Positions ({positions.length})
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs text-muted-foreground">
                <th className="pb-2 text-left font-medium">Contract</th>
                <th className="pb-2 text-left font-medium">Side</th>
                <th className="pb-2 text-right font-medium">Qty</th>
                <th className="pb-2 text-right font-medium">Avg Entry</th>
                <th className="pb-2 text-right font-medium">Mark</th>
                <th className="pb-2 text-right font-medium">P&L</th>
                <th className="pb-2 text-right font-medium">Exp</th>
                <th className="pb-2 text-right font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {positions.map((pos) => (
                <tr key={pos.id} className="group">
                  <td className="py-2.5 text-left">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {pos.underlying} {pos.strike}
                      </span>
                      <span
                        className={cn(
                          "text-xs",
                          pos.side === "call"
                            ? "text-green-500"
                            : "text-red-500"
                        )}
                      >
                        {pos.side.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 text-left">
                    <span
                      className={cn(
                        "text-xs font-medium",
                        pos.direction === "long"
                          ? "text-green-500"
                          : "text-red-500"
                      )}
                    >
                      {pos.direction.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-mono">
                    {pos.quantity}
                  </td>
                  <td className="py-2.5 text-right font-mono">
                    {pos.avgEntry.toFixed(2)}
                  </td>
                  <td className="py-2.5 text-right font-mono">
                    {pos.markPrice.toFixed(2)}
                  </td>
                  <td className="py-2.5 text-right font-mono">
                    <span
                      className={cn(
                        pos.pnl >= 0 ? "text-green-500" : "text-red-500"
                      )}
                    >
                      {pos.pnl >= 0 ? "+" : ""}
                      {pos.pnl.toFixed(2)} ({pos.pnlPercent >= 0 ? "+" : ""}
                      {pos.pnlPercent.toFixed(1)}%)
                    </span>
                  </td>
                  <td className="py-2.5 text-right text-xs text-muted-foreground">
                    {pos.expiration}
                  </td>
                  <td className="py-2.5 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Close
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
