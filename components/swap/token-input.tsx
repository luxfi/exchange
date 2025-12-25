"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Token {
  symbol: string
  name: string
  logoUri?: string
  balance?: string
}

interface TokenInputProps {
  label?: string
  amount: string
  onAmountChange: (value: string) => void
  token?: Token
  onTokenSelect?: () => void
  readOnly?: boolean
  className?: string
}

export function TokenInput({
  label,
  amount,
  onAmountChange,
  token,
  onTokenSelect,
  readOnly = false,
  className,
}: TokenInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Only allow numbers and decimals
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      onAmountChange(value)
    }
  }

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

      <div className="flex items-center gap-2">
        <input
          type="text"
          inputMode="decimal"
          placeholder="0"
          value={amount}
          onChange={handleChange}
          readOnly={readOnly}
          className={cn(
            "flex-1 bg-transparent text-3xl font-medium outline-none placeholder:text-muted-foreground/50",
            readOnly && "cursor-default"
          )}
        />

        <Button
          variant="secondary"
          size="sm"
          className="h-10 gap-1 rounded-xl px-3"
          onClick={onTokenSelect}
        >
          {token?.logoUri && (
            <img
              src={token.logoUri}
              alt={token.symbol}
              className="h-6 w-6 rounded-full"
            />
          )}
          <span className="font-semibold">{token?.symbol || "Select"}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      {token?.balance && amount && (
        <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>${(parseFloat(amount) * 2.5).toFixed(2)}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-primary hover:text-primary/80"
            onClick={() => onAmountChange(token.balance || "0")}
          >
            Max
          </Button>
        </div>
      )}
    </div>
  )
}
