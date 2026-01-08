import { Percent } from '@luxamm/sdk-core'
import { useMemo } from 'react'
import { useLocalizationContext } from 'lx/src/features/language/LocalizationContext'
import { DerivedSwapInfo } from 'lx/src/features/transactions/swap/types/derivedSwapInfo'
import { formatPriceImpact } from 'lx/src/features/transactions/swap/utils/formatPriceImpact'
import { getPriceImpact } from 'lx/src/features/transactions/swap/utils/getPriceImpact'

/** Returns the price impact of the current trade, including UniswapX trades. UniswapX trades do not have typical pool-based price impact; we use a frontend-calculated metric. */
export function usePriceImpact({ derivedSwapInfo }: { derivedSwapInfo: DerivedSwapInfo }): {
  priceImpact: Percent | undefined
  formattedPriceImpact: string | undefined
} {
  const { formatPercent } = useLocalizationContext()

  return useMemo(() => {
    const priceImpact = getPriceImpact(derivedSwapInfo)

    if (!priceImpact) {
      return { priceImpact: undefined, formattedPriceImpact: undefined }
    }

    const formattedPriceImpact = formatPriceImpact(priceImpact, formatPercent)

    return { priceImpact, formattedPriceImpact }
  }, [derivedSwapInfo, formatPercent])
}
