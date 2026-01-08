import type { CurrencyInfo } from 'lx/src/features/dataApi/types'
import { useNeedsBridgedAssetWarning } from 'lx/src/features/transactions/swap/hooks/useNeedsBridgedAssetWarning'
import { useSwapFormStore } from 'lx/src/features/transactions/swap/stores/swapFormStore/useSwapFormStore'

type UseCurrenciesWithBridgingWarnings = () =>
  | {
      currencyInfo0: undefined
      currencyInfo1: undefined
    }
  | {
      currencyInfo0: CurrencyInfo
      currencyInfo1: undefined | CurrencyInfo
    }

export const useCurrenciesWithBridgingWarnings: UseCurrenciesWithBridgingWarnings = () => {
  const { derivedSwapInfo, prefilledCurrencies } = useSwapFormStore((s) => ({
    derivedSwapInfo: s.derivedSwapInfo,
    prefilledCurrencies: s.prefilledCurrencies,
  }))

  const { currenciesWithBridgingWarnings } = useNeedsBridgedAssetWarning(derivedSwapInfo, prefilledCurrencies)

  const maybeCurrencyInfo0 = currenciesWithBridgingWarnings[0]

  if (maybeCurrencyInfo0 === undefined) {
    return {
      currencyInfo0: undefined,
      currencyInfo1: undefined,
    }
  }

  return {
    currencyInfo0: maybeCurrencyInfo0,
    currencyInfo1: currenciesWithBridgingWarnings[1],
  }
}
