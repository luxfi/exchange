export interface Token {
  symbol: string
  name: string
  decimals: number
  address: string | null
  logoUri: string
  chainId: number
  isNative?: boolean
  isWrappedNative?: boolean
  balance?: string
}

export interface OptionQuote {
  bid: number | null
  ask: number | null
  last: number | null
  volume: number
  openInterest: number
  iv: number | null
  delta: number | null
}

export interface OptionStrike {
  strike: number
  call: OptionQuote
  put: OptionQuote
}

export interface OptionPosition {
  id: string
  underlying: string
  strike: number
  side: "call" | "put"
  direction: "long" | "short"
  quantity: number
  avgEntry: number
  markPrice: number
  expiration: string
  pnl: number
  pnlPercent: number
}

// Multi-leg strategy types

export interface StrategyLeg {
  id: string
  side: "buy" | "sell"
  optionType: "call" | "put"
  strike: number | null
  quantity: number
  ratio: number
  expiration?: string | null
}

export interface StrategyTemplate {
  name: string
  description: string
  legCount: 1 | 2 | 3 | 4
  legs: Omit<StrategyLeg, "id" | "strike" | "expiration">[]
}

export interface StrategyOrder {
  underlying: string
  expiration: string
  legs: StrategyLeg[]
  type: "net_debit" | "net_credit" | "even"
  limitPrice?: number
  timeInForce: "day" | "gtc" | "ioc"
}

// Margin types (compatible with Alpaca RegT margin)

export type MarginType = "cash" | "reg_t" | "portfolio"

export interface MarginRequirement {
  initialMargin: number
  maintenanceMargin: number
  buyingPower: number
  maxQuantity: number
  marginType: MarginType
}

export interface AccountMargin {
  equity: number
  cashBalance: number
  buyingPower: number
  dayTradingBuyingPower: number
  regtBuyingPower: number
  initialMargin: number
  maintenanceMargin: number
  marginMultiplier: number
  patternDayTrader: boolean
}

export interface OptionsApprovalLevel {
  level: 1 | 2 | 3 | 4
  description: string
  allowedStrategies: string[]
}

// Greeks (matches broker pkg/types Greeks)
export interface Greeks {
  delta: number | null
  gamma: number | null
  theta: number | null
  vega: number | null
  rho: number | null
  iv: number | null
}

// Full option contract (matches broker OptionContract)
export interface OptionContract {
  symbol: string            // OCC symbol e.g. AAPL260418C00150000
  underlying: string
  contractType: "call" | "put"
  strike: number
  expiration: string        // YYYY-MM-DD
  style: "american" | "european"
  tradable: boolean
  bid: number
  ask: number
  last: number
  volume: number
  openInterest: number
  greeks: Greeks
}

// Order actions (matches broker OptionLeg.Action)
export type OptionAction = "buy_to_open" | "buy_to_close" | "sell_to_open" | "sell_to_close"

// Multi-leg order leg (matches broker OptionLeg)
export interface OptionLeg {
  contractSymbol?: string
  contractType: "call" | "put"
  strike: number
  expiration: string
  action: OptionAction
  quantity: number
}

// Multi-leg order request (matches broker CreateMultiLegOrderRequest)
export interface MultiLegOrderRequest {
  symbol: string
  strategyType: "vertical" | "iron_condor" | "straddle" | "strangle" | "calendar" | "butterfly" | "custom"
  legs: OptionLeg[]
  orderType: "limit" | "market"
  limitPrice?: number
  timeInForce: "day" | "gtc" | "ioc"
}

// Multi-leg order result (matches broker MultiLegOrderResult)
export interface MultiLegOrderResult {
  strategyOrderId: string
  legOrders?: Array<{ id: string; status: string }>
  netPremium?: number
  status: string
}

// ============================================================================
// FUTURES
// ============================================================================

export interface FuturesContract {
  symbol: string           // e.g. ESM26, CLQ26
  underlying: string       // e.g. ES, CL
  name: string
  expiration: string
  exchange: string         // CME, NYMEX, CBOT, ICE
  tickSize: number
  pointValue: number       // dollar value per point
  marginInitial: number
  marginMaintenance: number
  last: number
  bid: number
  ask: number
  volume: number
  openInterest: number
  settlementPrice: number
  change: number
  changePercent: number
}

