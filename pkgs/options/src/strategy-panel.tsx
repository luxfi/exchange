"use client"

import * as React from "react"
const ChevronDown = ({ className }: { className?: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="m6 9 6 6 6-6"/></svg>
const Plus = ({ className }: { className?: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M12 5v14m-7-7h14"/></svg>
const X = ({ className }: { className?: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M18 6 6 18M6 6l12 12"/></svg>
const Info = ({ className }: { className?: string }) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { cn } from "./ui/cn"

import type { StrategyLeg, StrategyTemplate, StrategyOrder } from "./types"
import { STRATEGY_TEMPLATES as DEFAULT_TEMPLATES } from "./types"

export interface StrategyPanelProps {
  underlying: string | null
  expiration: string | null
  templates?: StrategyTemplate[]
  onSubmit?: (order: StrategyOrder) => void
  onLegsChange?: (legs: StrategyLeg[]) => void
  isConnected?: boolean
  onConnectWallet?: () => void
  className?: string
}

let nextLegId = 0
function createLegId(): string {
  return `leg-${++nextLegId}`
}

export function StrategyPanel({
  underlying,
  expiration,
  templates = DEFAULT_TEMPLATES,
  onSubmit,
  onLegsChange,
  isConnected = false,
  onConnectWallet,
  className,
}: StrategyPanelProps) {
  const [legs, setLegs] = React.useState<StrategyLeg[]>([])
  const [showTemplates, setShowTemplates] = React.useState(false)

  const updateAndNotify = (newLegs: StrategyLeg[]) => {
    setLegs(newLegs)
    onLegsChange?.(newLegs)
  }

  const addLeg = () => {
    updateAndNotify([
      ...legs,
      {
        id: createLegId(),
        side: "buy",
        optionType: "call",
        strike: null,
        quantity: 1,
        ratio: 1,
        expiration,
      },
    ])
  }

  const removeLeg = (id: string) => {
    updateAndNotify(legs.filter((l) => l.id !== id))
  }

  const updateLeg = (id: string, field: keyof StrategyLeg, value: string | number | null) => {
    updateAndNotify(
      legs.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    )
  }

  const applyTemplate = (template: StrategyTemplate) => {
    updateAndNotify(
      template.legs.map((leg) => ({
        ...leg,
        id: createLegId(),
        strike: null,
        expiration,
      }))
    )
    setShowTemplates(false)
  }

  const clearLegs = () => {
    updateAndNotify([])
  }

  const handleSubmit = () => {
    if (!underlying || !expiration || legs.length === 0) return
    if (!isConnected && onConnectWallet) return onConnectWallet()
    onSubmit?.({
      underlying,
      expiration,
      legs,
      type: "net_debit",
      timeInForce: "day",
    })
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
                    {templates.map((t) => (
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

            <div className="grid grid-cols-5 gap-2">
              {/* Buy/Sell */}
              <select
                value={leg.side}
                onChange={(e) => updateLeg(leg.id, "side", e.target.value)}
                className="rounded-md border bg-background px-2 py-1.5 text-xs"
              >
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>

              {/* Call/Put */}
              <select
                value={leg.optionType}
                onChange={(e) => updateLeg(leg.id, "optionType", e.target.value)}
                className="rounded-md border bg-background px-2 py-1.5 text-xs"
              >
                <option value="call">Call</option>
                <option value="put">Put</option>
              </select>

              {/* Strike */}
              <Input
                type="number"
                placeholder="Strike"
                value={leg.strike ?? ""}
                onChange={(e) => updateLeg(leg.id, "strike", e.target.value ? Number(e.target.value) : null)}
                className="h-7 text-xs"
              />

              {/* Quantity */}
              <Input
                type="number"
                placeholder="Qty"
                value={leg.quantity}
                onChange={(e) => updateLeg(leg.id, "quantity", Number(e.target.value) || 1)}
                className="h-7 text-xs"
                min="1"
              />

              {/* Ratio */}
              <Input
                type="number"
                placeholder="Ratio"
                value={leg.ratio}
                onChange={(e) => updateLeg(leg.id, "ratio", Number(e.target.value) || 1)}
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

        {/* Submit */}
        {legs.length > 0 && onSubmit && (
          <Button
            className="w-full"
            size="xl"
            disabled={!underlying || !expiration || legs.some((l) => l.strike === null)}
            onClick={handleSubmit}
          >
            {!isConnected
              ? "Connect Wallet"
              : `Submit ${legs.length}-Leg Order`}
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
