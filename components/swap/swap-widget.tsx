"use client"

import * as React from "react"
import { ArrowDown, Settings } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TokenInput } from "@/components/swap/token-input"
import { cn } from "@/lib/utils"

interface SwapWidgetProps {
  className?: string
}

export function SwapWidget({ className }: SwapWidgetProps) {
  const [inputAmount, setInputAmount] = React.useState("")
  const [outputAmount, setOutputAmount] = React.useState("")

  const handleSwapTokens = () => {
    // Swap input and output
    const tempInput = inputAmount
    setInputAmount(outputAmount)
    setOutputAmount(tempInput)
  }

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h2 className="text-lg font-semibold">Swap</h2>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </CardHeader>

      <CardContent className="space-y-2">
        {/* Input Token */}
        <TokenInput
          label="You pay"
          amount={inputAmount}
          onAmountChange={setInputAmount}
          token={{
            symbol: "LUX",
            name: "Lux",
            logoUri: "/tokens/lux.svg",
          }}
        />

        {/* Swap Direction Button */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="relative z-10 h-8 w-8 rounded-full bg-background"
            onClick={handleSwapTokens}
          >
            <ArrowDown className="h-4 w-4" />
            <span className="sr-only">Swap tokens</span>
          </Button>
        </div>

        {/* Output Token */}
        <TokenInput
          label="You receive"
          amount={outputAmount}
          onAmountChange={setOutputAmount}
          token={{
            symbol: "USDC",
            name: "USD Coin",
            logoUri: "/tokens/usdc.svg",
          }}
          readOnly
        />

        {/* Swap Button */}
        <Button className="w-full" variant="swap" size="xl">
          Swap
        </Button>

        {/* Rate Info */}
        {inputAmount && outputAmount && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Rate</span>
            <span>1 LUX = 2.50 USDC</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
