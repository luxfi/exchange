import { keccak256, encodeAbiParameters, type Address } from 'viem'
import type { PoolKey, Currency } from './types'

/**
 * Sort currencies to ensure currency0 < currency1
 */
export function sortCurrencies(currencyA: Currency, currencyB: Currency): [Currency, Currency] {
  const a = BigInt(currencyA)
  const b = BigInt(currencyB)
  return a < b ? [currencyA, currencyB] : [currencyB, currencyA]
}

/**
 * Create a pool key from parameters
 */
export function createPoolKey(
  currencyA: Currency,
  currencyB: Currency,
  fee: number,
  tickSpacing: number,
  hooks: Address = '0x0000000000000000000000000000000000000000'
): PoolKey {
  const [currency0, currency1] = sortCurrencies(currencyA, currencyB)
  return {
    currency0,
    currency1,
    fee,
    tickSpacing,
    hooks,
  }
}

/**
 * Compute pool ID from pool key
 */
export function computePoolId(key: PoolKey): `0x${string}` {
  return keccak256(
    encodeAbiParameters(
      [
        { type: 'address', name: 'currency0' },
        { type: 'address', name: 'currency1' },
        { type: 'uint24', name: 'fee' },
        { type: 'int24', name: 'tickSpacing' },
        { type: 'address', name: 'hooks' },
      ],
      [key.currency0, key.currency1, key.fee, key.tickSpacing, key.hooks]
    )
  )
}

/**
 * Check if two pool keys are equal
 */
export function poolKeysEqual(a: PoolKey, b: PoolKey): boolean {
  return (
    a.currency0.toLowerCase() === b.currency0.toLowerCase() &&
    a.currency1.toLowerCase() === b.currency1.toLowerCase() &&
    a.fee === b.fee &&
    a.tickSpacing === b.tickSpacing &&
    a.hooks.toLowerCase() === b.hooks.toLowerCase()
  )
}
