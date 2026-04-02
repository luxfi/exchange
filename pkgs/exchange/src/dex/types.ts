import type { Address } from 'viem'

/**
 * Currency type - address(0) represents native token
 */
export type Currency = Address

/**
 * Pool key uniquely identifies a pool
 */
export interface PoolKey {
  currency0: Currency
  currency1: Currency
  fee: number       // uint24 - fee in hundredths of a bip (e.g., 3000 = 0.30%)
  tickSpacing: number // int24
  hooks: Address    // Hook contract address (address(0) = no hooks)
}

/**
 * Balance delta represents changes in token balances
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
  zeroForOne: boolean       // Direction: true = token0 -> token1
  amountSpecified: bigint   // Positive = exact input, Negative = exact output
  sqrtPriceLimitX96: bigint // Price limit (0 for no limit)
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
 * Pool slot0 state
 */
export interface Slot0 {
  sqrtPriceX96: bigint
  tick: number
  protocolFee: number
  lpFee: number
}

/**
 * Fee tiers (in hundredths of a bip)
 */
export const FEE_TIERS = {
  LOWEST: 100,    // 0.01%
  LOW: 500,       // 0.05%
  MEDIUM: 3000,   // 0.30%
  HIGH: 10000,    // 1.00%
} as const

/**
 * Tick spacing for fee tiers
 */
export const TICK_SPACINGS: Record<number, number> = {
  100: 1,
  500: 10,
  3000: 60,
  10000: 200,
}

/**
 * Native currency constant
 */
export const NATIVE_CURRENCY: Currency = '0x0000000000000000000000000000000000000000'

/**
 * Check if currency is native
 */
export function isNativeCurrency(currency: Currency): boolean {
  return currency === NATIVE_CURRENCY
}
