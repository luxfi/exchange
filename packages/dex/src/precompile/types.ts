/**
 * DEX Precompile Types
 * Native Uniswap v4-style AMM implementation
 */
import type { Address } from 'viem'

/**
 * Currency type - address(0) = native LUX
 */
export interface Currency {
  address: Address
}

/**
 * Pool key uniquely identifies a pool
 */
export interface PoolKey {
  currency0: Address // Lower address token (sorted)
  currency1: Address // Higher address token (sorted)
  fee: number // Fee in basis points (3000 = 0.30%)
  tickSpacing: number // Tick spacing for concentrated liquidity
  hooks: Address // Hook contract (address(0) = no hooks)
}

/**
 * Balance delta from swap/liquidity operations
 * Positive = user owes pool, Negative = pool owes user
 */
export interface BalanceDelta {
  amount0: bigint
  amount1: bigint
}

/**
 * Swap parameters
 */
export interface SwapParams {
  zeroForOne: boolean // true = swap token0 for token1
  amountSpecified: bigint // Positive = exact input, Negative = exact output
  sqrtPriceLimitX96: bigint // Price limit (0 = no limit)
}

/**
 * Modify liquidity parameters
 */
export interface ModifyLiquidityParams {
  tickLower: number
  tickUpper: number
  liquidityDelta: bigint
  salt: `0x${string}`
}

/**
 * Pool state
 */
export interface PoolState {
  sqrtPriceX96: bigint
  tick: number
  protocolFee: number
  lpFee: number
}

/**
 * Position info
 */
export interface Position {
  liquidity: bigint
  feeGrowthInside0LastX128: bigint
  feeGrowthInside1LastX128: bigint
}

/**
 * Native LUX currency constant
 */
export const NATIVE_LUX: Address = '0x0000000000000000000000000000000000000000'

/**
 * Sort currencies for pool key creation
 */
export function sortCurrencies(a: Address, b: Address): [Address, Address] {
  return a.toLowerCase() < b.toLowerCase() ? [a, b] : [b, a]
}

/**
 * Create a pool key from two currencies
 */
export function createPoolKey(
  tokenA: Address,
  tokenB: Address,
  fee: number = 3000,
  tickSpacing: number = 60,
  hooks: Address = '0x0000000000000000000000000000000000000000'
): PoolKey {
  const [currency0, currency1] = sortCurrencies(tokenA, tokenB)
  return { currency0, currency1, fee, tickSpacing, hooks }
}

// ============================================================================
// LXBook Types (LP-9020) - CLOB Matching Engine
// ============================================================================

/**
 * Order time-in-force
 */
export enum TIF {
  GTC = 0, // Good-til-canceled (resting)
  IOC = 1, // Immediate-or-cancel
  ALO = 2, // Add-liquidity-only (post-only)
}

/**
 * Order kind
 */
export enum OrderKind {
  LIMIT = 0,
  MARKET = 1,
  STOP_MARKET = 2,
  STOP_LIMIT = 3,
  TAKE_MARKET = 4,
  TAKE_LIMIT = 5,
}

/**
 * Order group type
 */
export enum GroupType {
  NONE = 0,
  OCO = 1, // One-cancels-other
  BRACKET = 2, // Bracket order
}

/**
 * Action type for execute() endpoint
 */
export enum ActionType {
  PLACE = 0,
  CANCEL = 1,
  CANCEL_BY_CLOID = 2,
  MODIFY = 3,
  TWAP_CREATE = 4,
  TWAP_CANCEL = 5,
  SCHEDULE_CANCEL = 6,
  NOOP = 7,
  RESERVE_WEIGHT = 8,
}

/**
 * LXBook Order (LP-9020)
 */
export interface LXOrder {
  marketId: number
  isBuy: boolean
  kind: OrderKind
  sizeX18: bigint
  limitPxX18: bigint
  triggerPxX18: bigint
  reduceOnly: boolean
  tif: TIF
  cloid: `0x${string}`
  groupId: `0x${string}`
  groupType: GroupType
}

/**
 * LXBook Action (execute() payload)
 */
export interface LXAction {
  actionType: ActionType
  nonce: bigint
  expiresAfter: bigint
  data: `0x${string}`
}

/**
 * LXBook PlaceResult
 */
export interface LXPlaceResult {
  oid: bigint
  status: number // 0=rejected, 1=filled, 2=resting, 3=partial
  filledSizeX18: bigint
  avgPxX18: bigint
}

/**
 * LXBook L1 (best bid/ask)
 */
export interface LXL1 {
  bestBidPxX18: bigint
  bestBidSzX18: bigint
  bestAskPxX18: bigint
  bestAskSzX18: bigint
  lastTradePxX18: bigint
}

// ============================================================================
// LXVault Types (LP-9030) - Custody and Risk Engine
// ============================================================================

/**
 * Margin mode
 */
export enum MarginMode {
  CROSS = 0,
  ISOLATED = 1,
}

/**
 * Position side
 */
export enum PositionSide {
  LONG = 0,
  SHORT = 1,
}

/**
 * LXVault Account identifier
 */
export interface LXAccount {
  main: Address
  subaccountId: number
}

/**
 * LXVault Position (LP-9030)
 */
export interface LXPosition {
  marketId: number
  side: PositionSide
  sizeX18: bigint
  entryPxX18: bigint
  unrealizedPnlX18: bigint
  accumulatedFundingX18: bigint
  lastFundingTime: bigint
}

/**
 * LXVault MarginInfo
 */
export interface LXMarginInfo {
  totalCollateralX18: bigint
  usedMarginX18: bigint
  freeMarginX18: bigint
  marginRatioX18: bigint
  maintenanceMarginX18: bigint
  liquidatable: boolean
}

/**
 * LXVault Settlement (LXBook → LXVault)
 */
export interface LXSettlement {
  maker: LXAccount
  taker: LXAccount
  marketId: number
  takerIsBuy: boolean
  sizeX18: bigint
  priceX18: bigint
  makerFeeX18: bigint
  takerFeeX18: bigint
}

/**
 * LXVault LiquidationResult
 */
export interface LXLiquidationResult {
  liquidated: LXAccount
  liquidator: LXAccount
  marketId: number
  sizeX18: bigint
  priceX18: bigint
  penaltyX18: bigint
  adlTriggered: boolean
}

// ============================================================================
// LXFeed Types (LP-9040) - Price Feeds
// ============================================================================

/**
 * LXFeed Mark price
 */
export interface LXMarkPrice {
  indexPxX18: bigint
  markPxX18: bigint
  premiumX18: bigint
  timestamp: bigint
}

/**
 * LXFeed Funding rate
 */
export interface LXFundingRate {
  rateX18: bigint
  nextFundingTime: bigint
}