export interface FuturesPosition {
  id: string
  symbol: string
  underlying: string
  side: "long" | "short"
  quantity: number
  avgEntry: number
  markPrice: number
  unrealizedPnl: number
  marginUsed: number
  expiration: string
}

export interface FuturesOrderRequest {
  symbol: string
  side: "buy" | "sell"
  quantity: number
  orderType: "limit" | "market" | "stop" | "stop_limit"
  limitPrice?: number
  stopPrice?: number
  timeInForce: "day" | "gtc" | "ioc"
}

// ============================================================================
// FX / FOREX
// ============================================================================

export interface FXPair {
  symbol: string           // e.g. EUR/USD, GBP/JPY
  base: string             // e.g. EUR
  quote: string            // e.g. USD
  bid: number
  ask: number
  spread: number
  high24h: number
  low24h: number
  volume24h: number
  change24h: number
  changePercent24h: number
  pipSize: number          // e.g. 0.0001 for most, 0.01 for JPY pairs
  maxLeverage: number
}

export interface FXPosition {
  id: string
  symbol: string
  side: "long" | "short"
  quantity: number          // lot size
  avgEntry: number
  markPrice: number
  unrealizedPnl: number
  marginUsed: number
  leverage: number
  swapRate: number          // overnight carry
}

export interface FXOrderRequest {
  symbol: string
  side: "buy" | "sell"
  quantity: number
  orderType: "limit" | "market" | "stop" | "stop_limit"
  limitPrice?: number
  stopPrice?: number
  takeProfit?: number
  stopLoss?: number
  timeInForce: "day" | "gtc" | "ioc"
}

// ============================================================================
// FIXED INCOME / BONDS
// ============================================================================

export interface Bond {
  cusip: string
  isin?: string
  name: string
  issuer: string
  coupon: number            // annual coupon rate
  maturityDate: string
  yieldToMaturity: number
  price: number             // clean price
  accrued: number           // accrued interest
  dirtyPrice: number        // clean + accrued
  faceValue: number
  rating: string            // e.g. AAA, BBB+
  sector: string            // government, corporate, municipal
  frequency: "annual" | "semi_annual" | "quarterly" | "monthly"
  callable: boolean
  callDate?: string
}

export interface BondPosition {
  id: string
  cusip: string
  name: string
  faceValue: number
  quantity: number
  avgPrice: number
  markPrice: number
  coupon: number
  yieldAtPurchase: number
  currentYield: number
  unrealizedPnl: number
  accruedInterest: number
  maturityDate: string
  nextCouponDate: string
}

// ============================================================================
// UNIFIED INSTRUMENT TYPE
// ============================================================================

export type InstrumentClass = "equity" | "option" | "future" | "fx" | "crypto" | "bond"

export interface Instrument {
  symbol: string
  name: string
  class: InstrumentClass
  exchange?: string
  tradable: boolean
  marginable: boolean
  shortable: boolean
  fractionable: boolean
}

export const OPTIONS_APPROVAL_LEVELS: OptionsApprovalLevel[] = [
  {
    level: 1,
    description: "Covered calls, cash-secured puts",
    allowedStrategies: ["Covered Call", "Protective Put"],
  },
  {
    level: 2,
    description: "Long options, debit spreads",
    allowedStrategies: [
      "Long Call", "Long Put", "Covered Call", "Protective Put",
      "Bull Call Spread", "Bear Put Spread", "Long Straddle", "Long Strangle",
    ],
  },
  {
    level: 3,
    description: "Credit spreads, short spreads",
    allowedStrategies: [
      "Long Call", "Long Put", "Covered Call", "Protective Put",
      "Bull Call Spread", "Bear Put Spread", "Long Straddle", "Long Strangle",
      "Call Ratio Spread", "Iron Condor", "Iron Butterfly", "Call Butterfly", "Box Spread",
    ],
  },
  {
    level: 4,
    description: "Naked options (full access)",
    allowedStrategies: ["*"],
  },
]

// Standard 2-leg and 4-leg templates

