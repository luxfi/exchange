import type { Percent } from '@luxamm/sdk-core'
import type { LocalizationContextState } from 'lx/src/features/language/LocalizationContext'

export function formatPriceImpact(
  priceImpact: Percent,
  formatPercent: LocalizationContextState['formatPercent'],
): string | undefined {
  const positiveImpactPrefix = priceImpact.lessThan(0) ? '+' : ''
  return `${positiveImpactPrefix}${formatPercent(priceImpact.multiply(-1).toFixed(3))}`
}
