import { type Address } from 'viem';
import type { PoolKey, Currency } from './types';
/**
 * Sort currencies to ensure currency0 < currency1
 */
export declare function sortCurrencies(currencyA: Currency, currencyB: Currency): [Currency, Currency];
/**
 * Create a pool key from parameters
 */
export declare function createPoolKey(currencyA: Currency, currencyB: Currency, fee: number, tickSpacing: number, hooks?: Address): PoolKey;
/**
 * Compute pool ID from pool key
 */
export declare function computePoolId(key: PoolKey): `0x${string}`;
/**
 * Check if two pool keys are equal
 */
export declare function poolKeysEqual(a: PoolKey, b: PoolKey): boolean;
//# sourceMappingURL=pool-key.d.ts.map