export const STRATEGY_TEMPLATES: StrategyTemplate[] = [
  // Single leg
  {
    name: "Long Call",
    description: "Bullish directional bet with limited downside.",
    legCount: 1,
    legs: [{ side: "buy", optionType: "call", quantity: 1, ratio: 1 }],
  },
  {
    name: "Long Put",
    description: "Bearish directional bet with limited downside.",
    legCount: 1,
    legs: [{ side: "buy", optionType: "put", quantity: 1, ratio: 1 }],
  },
  // 2-leg spreads
  {
    name: "Covered Call",
    description: "Long underlying + short call. Earn premium on held assets.",
    legCount: 1,
    legs: [{ side: "sell", optionType: "call", quantity: 1, ratio: 1 }],
  },
  {
    name: "Protective Put",
    description: "Long underlying + long put. Downside protection.",
    legCount: 1,
    legs: [{ side: "buy", optionType: "put", quantity: 1, ratio: 1 }],
  },
  {
    name: "Bull Call Spread",
    description: "Long lower call + short higher call. Limited risk bullish.",
    legCount: 2,
    legs: [
      { side: "buy", optionType: "call", quantity: 1, ratio: 1 },
      { side: "sell", optionType: "call", quantity: 1, ratio: 1 },
    ],
  },
  {
    name: "Bear Put Spread",
    description: "Long higher put + short lower put. Limited risk bearish.",
    legCount: 2,
    legs: [
      { side: "buy", optionType: "put", quantity: 1, ratio: 1 },
      { side: "sell", optionType: "put", quantity: 1, ratio: 1 },
    ],
  },
  {
    name: "Long Straddle",
    description: "Long call + long put at same strike. Profit from volatility.",
    legCount: 2,
    legs: [
      { side: "buy", optionType: "call", quantity: 1, ratio: 1 },
      { side: "buy", optionType: "put", quantity: 1, ratio: 1 },
    ],
  },
  {
    name: "Long Strangle",
    description: "Long OTM call + long OTM put. Cheaper vol play.",
    legCount: 2,
    legs: [
      { side: "buy", optionType: "call", quantity: 1, ratio: 1 },
      { side: "buy", optionType: "put", quantity: 1, ratio: 1 },
    ],
  },
  {
    name: "Call Ratio Spread",
    description: "Buy 1 call, sell 2 higher calls. Credit spread with upside cap.",
    legCount: 2,
    legs: [
      { side: "buy", optionType: "call", quantity: 1, ratio: 1 },
      { side: "sell", optionType: "call", quantity: 2, ratio: 2 },
    ],
  },
  // 4-leg spreads
  {
    name: "Iron Condor",
    description: "Short strangle + long wings. Profit from low volatility.",
    legCount: 4,
    legs: [
      { side: "buy", optionType: "put", quantity: 1, ratio: 1 },
      { side: "sell", optionType: "put", quantity: 1, ratio: 1 },
      { side: "sell", optionType: "call", quantity: 1, ratio: 1 },
      { side: "buy", optionType: "call", quantity: 1, ratio: 1 },
    ],
  },
  {
    name: "Iron Butterfly",
    description: "Short straddle + long wings. Max profit at center strike.",
    legCount: 4,
    legs: [
      { side: "buy", optionType: "put", quantity: 1, ratio: 1 },
      { side: "sell", optionType: "put", quantity: 1, ratio: 1 },
      { side: "sell", optionType: "call", quantity: 1, ratio: 1 },
      { side: "buy", optionType: "call", quantity: 1, ratio: 1 },
    ],
  },
  {
    name: "Call Butterfly",
    description: "Buy 1 lower + 1 higher call, sell 2 middle calls.",
    legCount: 4,
    legs: [
      { side: "buy", optionType: "call", quantity: 1, ratio: 1 },
      { side: "sell", optionType: "call", quantity: 2, ratio: 2 },
      { side: "buy", optionType: "call", quantity: 1, ratio: 1 },
    ],
  },
  {
    name: "Box Spread",
    description: "Bull call spread + bear put spread. Arbitrage / financing.",
    legCount: 4,
    legs: [
      { side: "buy", optionType: "call", quantity: 1, ratio: 1 },
      { side: "sell", optionType: "call", quantity: 1, ratio: 1 },
      { side: "buy", optionType: "put", quantity: 1, ratio: 1 },
      { side: "sell", optionType: "put", quantity: 1, ratio: 1 },
    ],
  },
]
