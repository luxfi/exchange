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

/**
 * DEX backend kind — selects which contracts the swap router targets.
 *
 *   v4         — Lux PoolManager precompile (0x0400). Singleton manager,
 *                hooks per pool, native currency, flash accounting.
 *                Cheapest gas. Default for native Lux/Liquid chains.
 *   v3         — Concentrated liquidity (factory + non-fungible position
 *                manager + swap router). Use for chains that don't have
 *                the precompile (Ethereum mainnet, Arbitrum, etc.).
 *   v2         — Constant-product (factory + router). Fallback for
 *                long-tail liquidity that hasn't migrated.
 *   precompile — Alias of v4 (kept for back-compat).
 *   gateway    — Off-chain gateway (dex.lux.network) that internally
 *                layers v4 → v3 → v2 → cross-chain Warp routing and
 *                returns the best path. Default for whitelabels.
 */
export type DexBackend =
  | { kind: 'v4'; chainId?: number }
  | { kind: 'v3'; chainId?: number }
  | { kind: 'v2'; chainId?: number }
  | { kind: 'precompile'; chainId?: number }     // alias of v4
  | { kind: 'gateway'; url: string }

/**
 * V4 hook permissions — bitfield of which lifecycle hooks the contract implements.
 * Set on the hook address itself per Uniswap V4 hook-permission encoding scheme.
 */
export interface HookPermissions {
  beforeInitialize: boolean
  afterInitialize: boolean
  beforeAddLiquidity: boolean
  afterAddLiquidity: boolean
  beforeRemoveLiquidity: boolean
  afterRemoveLiquidity: boolean
  beforeSwap: boolean
  afterSwap: boolean
  beforeDonate: boolean
  afterDonate: boolean
  beforeSwapReturnDelta: boolean
  afterSwapReturnDelta: boolean
  afterAddLiquidityReturnDelta: boolean
  afterRemoveLiquidityReturnDelta: boolean
}

/** Empty pool — no hook contract attached. */
export const NO_HOOKS: Address = '0x0000000000000000000000000000000000000000'
