"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { cn } from "./ui/cn"

type OrderSide = "buy" | "sell"
type OrderType = "limit" | "market"

export interface OptionsOrderFormProps {
  underlying: string | null
  strike: number | null
  optionSide: "call" | "put" | null
  expiration: string | null
  isConnected?: boolean
  onSubmit?: (order: { side: OrderSide; type: OrderType; quantity: number; limitPrice?: number }) => void
  onConnectWallet?: () => void
  className?: string
}

export function OptionsOrderForm({
  underlying,
  strike,
  optionSide,
  expiration,
  isConnected = false,
  onSubmit,
  onConnectWallet,
  className,
}: OptionsOrderFormProps) {
  const [side, setSide] = React.useState<OrderSide>("buy")
  const [orderType, setOrderType] = React.useState<OrderType>("limit")
  const [quantity, setQuantity] = React.useState("")
  const [limitPrice, setLimitPrice] = React.useState("")

  const hasSelection = underlying && strike !== null && optionSide && expiration

  const getButtonText = (): string => {
    if (!isConnected) return "Connect Wallet"
    if (!hasSelection) return "Select an Option"
    if (!quantity || parseFloat(quantity) <= 0) return "Enter Quantity"
    if (orderType === "limit" && (!limitPrice || parseFloat(limitPrice) <= 0)) {
      return "Enter Limit Price"
    }
    return `${side === "buy" ? "Buy" : "Sell"} ${optionSide?.toUpperCase()} ${underlying} ${strike}`
  }

  const isDisabled = (): boolean => {
    if (!isConnected) return false
    if (!hasSelection) return true
    if (!quantity || parseFloat(quantity) <= 0) return true
    if (orderType === "limit" && (!limitPrice || parseFloat(limitPrice) <= 0)) {
      return true
    }
    return false
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Order</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Option info */}
        {hasSelection ? (
          <div className="rounded-lg bg-muted px-3 py-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Contract</span>
              <span className="font-medium">
                {underlying}{" "}
                <span className={optionSide === "call" ? "text-green-500" : "text-red-500"}>
                  {strike} {optionSide?.toUpperCase()}
                </span>
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-muted-foreground">Expiration</span>
              <span className="font-medium">{expiration}</span>
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-muted px-3 py-4 text-center text-sm text-muted-foreground">
            Click on a bid/ask in the chain to select an option
          </div>
        )}

        {/* Buy / Sell toggle */}
        <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
          <button
            className={cn(
              "rounded-md py-1.5 text-sm font-medium transition-colors",
              side === "buy"
                ? "bg-green-500 text-white"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setSide("buy")}
          >
            Buy
          </button>
          <button
            className={cn(
              "rounded-md py-1.5 text-sm font-medium transition-colors",
              side === "sell"
                ? "bg-red-500 text-white"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setSide("sell")}
          >
            Sell
          </button>
        </div>

        {/* Order type toggle */}
        <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
          <button
            className={cn(
              "rounded-md py-1.5 text-xs font-medium transition-colors",
              orderType === "limit"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setOrderType("limit")}
          >
            Limit
          </button>
          <button
            className={cn(
              "rounded-md py-1.5 text-xs font-medium transition-colors",
              orderType === "market"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setOrderType("market")}
          >
            Market
          </button>
        </div>

        {/* Quantity */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Contracts
          </label>
          <Input
            type="number"
            placeholder="0"
            min="0"
            step="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        {/* Limit price (only for limit orders) */}
        {orderType === "limit" && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Limit Price
            </label>
            <Input
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
            />
          </div>
        )}

        {/* Estimated cost */}
        {quantity && parseFloat(quantity) > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Est. {side === "buy" ? "Cost" : "Credit"}
            </span>
            <span className="font-medium font-mono">
              {orderType === "limit" && limitPrice && parseFloat(limitPrice) > 0
                ? `${(parseFloat(quantity) * parseFloat(limitPrice)).toFixed(2)} ${underlying}`
                : "Market price"}
            </span>
          </div>
        )}

        {/* Submit button */}
        <Button
          className="w-full"
          variant={side === "buy" ? "default" : "destructive"}
          size="xl"
          disabled={isDisabled()}
          onClick={() => {
            if (!isConnected && onConnectWallet) return onConnectWallet()
            if (onSubmit && !isDisabled()) {
              onSubmit({
                side,
                type: orderType,
                quantity: parseFloat(quantity),
                limitPrice: orderType === "limit" ? parseFloat(limitPrice) : undefined,
              })
            }
          }}
        >
          {getButtonText()}
        </Button>
      </CardContent>
    </Card>
  )
}
