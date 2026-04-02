/**
 * Feature-flag wrapper for token spot price.
 *
 * Delegates to the implementation provided by TokenPriceContext,
 * which switches between legacy and centralized based on a feature flag.
 * Only the selected implementation is called — no overfetching.
 */
import { useTokenPriceHooks } from '@l.x/lx/src/features/prices/TokenPriceContext'
import type { CurrencyId } from '@l.x/lx/src/types/currency'

export function useTokenSpotPrice(currencyId: CurrencyId | undefined): number | undefined {
  return useTokenPriceHooks().useTokenSpotPrice(currencyId)
}
