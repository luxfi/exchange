import { useMemo } from 'react'
import { useAppFiatCurrency } from 'lx/src/features/fiatCurrency/hooks'
import {
  FiatDeltaFormatOptions,
  FormattedFiatDelta,
} from 'lx/src/features/fiatCurrency/priceChart/formatters/shared/types'
import { formatChartFiatDelta } from 'lx/src/features/fiatCurrency/priceChart/priceChartConversion'
import { useLocalizationContext } from 'lx/src/features/language/LocalizationContext'

/**
 * Hook for formatting chart fiat delta values using the app's current fiat currency
 */
export function useFormatChartFiatDelta(): {
  formatChartFiatDelta: (
    options: Omit<FiatDeltaFormatOptions, 'currency' | 'formatNumberOrString'>,
  ) => FormattedFiatDelta
} {
  const currency = useAppFiatCurrency()
  const { formatNumberOrString } = useLocalizationContext()

  return useMemo(
    () => ({
      formatChartFiatDelta: (
        options: Omit<FiatDeltaFormatOptions, 'currency' | 'formatNumberOrString'>,
      ): FormattedFiatDelta => {
        return formatChartFiatDelta({ ...options, currency, formatNumberOrString })
      },
    }),
    [currency, formatNumberOrString],
  )
}
