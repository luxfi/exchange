import { useLuxContext } from '@l.x/lx/src/contexts/LuxContext'
import { useSwapFormStore } from '@l.x/lx/src/features/transactions/swap/stores/swapFormStore/useSwapFormStore'
import { useEvent } from '@l.x/utils/src/react/hooks'

export const useHideTokenSelector = (): (() => void) => {
  const { updateSwapForm, isSelectingCurrencyFieldPrefilled } = useSwapFormStore((s) => ({
    updateSwapForm: s.updateSwapForm,
    isSelectingCurrencyFieldPrefilled: s.isSelectingCurrencyFieldPrefilled,
  }))
  const { setIsSwapTokenSelectorOpen } = useLuxContext()

  return useEvent(() => {
    updateSwapForm({
      selectingCurrencyField: undefined,
      isSelectingCurrencyFieldPrefilled: false,
      // reset the filtered chain ids when coming back in from a prefill so it's not persisted forever
      ...(isSelectingCurrencyFieldPrefilled ? { filteredChainIds: {} } : {}),
    })
    setIsSwapTokenSelectorOpen(false) // resets force flag for web on close as cleanup
  })
}
