// Components
export { SymbolSearch } from "./symbol-search"
export { ExpirationBar } from "./expiration-bar"
export { OptionsChain } from "./options-chain"
export { OptionsOrderForm, type OptionsOrderFormProps } from "./options-order-form"
export { PositionsTable, type PositionsTableProps } from "./positions-table"
export { StrategyPanel, type StrategyPanelProps } from "./strategy-panel"

// Types — Options
export type {
  Token,
  OptionQuote,
  OptionStrike,
  OptionPosition,
  StrategyLeg,
  StrategyTemplate,
  StrategyOrder,
  Greeks,
  OptionContract,
  OptionAction,
  OptionLeg,
  MultiLegOrderRequest,
  MultiLegOrderResult,
} from "./types"

// Types — Margin
export type {
  MarginType,
  MarginRequirement,
  AccountMargin,
  OptionsApprovalLevel,
} from "./types"

// Types — Futures
export type {
  FuturesContract,
  FuturesPosition,
  FuturesOrderRequest,
} from "./types"

// Types — FX
export type {
  FXPair,
  FXPosition,
  FXOrderRequest,
} from "./types"

// Types — Fixed Income
export type {
  Bond,
  BondPosition,
} from "./types"

// Types — Unified
export type {
  InstrumentClass,
  Instrument,
} from "./types"

// Default templates and approval levels (consumers can override or extend)
export { STRATEGY_TEMPLATES, OPTIONS_APPROVAL_LEVELS } from "./types"

// UI primitives (re-exported for consumers that need them)
export { cn } from "./ui/cn"
export { Button, buttonVariants, type ButtonProps } from "./ui/button"
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "./ui/card"
export { Input, type InputProps } from "./ui/input"
export { TokenIcon } from "./ui/token-icon"
