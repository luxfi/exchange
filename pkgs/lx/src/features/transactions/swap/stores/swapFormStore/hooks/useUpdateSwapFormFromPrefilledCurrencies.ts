import { useEffect } from 'react'
import { useDefaultSwapFormState } from '@l.x/lx/src/features/transactions/swap/stores/swapFormStore/hooks/useDefaultSwapFormState'
import type { SwapFormState } from '@l.x/lx/src/features/transactions/swap/stores/swapFormStore/types'
import { currencyId } from '@l.x/lx/src/utils/currencyId'
import { usePrevious } from '@l.x/utils/src/react/hooks'

export const useUpdateSwapFormFromPrefilledCurrencies = ({
  prefilledState,
  setSwapForm,
}: {
  prefilledState?: SwapFormState
  setSwapForm: (swapForm: SwapFormState) => void
}): void => {
  // prefilled state may load in -- i.e. `outputCurrency` URL param pulling from gql
  const previousInitialInputCurrency = usePrevious(prefilledState?.input)
  const previousInitialOutputCurrency = usePrevious(prefilledState?.output)
  const defaultState = useDefaultSwapFormState()

  useEffect(() => {
    const previousInputCurrencyId = previousInitialInputCurrency && currencyId(previousInitialInputCurrency)
    const previousOutputCurrencyId = previousInitialOutputCurrency && currencyId(previousInitialOutputCurrency)

    if (
      previousInputCurrencyId !== (prefilledState?.input && currencyId(prefilledState.input)) ||
      previousOutputCurrencyId !== (prefilledState?.output && currencyId(prefilledState.output))
    ) {
      setSwapForm(prefilledState ?? defaultState)
    }
  }, [prefilledState, previousInitialInputCurrency, previousInitialOutputCurrency, defaultState, setSwapForm])
}
