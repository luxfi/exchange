"use client"

import * as React from "react"
import { ArrowDown, Settings } from "lucide-react"
import { useAccount, useChainId } from "wagmi"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TokenInput } from "@/components/swap/token-input"
import { TokenSelector } from "@/components/swap/token-selector"
import { cn } from "@/lib/utils"
import {
  type Token,
  getDefaultTokenPair,
  getNativeToken,
  isSameToken,
} from "@/lib/tokens"
import { luxMainnet } from "@/lib/chains"

interface SwapWidgetProps {
  className?: string
}

export function SwapWidget({ className }: SwapWidgetProps) {
  const chainId = useChainId()
  const { isConnected } = useAccount()

  // State for tokens
  const [inputToken, setInputToken] = React.useState<Token | undefined>()
  const [outputToken, setOutputToken] = React.useState<Token | undefined>()
  const [inputAmount, setInputAmount] = React.useState("")
  const [outputAmount, setOutputAmount] = React.useState("")

  // State for token selector
  const [selectorOpen, setSelectorOpen] = React.useState(false)
  const [selectorSide, setSelectorSide] = React.useState<"input" | "output">(
    "input"
  )

  // Initialize tokens when chain changes
  React.useEffect(() => {
    const effectiveChainId = chainId || luxMainnet.id
    const defaultPair = getDefaultTokenPair(effectiveChainId)

    if (defaultPair) {
      setInputToken(defaultPair.input)
      setOutputToken(defaultPair.output)
    } else {
      // Fallback to native token
      const native = getNativeToken(effectiveChainId)
      if (native) {
        setInputToken(native)
        setOutputToken(undefined)
      }
    }

    // Clear amounts on chain change
    setInputAmount("")
    setOutputAmount("")
  }, [chainId])

  // Mock price calculation (would be replaced with actual DEX quote)
  React.useEffect(() => {
    if (!inputAmount || !inputToken || !outputToken) {
      setOutputAmount("")
      return
    }

    const inputValue = parseFloat(inputAmount)
    if (isNaN(inputValue) || inputValue <= 0) {
      setOutputAmount("")
      return
    }

    // Mock exchange rates
    const rates: Record<string, Record<string, number>> = {
      LUX: { LUSD: 2.5, WLUX: 1, LETH: 0.0008, LBTC: 0.00003 },
      LUSD: { LUX: 0.4, WLUX: 0.4, LETH: 0.00032, LBTC: 0.000012 },
      WLUX: { LUSD: 2.5, LUX: 1, LETH: 0.0008, LBTC: 0.00003 },
      LETH: { LUX: 1250, LUSD: 3125, WLUX: 1250, LBTC: 0.0375 },
      LBTC: { LUX: 33333, LUSD: 83333, WLUX: 33333, LETH: 26.67 },
      ZOO: { WZOO: 1, WLUX: 0.5 },
      WZOO: { ZOO: 1, WLUX: 0.5 },
      ETH: { WETH: 1, USDC: 3125, USDT: 3125, DAI: 3125 },
      WETH: { ETH: 1, USDC: 3125, USDT: 3125, DAI: 3125 },
      USDC: { ETH: 0.00032, WETH: 0.00032, USDT: 1, DAI: 1 },
      USDT: { ETH: 0.00032, WETH: 0.00032, USDC: 1, DAI: 1 },
      DAI: { ETH: 0.00032, WETH: 0.00032, USDC: 1, USDT: 1 },
    }

    const rate = rates[inputToken.symbol]?.[outputToken.symbol]
    if (rate) {
      const output = inputValue * rate
      setOutputAmount(output.toFixed(outputToken.decimals > 8 ? 8 : 4))
    } else {
      // Default 1:1 if no rate found
      setOutputAmount(inputValue.toFixed(4))
    }
  }, [inputAmount, inputToken, outputToken])

  const handleSwapTokens = () => {
    const tempToken = inputToken
    const tempAmount = inputAmount

    setInputToken(outputToken)
    setOutputToken(tempToken)
    setInputAmount(outputAmount)
    setOutputAmount(tempAmount)
  }

  const openTokenSelector = (side: "input" | "output") => {
    setSelectorSide(side)
    setSelectorOpen(true)
  }

  const handleTokenSelect = (token: Token) => {
    if (selectorSide === "input") {
      // If selecting the same token as output, swap them
      if (outputToken && isSameToken(token, outputToken)) {
        setOutputToken(inputToken)
      }
      setInputToken(token)
    } else {
      // If selecting the same token as input, swap them
      if (inputToken && isSameToken(token, inputToken)) {
        setInputToken(outputToken)
      }
      setOutputToken(token)
    }
  }

  // Calculate display rate
  const displayRate = React.useMemo(() => {
    if (!inputToken || !outputToken || !inputAmount || !outputAmount) {
      return null
    }

    const inVal = parseFloat(inputAmount)
    const outVal = parseFloat(outputAmount)

    if (isNaN(inVal) || isNaN(outVal) || inVal === 0) return null

    const rate = outVal / inVal
    return `1 ${inputToken.symbol} = ${rate.toFixed(4)} ${outputToken.symbol}`
  }, [inputToken, outputToken, inputAmount, outputAmount])

  // Button state
  const getButtonText = () => {
    if (!isConnected) return "Connect Wallet"
    if (!inputToken || !outputToken) return "Select tokens"
    if (!inputAmount || parseFloat(inputAmount) === 0) return "Enter amount"
    return "Swap"
  }

  const isButtonDisabled = () => {
    if (!isConnected) return false // Allow click to trigger wallet connect
    if (!inputToken || !outputToken) return true
    if (!inputAmount || parseFloat(inputAmount) === 0) return true
    return false
  }

  const effectiveChainId = chainId || luxMainnet.id

  return (
    <>
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
            token={
              inputToken
                ? {
                    symbol: inputToken.symbol,
                    name: inputToken.name,
                    logoUri: inputToken.logoUri,
                    decimals: inputToken.decimals,
                  }
                : undefined
            }
            onTokenSelect={() => openTokenSelector("input")}
          />

          {/* Swap Direction Button */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="relative z-10 h-8 w-8 rounded-full bg-background hover:rotate-180 transition-transform duration-200"
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
            token={
              outputToken
                ? {
                    symbol: outputToken.symbol,
                    name: outputToken.name,
                    logoUri: outputToken.logoUri,
                    decimals: outputToken.decimals,
                  }
                : undefined
            }
            onTokenSelect={() => openTokenSelector("output")}
            readOnly
          />

          {/* Swap Button */}
          <Button
            className="w-full"
            variant="swap"
            size="xl"
            disabled={isButtonDisabled()}
          >
            {getButtonText()}
          </Button>

          {/* Rate Info */}
          {displayRate && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Rate</span>
              <span>{displayRate}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Token Selector Modal */}
      <TokenSelector
        open={selectorOpen}
        onOpenChange={setSelectorOpen}
        onSelect={handleTokenSelect}
        chainId={effectiveChainId}
        selectedToken={selectorSide === "input" ? inputToken : outputToken}
        excludeToken={selectorSide === "input" ? outputToken : inputToken}
        title={`Select ${selectorSide === "input" ? "input" : "output"} token`}
      />
    </>
  )
}
