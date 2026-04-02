"use client"

import * as React from "react"
import { cn } from "./ui/cn"
import type { OptionStrike } from "./types"

interface OptionsChainProps {
  strikes: OptionStrike[]
  spotPrice: number | null
  onSelectOption: (strike: number, side: "call" | "put") => void
  selectedStrike: number | null
  selectedSide: "call" | "put" | null
  className?: string
}

export function OptionsChain({
  strikes,
  spotPrice,
  onSelectOption,
  selectedStrike,
  selectedSide,
  className,
}: OptionsChainProps) {
  if (strikes.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center py-16 text-sm text-muted-foreground",
          className
        )}
      >
        No options data available. Select an underlying and expiration to view the chain.
      </div>
    )
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-muted-foreground">
            <th className="pb-2 pr-2 text-right font-medium text-green-500" colSpan={5}>
              CALLS
            </th>
            <th className="pb-2 px-3 text-center font-medium">Strike</th>
            <th className="pb-2 pl-2 text-left font-medium text-red-500" colSpan={5}>
              PUTS
            </th>
          </tr>
          <tr className="border-b text-xs text-muted-foreground">
            <th className="pb-2 pr-2 text-right font-medium">OI</th>
            <th className="pb-2 pr-2 text-right font-medium">Vol</th>
            <th className="pb-2 pr-2 text-right font-medium">IV</th>
            <th className="pb-2 pr-2 text-right font-medium">Bid</th>
            <th className="pb-2 pr-2 text-right font-medium">Ask</th>
            <th className="pb-2 px-3 text-center font-medium">Price</th>
            <th className="pb-2 pl-2 text-left font-medium">Bid</th>
            <th className="pb-2 pl-2 text-left font-medium">Ask</th>
            <th className="pb-2 pl-2 text-left font-medium">IV</th>
            <th className="pb-2 pl-2 text-left font-medium">Vol</th>
            <th className="pb-2 pl-2 text-left font-medium">OI</th>
          </tr>
        </thead>
        <tbody className="font-mono text-xs">
          {strikes.map((row) => {
            const isAtm =
              spotPrice !== null &&
              Math.abs(row.strike - spotPrice) ===
                Math.min(
                  ...strikes.map((s) =>
                    spotPrice !== null ? Math.abs(s.strike - spotPrice) : Infinity
                  )
                )
            const isItmCall = spotPrice !== null && row.strike < spotPrice
            const isItmPut = spotPrice !== null && row.strike > spotPrice
            const isCallSelected =
              selectedStrike === row.strike && selectedSide === "call"
            const isPutSelected =
              selectedStrike === row.strike && selectedSide === "put"

            return (
              <tr
                key={row.strike}
                className={cn(
                  "border-b border-border/50 transition-colors",
                  isAtm && "bg-accent/30"
                )}
              >
                {/* Call side */}
                <td
                  className={cn(
                    "py-2 pr-2 text-right cursor-pointer hover:bg-green-500/10 transition-colors",
                    isItmCall && "bg-green-500/5",
                    isCallSelected && "bg-green-500/20"
                  )}
                  onClick={() => onSelectOption(row.strike, "call")}
                >
                  {formatInt(row.call.openInterest)}
                </td>
                <td
                  className={cn(
                    "py-2 pr-2 text-right cursor-pointer hover:bg-green-500/10 transition-colors",
                    isItmCall && "bg-green-500/5",
                    isCallSelected && "bg-green-500/20"
                  )}
                  onClick={() => onSelectOption(row.strike, "call")}
                >
                  {formatInt(row.call.volume)}
                </td>
                <td
                  className={cn(
                    "py-2 pr-2 text-right cursor-pointer hover:bg-green-500/10 transition-colors",
                    isItmCall && "bg-green-500/5",
                    isCallSelected && "bg-green-500/20"
                  )}
                  onClick={() => onSelectOption(row.strike, "call")}
                >
                  {row.call.iv !== null ? `${(row.call.iv * 100).toFixed(0)}%` : "-"}
                </td>
                <td
                  className={cn(
                    "py-2 pr-2 text-right cursor-pointer hover:bg-green-500/10 transition-colors text-green-500",
                    isItmCall && "bg-green-500/5",
                    isCallSelected && "bg-green-500/20"
                  )}
                  onClick={() => onSelectOption(row.strike, "call")}
                >
                  {row.call.bid !== null ? formatPrice(row.call.bid) : "-"}
                </td>
                <td
                  className={cn(
                    "py-2 pr-2 text-right cursor-pointer hover:bg-green-500/10 transition-colors text-green-500",
                    isItmCall && "bg-green-500/5",
                    isCallSelected && "bg-green-500/20"
                  )}
                  onClick={() => onSelectOption(row.strike, "call")}
                >
                  {row.call.ask !== null ? formatPrice(row.call.ask) : "-"}
                </td>

                {/* Strike column */}
                <td
                  className={cn(
                    "py-2 px-3 text-center font-semibold",
                    isAtm && "text-primary"
                  )}
                >
                  {formatPrice(row.strike)}
                </td>

                {/* Put side */}
                <td
                  className={cn(
                    "py-2 pl-2 text-left cursor-pointer hover:bg-red-500/10 transition-colors text-red-500",
                    isItmPut && "bg-red-500/5",
                    isPutSelected && "bg-red-500/20"
                  )}
                  onClick={() => onSelectOption(row.strike, "put")}
                >
                  {row.put.bid !== null ? formatPrice(row.put.bid) : "-"}
                </td>
                <td
                  className={cn(
                    "py-2 pl-2 text-left cursor-pointer hover:bg-red-500/10 transition-colors text-red-500",
                    isItmPut && "bg-red-500/5",
                    isPutSelected && "bg-red-500/20"
                  )}
                  onClick={() => onSelectOption(row.strike, "put")}
                >
                  {row.put.ask !== null ? formatPrice(row.put.ask) : "-"}
                </td>
                <td
                  className={cn(
                    "py-2 pl-2 text-left cursor-pointer hover:bg-red-500/10 transition-colors",
                    isItmPut && "bg-red-500/5",
                    isPutSelected && "bg-red-500/20"
                  )}
                  onClick={() => onSelectOption(row.strike, "put")}
                >
                  {row.put.iv !== null ? `${(row.put.iv * 100).toFixed(0)}%` : "-"}
                </td>
                <td
                  className={cn(
                    "py-2 pl-2 text-left cursor-pointer hover:bg-red-500/10 transition-colors",
                    isItmPut && "bg-red-500/5",
                    isPutSelected && "bg-red-500/20"
                  )}
                  onClick={() => onSelectOption(row.strike, "put")}
                >
                  {formatInt(row.put.volume)}
                </td>
                <td
                  className={cn(
                    "py-2 pl-2 text-left cursor-pointer hover:bg-red-500/10 transition-colors",
                    isItmPut && "bg-red-500/5",
                    isPutSelected && "bg-red-500/20"
                  )}
                  onClick={() => onSelectOption(row.strike, "put")}
                >
                  {formatInt(row.put.openInterest)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function formatPrice(value: number): string {
  if (value >= 1) return value.toFixed(2)
  if (value >= 0.01) return value.toFixed(4)
  return value.toFixed(6)
}

function formatInt(value: number): string {
  if (value === 0) return "-"
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return value.toString()
}
