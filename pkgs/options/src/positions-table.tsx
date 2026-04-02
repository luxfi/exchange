"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { cn } from "./ui/cn"
import type { OptionPosition } from "./types"

export interface PositionsTableProps {
  positions: OptionPosition[]
  isConnected?: boolean
  onClose?: (positionId: string) => void
  onConnectWallet?: () => void
  className?: string
}

export function PositionsTable({
  positions,
  isConnected = false,
  onClose,
  onConnectWallet,
  className,
}: PositionsTableProps) {

  if (!isConnected) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <svg className="mb-3 h-10 w-10 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" /></svg>
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
                      onClick={() => onClose?.(pos.id)}
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
