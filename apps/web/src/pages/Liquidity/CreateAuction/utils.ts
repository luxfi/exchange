import { type Currency, type CurrencyAmount, Fraction, Percent } from '@uniswap/sdk-core'
import { nativeOnChain } from 'uniswap/src/constants/tokens'
import { getChainInfo } from 'uniswap/src/features/chains/chainInfo'
import type { UniverseChainId } from 'uniswap/src/features/chains/types'
import { AuctionType, PriceRangeStrategy, RaiseCurrency } from '~/pages/Liquidity/CreateAuction/types'

const PERCENT_SCALE = 1_000_000

/**
 * Returns the recommended price range strategy for a given auction type.
 */
export function getRecommendedStrategy(auctionType: AuctionType): PriceRangeStrategy {
  return auctionType === AuctionType.BOOTSTRAP_LIQUIDITY
    ? PriceRangeStrategy.CONCENTRATED_FULL_RANGE
    : PriceRangeStrategy.FULL_RANGE
}

/**
 * Maps RaiseCurrency + chainId to the corresponding SDK Currency.
 * Use this whenever you need a Currency from the raise-currency constant (e.g. for pool data, sorting).
 */
export function getRaiseCurrencyAsCurrency(
  raiseCurrency: RaiseCurrency,
  chainId: UniverseChainId,
): Currency | undefined {
  switch (raiseCurrency) {
    case RaiseCurrency.ETH:
      return nativeOnChain(chainId)
    case RaiseCurrency.USDC:
      return getChainInfo(chainId).tokens.USDC
    default:
      return undefined
  }
}

/**
 * Converts a float percentage into a SDK Percent (exact rational).
 * Supports up to 6 decimal places in the percentage value.
 */
function toPercent(value: number): Percent {
  return new Percent(Math.round(value * PERCENT_SCALE), 100 * PERCENT_SCALE)
}

/**
 * Applies a float percentage to a CurrencyAmount and returns the exact result.
 */
export function percentOfAmount(amount: CurrencyAmount<Currency>, percent: number): CurrencyAmount<Currency> {
  return amount.multiply(toPercent(percent))
}

/**
 * Derives the float percentage that `part` represents of `total`.
 * Uses the SDK's Fraction for exact rational division.
 *
 * Precondition: `total` and `part` must share the same currency and decimals —
 * this function divides raw `quotient` values directly without currency conversion.
 */
export function amountToPercent(total: CurrencyAmount<Currency>, part: CurrencyAmount<Currency>): number {
  if (total.equalTo(0)) {
    return 0
  }
  const ratio = new Fraction(part.quotient, total.quotient).multiply(100)
  return parseFloat(ratio.toFixed(6))
}
