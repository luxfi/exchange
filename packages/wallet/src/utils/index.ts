import type { Address } from 'viem'

/**
 * Format address to short form
 */
export function formatAddress(address: Address, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

/**
 * Format balance with decimals
 */
export function formatBalance(value: bigint, decimals: number, displayDecimals = 4): string {
  const divisor = 10n ** BigInt(decimals)
  const whole = value / divisor
  const fraction = value % divisor

  const fractionStr = fraction.toString().padStart(decimals, '0').slice(0, displayDecimals)
  const result = `${whole}.${fractionStr}`.replace(/\.?0+$/, '')

  return result || '0'
}

/**
 * Parse amount string to bigint
 */
export function parseAmount(value: string, decimals: number): bigint {
  const [whole, fraction = ''] = value.split('.')
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals)
  return BigInt(whole + paddedFraction)
}

/**
 * Format USD value
 */
export function formatUSD(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

/**
 * Check if address is valid
 */
export function isValidAddress(address: string): address is Address {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Calculate price impact
 */
export function calculatePriceImpact(
  inputAmount: bigint,
  outputAmount: bigint,
  marketRate: bigint,
  decimalsIn: number,
  decimalsOut: number
): number {
  if (inputAmount === 0n || marketRate === 0n) return 0

  const normalizedInput = inputAmount * 10n ** BigInt(18 - decimalsIn)
  const normalizedOutput = outputAmount * 10n ** BigInt(18 - decimalsOut)

  const expectedOutput = (normalizedInput * marketRate) / 10n ** 18n
  const impact = ((expectedOutput - normalizedOutput) * 10000n) / expectedOutput

  return Number(impact) / 100
}
