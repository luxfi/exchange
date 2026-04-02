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
