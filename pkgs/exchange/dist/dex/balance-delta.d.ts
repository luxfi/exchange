import type { BalanceDelta } from './types';
/**
 * Create balance delta from packed int256 (Solidity representation)
 * Upper 128 bits = amount0, Lower 128 bits = amount1
 */
export declare function unpackBalanceDelta(packed: bigint): BalanceDelta;
/**
 * Pack balance delta into int256
 */
export declare function packBalanceDelta(delta: BalanceDelta): bigint;
/**
 * Add two balance deltas
 */
export declare function addBalanceDeltas(a: BalanceDelta, b: BalanceDelta): BalanceDelta;
/**
 * Negate balance delta
 */
export declare function negateBalanceDelta(delta: BalanceDelta): BalanceDelta;
/**
 * Check if balance delta is zero
 */
export declare function isZeroDelta(delta: BalanceDelta): boolean;
/**
 * Get the amount for a specific currency (0 or 1)
 */
export declare function getDeltaAmount(delta: BalanceDelta, currency: 0 | 1): bigint;
//# sourceMappingURL=balance-delta.d.ts.map