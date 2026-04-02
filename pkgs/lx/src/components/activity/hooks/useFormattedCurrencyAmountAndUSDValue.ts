import { Currency } from '@luxamm/sdk-core'
import { PollingInterval } from 'lx/src/constants/misc'
import { LocalizationContextState } from 'lx/src/features/language/LocalizationContext'
import { getCurrencyAmount, ValueType } from 'lx/src/features/tokens/getCurrencyAmount'
import { useUSDCValueWithStatus } from 'lx/src/features/transactions/hooks/useUSDCPriceWrapper'
import { NumberType } from 'utilities/src/format/types'

export function useFormattedCurrencyAmountAndUSDValue({
  currency,
  currencyAmountRaw,
  formatter,
  isApproximateAmount = false,
  valueType = ValueType.Raw,
  isLxSwap = false,
  pollInterval = PollingInterval.Fast,
}: {
  currency: Maybe<Currency>
  currencyAmountRaw: string | undefined
  formatter: LocalizationContextState
  isApproximateAmount?: boolean
  valueType?: ValueType
  isLxSwap?: boolean
  pollInterval?: PollingInterval
}): { amount: string; value: string; tilde: string; isLoading: boolean } {
  const currencyAmount = getCurrencyAmount({
    value: currencyAmountRaw,
    valueType,
    currency,
  })

  const { value, isLoading } = useUSDCValueWithStatus(currencyAmount, pollInterval)

  if (isLxSwap) {
    return {
      tilde: '',
      amount: `${formatter.formatNumberOrString({ value: 0 })}`,
      value: formatter.convertFiatAmountFormatted(0, NumberType.FiatTokenQuantity),
      isLoading: false,
    }
  }

  const formattedAmount = formatter.formatCurrencyAmount({ value: currencyAmount })

  return {
    tilde: isApproximateAmount ? '~' : '',
    amount: formattedAmount,
    value: value
      ? formatter.convertFiatAmountFormatted(parseFloat(value.toExact()), NumberType.FiatTokenQuantity)
      : '-',
    isLoading,
  }
}
