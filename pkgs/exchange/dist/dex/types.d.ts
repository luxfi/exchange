import type { Address } from 'viem';
/**
 * Currency type - address(0) represents native token
 */
export type Currency = Address;
/**
 * Pool key uniquely identifies a pool
 */
export interface PoolKey {
    currency0: Currency;
    currency1: Currency;
    fee: number;
    tickSpacing: number;
    hooks: Address;
}
/**
 * Balance delta represents changes in token balances
 * Positive = user owes pool, Negative = pool owes user
 */
export interface BalanceDelta {
    amount0: bigint;
    amount1: bigint;
}
/**
 * Swap parameters
 */
export interface SwapParams {
    zeroForOne: boolean;
    amountSpecified: bigint;
    sqrtPriceLimitX96: bigint;
}
/**
 * Modify liquidity parameters
 */
export interface ModifyLiquidityParams {
    tickLower: number;
    tickUpper: number;
    liquidityDelta: bigint;
    salt: `0x${string}`;
}
/**
 * Pool slot0 state
 */
export interface Slot0 {
    sqrtPriceX96: bigint;
    tick: number;
    protocolFee: number;
    lpFee: number;
}
/**
 * Fee tiers (in hundredths of a bip)
 */
export declare const FEE_TIERS: {
    readonly LOWEST: 100;
    readonly LOW: 500;
    readonly MEDIUM: 3000;
    readonly HIGH: 10000;
};
/**
 * Tick spacing for fee tiers
 */
export declare const TICK_SPACINGS: Record<number, number>;
/**
 * Native currency constant
 */
export declare const NATIVE_CURRENCY: Currency;
/**
 * Check if currency is native
 */
export declare function isNativeCurrency(currency: Currency): boolean;
//# sourceMappingURL=types.d.ts.map