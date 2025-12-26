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
