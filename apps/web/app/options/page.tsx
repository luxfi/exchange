"use client"

import * as React from "react"
import { useAccount, useChainId } from "wagmi"
import { Header } from "@/components/layout/header"
import {
  SymbolSearch,
  ExpirationBar,
  OptionsChain,
  OptionsOrderForm,
  PositionsTable,
  StrategyPanel,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
  type Token,
  type OptionStrike,
  type OptionPosition,
} from "@l.x/options"
import { getTokensForChain } from "@/lib/tokens"
import { luxMainnet } from "@/lib/chains"

// =============================================================================
// TAB TYPE
// =============================================================================

type BottomTab = "positions" | "strategy"

// =============================================================================
// PAGE
// =============================================================================

export default function OptionsPage() {
  const { isConnected } = useAccount()
  const chainId = useChainId()

  // Selection state
  const [underlying, setUnderlying] = React.useState<Token | null>(null)
  const [selectedExpiration, setSelectedExpiration] = React.useState<string | null>(null)
  const [selectedStrike, setSelectedStrike] = React.useState<number | null>(null)
  const [selectedSide, setSelectedSide] = React.useState<"call" | "put" | null>(null)
  const [bottomTab, setBottomTab] = React.useState<BottomTab>("positions")

  // Tokens for the current chain
  const effectiveChainId = chainId || luxMainnet.id
  const tokens = React.useMemo(
    () => getTokensForChain(effectiveChainId) as Token[],
    [effectiveChainId]
  )

  // Derived state: expirations available for the selected underlying
  // When a real backend is connected, this would come from an API call.
  // For now, an empty array signals "no data available."
  const expirations: string[] = React.useMemo(() => {
    if (!underlying) return []
    return []
  }, [underlying])

  // Derived state: option strikes for selected underlying + expiration
  const strikes: OptionStrike[] = React.useMemo(() => {
    if (!underlying || !selectedExpiration) return []
    return []
  }, [underlying, selectedExpiration])

  // Spot price for the underlying (would come from price feed / oracle)
  const spotPrice = null as number | null

  // Open positions (would come from on-chain state)
  const positions: OptionPosition[] = []

  // Reset downstream state when underlying changes
  React.useEffect(() => {
    setSelectedExpiration(null)
    setSelectedStrike(null)
    setSelectedSide(null)
  }, [underlying])

  // Reset strike selection when expiration changes
  React.useEffect(() => {
    setSelectedStrike(null)
    setSelectedSide(null)
  }, [selectedExpiration])

  const handleSelectOption = (strike: number, side: "call" | "put") => {
    setSelectedStrike(strike)
    setSelectedSide(side)
  }

  return (
    <>
      <Header />
      <main className="flex-1 py-4">
        <div className="container max-w-[1400px]">
          {/* Top bar: symbol selector + spot info */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="flex items-center gap-3">
              <SymbolSearch
                selectedToken={underlying}
                onSelect={setUnderlying}
                tokens={tokens}
              />
              {underlying && (
                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground mr-1.5">Spot</span>
                    <span className="font-mono font-medium">
                      {spotPrice !== null ? spotPrice.toFixed(2) : "--"}
                    </span>
                  </div>
                </div>
              )}
            </div>
            {underlying && (
              <div className="text-xs text-muted-foreground">
                Chain {chainId}
              </div>
            )}
          </div>

          {/* Expiration bar */}
          <ExpirationBar
            expirations={expirations}
            selected={selectedExpiration}
            onSelect={setSelectedExpiration}
            className="mb-4"
          />

          {/* Main content: chain + order form */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
            {/* Options chain table */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Options Chain
                  {underlying && selectedExpiration && (
                    <span className="ml-2 text-muted-foreground font-normal">
                      {underlying.symbol} &mdash; {selectedExpiration}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <OptionsChain
                  strikes={strikes}
                  spotPrice={spotPrice}
                  onSelectOption={handleSelectOption}
                  selectedStrike={selectedStrike}
                  selectedSide={selectedSide}
                />
              </CardContent>
            </Card>

            {/* Sidebar: order form */}
            <div className="space-y-4">
              <OptionsOrderForm
                underlying={underlying?.symbol ?? null}
                strike={selectedStrike}
                optionSide={selectedSide}
                expiration={selectedExpiration}
              />
            </div>
          </div>

          {/* Bottom section: positions / strategy */}
          <div className="mt-4">
            <div className="flex items-center gap-1 mb-3 border-b">
              <button
                className={cn(
                  "px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px",
                  bottomTab === "positions"
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setBottomTab("positions")}
              >
                Positions
              </button>
              <button
                className={cn(
                  "px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px",
                  bottomTab === "strategy"
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setBottomTab("strategy")}
              >
                Strategy Builder
              </button>
            </div>

            {bottomTab === "positions" && (
              <PositionsTable positions={positions} />
            )}
            {bottomTab === "strategy" && (
              <StrategyPanel
                underlying={underlying?.symbol ?? null}
                expiration={selectedExpiration}
              />
            )}
          </div>
        </div>
      </main>
    </>
  )
}
