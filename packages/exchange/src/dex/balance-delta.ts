import type { BalanceDelta } from './types'

/**
 * Create balance delta from packed int256 (Solidity representation)
 * Upper 128 bits = amount0, Lower 128 bits = amount1
 */
export function unpackBalanceDelta(packed: bigint): BalanceDelta {
  const amount0 = packed >> 128n
  const amount1 = BigInt.asIntN(128, packed)
  return { amount0, amount1 }
}

/**
 * Pack balance delta into int256
 */
export function packBalanceDelta(delta: BalanceDelta): bigint {
  return (delta.amount0 << 128n) | (delta.amount1 & ((1n << 128n) - 1n))
}

/**
 * Add two balance deltas
 */
export function addBalanceDeltas(a: BalanceDelta, b: BalanceDelta): BalanceDelta {
  return {
    amount0: a.amount0 + b.amount0,
    amount1: a.amount1 + b.amount1,
  }
}

/**
 * Negate balance delta
 */
export function negateBalanceDelta(delta: BalanceDelta): BalanceDelta {
  return {
    amount0: -delta.amount0,
    amount1: -delta.amount1,
  }
}

/**
 * Check if balance delta is zero
 */
export function isZeroDelta(delta: BalanceDelta): boolean {
  return delta.amount0 === 0n && delta.amount1 === 0n
}

/**
 * Get the amount for a specific currency (0 or 1)
 */
export function getDeltaAmount(delta: BalanceDelta, currency: 0 | 1): bigint {
  return currency === 0 ? delta.amount0 : delta.amount1
}
