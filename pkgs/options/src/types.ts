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
