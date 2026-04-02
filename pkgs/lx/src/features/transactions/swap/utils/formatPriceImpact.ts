import type { Percent } from '@luxamm/sdk-core'
import type { LocalizationContextState } from '@l.x/lx/src/features/language/LocalizationContext'

export function formatPriceImpact(
  priceImpact: Percent,
  formatPercent: LocalizationContextState['formatPercent'],
): string | undefined {
  const absImpact = priceImpact.lessThan(0) ? priceImpact.multiply(-1) : priceImpact
  return formatPercent(absImpact.toFixed(3))
}
