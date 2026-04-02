"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TokenIcon } from "@/components/ui/token-icon"
import { cn } from "@/lib/utils"

export interface Token {
  symbol: string
  name: string
  logoUri?: string
  balance?: string
  address?: string
  decimals?: number
}

interface TokenInputProps {
  label?: string
  amount: string
  onAmountChange: (value: string) => void
  token?: Token
  onTokenSelect?: () => void
  readOnly?: boolean
  className?: string
  usdValue?: string
}

export function TokenInput({
  label,
  amount,
  onAmountChange,
  token,
  onTokenSelect,
  readOnly = false,
  className,
  usdValue,
}: TokenInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Only allow numbers and decimals
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      onAmountChange(value)
    }
  }

  const displayUsdValue = React.useMemo(() => {
    if (usdValue) return usdValue
    if (!amount || isNaN(parseFloat(amount))) return null
    // Mock USD value calculation - in production this would come from price feeds
    const mockPrice = token?.symbol === "LUX" ? 2.5 : token?.symbol === "USDC" ? 1 : 0
    return `$${(parseFloat(amount) * mockPrice).toFixed(2)}`
  }, [amount, usdValue, token?.symbol])

  return (
    <div
      className={cn(
        "rounded-2xl bg-muted/50 p-4 transition-colors focus-within:bg-muted/70",
        className
      )}
    >
      {label && (
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{label}</span>
          {token?.balance && (
            <span className="text-sm text-muted-foreground">
              Balance: {token.balance}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-3">
        <input
          type="text"
          inputMode="decimal"
          placeholder="0"
          value={amount}
          onChange={handleChange}
          readOnly={readOnly}
          className={cn(
            "flex-1 bg-transparent text-3xl font-medium outline-none placeholder:text-muted-foreground/50 min-w-0",
            readOnly && "cursor-default"
          )}
        />

        <Button
          variant="secondary"
          size="sm"
          className="h-10 gap-2 rounded-xl px-3 flex-shrink-0"
          onClick={onTokenSelect}
        >
          {token ? (
            <>
              <TokenIcon symbol={token.symbol} logoUri={token.logoUri} size="md" />
              <span className="font-semibold">{token.symbol}</span>
            </>
          ) : (
            <span className="font-semibold">Select token</span>
          )}
          <ChevronDown className="h-4 w-4 opacity-60" />
        </Button>
      </div>

      {(displayUsdValue || token?.balance) && (
        <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>{displayUsdValue || "\u00A0"}</span>
          {token?.balance && amount && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-primary hover:text-primary/80"
              onClick={() => onAmountChange(token.balance || "0")}
            >
              Max
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
