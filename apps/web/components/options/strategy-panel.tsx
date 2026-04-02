"use client"

import * as React from "react"
import { ChevronDown, Plus, X, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// =============================================================================
// TYPES
// =============================================================================

interface StrategyLeg {
  id: string
  side: "buy" | "sell"
  optionType: "call" | "put"
  strike: string
  quantity: string
}

interface StrategyTemplate {
  name: string
  description: string
  legs: Omit<StrategyLeg, "id">[]
}

interface StrategyPanelProps {
  underlying: string | null
  expiration: string | null
  className?: string
}

// =============================================================================
// TEMPLATES
// =============================================================================

const STRATEGY_TEMPLATES: StrategyTemplate[] = [
  {
    name: "Covered Call",
    description: "Long underlying + short call. Earn premium on held assets.",
    legs: [
      { side: "sell", optionType: "call", strike: "", quantity: "1" },
    ],
  },
  {
    name: "Protective Put",
    description: "Long underlying + long put. Downside protection.",
    legs: [
      { side: "buy", optionType: "put", strike: "", quantity: "1" },
    ],
  },
  {
    name: "Bull Call Spread",
    description: "Long lower call + short higher call. Limited risk bullish bet.",
    legs: [
      { side: "buy", optionType: "call", strike: "", quantity: "1" },
      { side: "sell", optionType: "call", strike: "", quantity: "1" },
    ],
  },
  {
    name: "Bear Put Spread",
    description: "Long higher put + short lower put. Limited risk bearish bet.",
    legs: [
      { side: "buy", optionType: "put", strike: "", quantity: "1" },
      { side: "sell", optionType: "put", strike: "", quantity: "1" },
    ],
  },
  {
    name: "Long Straddle",
    description: "Long call + long put at same strike. Profit from high volatility.",
    legs: [
      { side: "buy", optionType: "call", strike: "", quantity: "1" },
      { side: "buy", optionType: "put", strike: "", quantity: "1" },
    ],
  },
  {
    name: "Long Strangle",
    description: "Long OTM call + long OTM put. Cheaper vol play than straddle.",
    legs: [
      { side: "buy", optionType: "call", strike: "", quantity: "1" },
      { side: "buy", optionType: "put", strike: "", quantity: "1" },
    ],
  },
  {
    name: "Iron Condor",
    description: "Short strangle + long wings. Profit from low volatility.",
    legs: [
      { side: "buy", optionType: "put", strike: "", quantity: "1" },
      { side: "sell", optionType: "put", strike: "", quantity: "1" },
      { side: "sell", optionType: "call", strike: "", quantity: "1" },
      { side: "buy", optionType: "call", strike: "", quantity: "1" },
    ],
  },
]

// =============================================================================
// COMPONENT
// =============================================================================

let nextLegId = 0
function createLegId(): string {
  return `leg-${++nextLegId}`
}

export function StrategyPanel({
  underlying,
  expiration,
  className,
}: StrategyPanelProps) {
  const [legs, setLegs] = React.useState<StrategyLeg[]>([])
  const [showTemplates, setShowTemplates] = React.useState(false)

  const addLeg = () => {
    setLegs((prev) => [
      ...prev,
      {
        id: createLegId(),
        side: "buy",
        optionType: "call",
        strike: "",
        quantity: "1",
      },
    ])
  }

  const removeLeg = (id: string) => {
    setLegs((prev) => prev.filter((l) => l.id !== id))
  }

  const updateLeg = (id: string, field: keyof StrategyLeg, value: string) => {
    setLegs((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    )
  }

  const applyTemplate = (template: StrategyTemplate) => {
    setLegs(
      template.legs.map((leg) => ({
        ...leg,
        id: createLegId(),
      }))
    )
    setShowTemplates(false)
  }

  const clearLegs = () => {
    setLegs([])
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Strategy Builder</CardTitle>
          <div className="flex items-center gap-1">
            {legs.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={clearLegs}
              >
                Clear
              </Button>
            )}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={() => setShowTemplates(!showTemplates)}
              >
                Templates
                <ChevronDown className="h-3 w-3" />
              </Button>
              {showTemplates && (
                <div className="absolute right-0 top-full z-50 mt-1 w-72 rounded-lg border bg-popover p-2 shadow-lg">
                  <div className="space-y-1">
                    {STRATEGY_TEMPLATES.map((t) => (
                      <button
                        key={t.name}
                        className="flex w-full flex-col rounded-md px-3 py-2 text-left transition-colors hover:bg-accent"
                        onClick={() => applyTemplate(t)}
                      >
                        <span className="text-sm font-medium">{t.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {t.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {!underlying && (
          <div className="rounded-lg bg-muted px-3 py-4 text-center text-sm text-muted-foreground">
            Select an underlying token to build a strategy
          </div>
        )}

        {underlying && legs.length === 0 && (
          <div className="rounded-lg bg-muted px-3 py-4 text-center text-sm text-muted-foreground">
            <p>Add legs manually or pick a template above</p>
          </div>
        )}

        {/* Legs */}
        {legs.map((leg, idx) => (
          <div
            key={leg.id}
            className="rounded-lg border bg-muted/50 p-3 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Leg {idx + 1}
              </span>
              <button
                onClick={() => removeLeg(leg.id)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {/* Buy/Sell */}
              <select
                value={leg.side}
                onChange={(e) =>
                  updateLeg(leg.id, "side", e.target.value)
                }
                className="rounded-md border bg-background px-2 py-1.5 text-xs"
              >
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>

              {/* Call/Put */}
              <select
                value={leg.optionType}
                onChange={(e) =>
                  updateLeg(leg.id, "optionType", e.target.value)
                }
                className="rounded-md border bg-background px-2 py-1.5 text-xs"
              >
                <option value="call">Call</option>
                <option value="put">Put</option>
              </select>

              {/* Strike */}
              <Input
                type="number"
                placeholder="Strike"
                value={leg.strike}
                onChange={(e) =>
                  updateLeg(leg.id, "strike", e.target.value)
                }
                className="h-7 text-xs"
              />

              {/* Quantity */}
              <Input
                type="number"
                placeholder="Qty"
                value={leg.quantity}
                onChange={(e) =>
                  updateLeg(leg.id, "quantity", e.target.value)
                }
                className="h-7 text-xs"
                min="1"
              />
            </div>
          </div>
        ))}

        {/* Add leg button */}
        {underlying && (
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-1.5 text-xs"
            onClick={addLeg}
          >
            <Plus className="h-3.5 w-3.5" />
            Add Leg
          </Button>
        )}

        {/* Strategy summary */}
        {legs.length > 0 && (
          <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Info className="h-3.5 w-3.5" />
              Strategy Summary
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Underlying</span>
                <span className="font-medium">{underlying}</span>
              </div>
              {expiration && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expiration</span>
                  <span className="font-medium">{expiration}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Legs</span>
                <span className="font-medium">{legs.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Risk</span>
                <span className="font-medium text-muted-foreground">
                  Requires pricing data
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
