import { Currency } from '@luxamm/sdk-core'
import { useEffect, useRef } from 'react'
import { getPrimaryStablecoin, isUniverseChainId } from 'lx/src/features/chains/utils'
import { useLocalizationContext } from 'lx/src/features/language/LocalizationContext'
import { getCurrencyAmount, ValueType } from 'lx/src/features/tokens/getCurrencyAmount'
import { useUSDCPrice } from 'lx/src/features/transactions/hooks/useUSDCPrice'

const NUM_DECIMALS_USD = 2
const NUM_DECIMALS_DISPLAY = 2

type USDTokenUpdaterProps = {
  isFiatInput: boolean
  exactAmountToken: string
  exactAmountFiat: string
  currency?: Currency
  onFiatAmountUpdated: (amount: string) => void
  onTokenAmountUpdated: (amount: string) => void
}

export function useUSDTokenUpdater({
  isFiatInput,
  exactAmountToken,
  exactAmountFiat,
  currency,
  onFiatAmountUpdated,
  onTokenAmountUpdated,
}: USDTokenUpdaterProps): void {
  const { price } = useUSDCPrice(currency)
  const shouldUseUSDRef = useRef(isFiatInput)
  const { convertFiatAmount, formatCurrencyAmount } = useLocalizationContext()
  const conversionRate = convertFiatAmount(1).amount

  useEffect(() => {
    shouldUseUSDRef.current = isFiatInput
  }, [isFiatInput])
  // biome-ignore lint/correctness/useExhaustiveDependencies: +shouldUseUSDRef, formatCurrencyAmount
  useEffect(() => {
    if (!currency || !price || !isUniverseChainId(currency.chainId)) {
      return undefined
    }

    const _exactAmountFiat = exactAmountFiat === '.' ? '0' : exactAmountFiat || '0'
    const exactAmountUSD = (parseFloat(_exactAmountFiat) / conversionRate).toFixed(NUM_DECIMALS_USD)

    if (shouldUseUSDRef.current) {
      const stablecoinAmount = getCurrencyAmount({
        value: exactAmountUSD,
        valueType: ValueType.Exact,
        currency: getPrimaryStablecoin(currency.chainId),
      })

      const currencyAmount = stablecoinAmount ? price.invert().quote(stablecoinAmount) : undefined

      return onTokenAmountUpdated(currencyAmount?.toExact() ?? '')
    }

    const exactCurrencyAmount = getCurrencyAmount({
      value: exactAmountToken,
      valueType: ValueType.Exact,
      currency,
    })
    const usdPrice = exactCurrencyAmount ? price.quote(exactCurrencyAmount) : undefined
    const fiatPrice = parseFloat(usdPrice?.toExact() ?? '0') * conversionRate

    return onFiatAmountUpdated(fiatPrice ? fiatPrice.toFixed(NUM_DECIMALS_DISPLAY) : '')
  }, [
    shouldUseUSDRef,
    exactAmountFiat,
    exactAmountToken,
    currency,
    price,
    conversionRate,
    formatCurrencyAmount,
    onFiatAmountUpdated,
    onTokenAmountUpdated,
  ])
}
