/**
 * Lux DEX Gateway - Advanced Trading Types
 *
 * TypeScript types matching the Go DEX gateway at ~/work/lux/dex.
 * Covers CLOB orders, perpetual futures, margin, vaults, and market data.
 */

// ─── Enums ───────────────────────────────────────────────────────────

export enum OrderType {
  Market = 'market',
  Limit = 'limit',
  Stop = 'stop',
  StopLimit = 'stop_limit',
  Iceberg = 'iceberg',
  Peg = 'peg',
  Bracket = 'bracket',
  Hidden = 'hidden',
}

export enum OrderSide {
  Buy = 'buy',
  Sell = 'sell',
}

export enum TimeInForce {
  GTC = 'GTC', // Good Till Cancelled
  IOC = 'IOC', // Immediate Or Cancel
  FOK = 'FOK', // Fill Or Kill
  DAY = 'DAY', // Day Order
  GTD = 'GTD', // Good Till Date
  PostOnly = 'POST_ONLY',
}

export enum OrderStatus {
  Pending = 'pending',
  Open = 'open',
  PartiallyFilled = 'partially_filled',
  Filled = 'filled',
  Cancelled = 'cancelled',
  Rejected = 'rejected',
  Expired = 'expired',
}

export enum MarginMode {
  Cross = 'cross',
  Isolated = 'isolated',
  Portfolio = 'portfolio',
}

export enum PositionSide {
  Long = 'long',
  Short = 'short',
}

// ─── Orders ──────────────────────────────────────────────────────────

export interface PlaceOrderRequest {
  symbol: string
  type: OrderType
  side: OrderSide
  price?: string // Required for limit, stop-limit
  size: string
  stopPrice?: string // For stop, stop-limit, bracket
  timeInForce?: TimeInForce
  postOnly?: boolean
  reduceOnly?: boolean
  clientId?: string
  // Bracket order fields
  takeProfit?: string
  stopLoss?: string
  // Iceberg fields
  displaySize?: string
  // Peg fields
  pegOffset?: string
}

export interface Order {
  orderId: string
  symbol: string
  type: OrderType
  side: OrderSide
  price: string
  size: string
  filledSize: string
  remainingSize: string
  status: OrderStatus
  timeInForce: TimeInForce
  postOnly: boolean
  reduceOnly: boolean
  hidden: boolean
  clientId?: string
  stopPrice?: string
  takeProfit?: string
  stopLoss?: string
  displaySize?: string
  pegOffset?: string
  avgFillPrice?: string
  fees: string
  createdAt: string
  updatedAt: string
}

export interface CancelOrderRequest {
  orderId: string
  symbol?: string
}

export interface CancelAllOrdersRequest {
  symbol?: string
  side?: OrderSide
}

// ─── Order Book ──────────────────────────────────────────────────────

export interface PriceLevel {
  price: string
  size: string
  count: number
}

export interface OrderBook {
  symbol: string
  bids: PriceLevel[]
  asks: PriceLevel[]
  timestamp: string
  sequence: number
}

export interface OrderBookUpdate {
  type: 'snapshot' | 'update'
  symbol: string
  bids: PriceLevel[]
  asks: PriceLevel[]
  timestamp: string
  sequence: number
}

// ─── Trades / Market Data ────────────────────────────────────────────

export interface RecentTrade {
  id: string
  symbol: string
  price: string
  size: string
  side: OrderSide
  timestamp: string
}

export interface MarketStats {
  symbol: string
  lastPrice: string
  markPrice: string
  indexPrice: string
  high24h: string
  low24h: string
  volume24h: string
  volumeUsd24h: string
  change24h: string
  changePct24h: string
  openInterest: string
  fundingRate: string
  nextFundingTime: string
}

export interface Market {
  symbol: string
  baseAsset: string
  quoteAsset: string
  type: 'spot' | 'perpetual'
  status: 'active' | 'paused' | 'delisted'
  tickSize: string
  stepSize: string
  minOrderSize: string
  maxOrderSize: string
  maxLeverage: number
  makerFee: string
  takerFee: string
  maintenanceMargin: string
  initialMargin: string
}

// ─── Perpetual Futures ───────────────────────────────────────────────

export interface PerpPosition {
  symbol: string
  side: PositionSide
  size: string
  entryPrice: string
  markPrice: string
  liquidationPrice: string
  unrealizedPnl: string
  realizedPnl: string
  margin: string
  leverage: string
  marginMode: MarginMode
  fundingPaid: string
  openTime: string
  updatedAt: string
}

export interface FundingRate {
  symbol: string
  rate: string
  premiumIndex: string
  interestRate: string
  markTwap: string
  indexTwap: string
  timestamp: string
  paymentTime: string
  openInterest: string
}

export interface FundingPayment {
  symbol: string
  amount: string
  rate: string
  positionSize: string
  timestamp: string
}

export interface SetLeverageRequest {
  symbol: string
  leverage: number // 1-100
}

export interface SetMarginModeRequest {
  symbol: string
  mode: MarginMode
}

// ─── Margin Account ──────────────────────────────────────────────────

export interface MarginAccount {
  accountType: MarginMode
  equity: string
  balance: string
  marginUsed: string
  freeMargin: string
  marginLevel: string
  unrealizedPnl: string
  realizedPnl: string
  positions: PerpPosition[]
  collateral: CollateralAsset[]
}

export interface CollateralAsset {
  asset: string
  amount: string
  valueUsd: string
  haircut: string // Discount percentage (e.g. "0.05" = 5%)
  available: string
  locked: string
}

// ─── Vaults & Copy-Trading ───────────────────────────────────────────

export interface Vault {
  id: string
  name: string
  description: string
  leader: string // Leader wallet address
  totalDeposits: string
  performance30d: string
  performanceAll: string
  sharpe: string
  maxDrawdown: string
  copierCount: number
  profitShare: string // e.g. "0.10" = 10%
  managementFee: string
  minDeposit: string
  lockupPeriod: number // seconds
  status: 'active' | 'paused' | 'closed'
  createdAt: string
}

export interface VaultPosition {
  vaultId: string
  shares: string
  depositValue: string
  currentValue: string
  unrealizedPnl: string
  lockedUntil: string
}

export interface DepositVaultRequest {
  vaultId: string
  amount: string
}

export interface WithdrawVaultRequest {
  vaultId: string
  shares: string
}

// ─── WebSocket Messages ──────────────────────────────────────────────

export type WsChannel =
  | 'orderbook'
  | 'trades'
  | 'ticker'
  | 'orders'
  | 'positions'
  | 'account'
  | 'funding'

export interface WsSubscription {
  channel: WsChannel
  symbol?: string
}

export interface WsMessage<T = unknown> {
  channel: WsChannel
  type: 'snapshot' | 'update'
  symbol?: string
  data: T
  timestamp: string
}

// ─── API Response Wrapper ────────────────────────────────────────────

export interface DexApiResponse<T> {
  success: boolean
  data: T
  error?: string
  timestamp: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  offset: number
  limit: number
}
