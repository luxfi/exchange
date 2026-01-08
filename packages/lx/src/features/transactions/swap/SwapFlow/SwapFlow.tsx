import { ModalName } from 'lx/src/features/telemetry/constants'
import {
  TransactionSettingsStoreContext,
  useGetTransactionSettingsContextValue,
} from 'lx/src/features/transactions/components/settings/stores/transactionSettingsStore/TransactionSettingsStoreContext'
import type { TransactionSettingConfig } from 'lx/src/features/transactions/components/settings/types'
import { TransactionModal } from 'lx/src/features/transactions/components/TransactionModal/TransactionModal'
import type { TransactionModalProps } from 'lx/src/features/transactions/components/TransactionModal/TransactionModalProps'
import { CurrentScreen } from 'lx/src/features/transactions/swap/SwapFlow/CurrentScreen'
import { SwapDependenciesStoreContext } from 'lx/src/features/transactions/swap/stores/swapDependenciesStore/SwapDependenciesStoreContext'
import { useSwapDependenciesStoreBase } from 'lx/src/features/transactions/swap/stores/swapDependenciesStore/useSwapDependenciesStore'
import { SwapFormStoreContext } from 'lx/src/features/transactions/swap/stores/swapFormStore/SwapFormStoreContext'
import type { SwapFormState } from 'lx/src/features/transactions/swap/stores/swapFormStore/types'
import { useSwapFormStoreBase } from 'lx/src/features/transactions/swap/stores/swapFormStore/useSwapFormStore'
import { SwapTxStoreContextProvider } from 'lx/src/features/transactions/swap/stores/swapTxStore/SwapTxStoreContextProvider'

export interface SwapFlowProps extends Omit<TransactionModalProps, 'fullscreen' | 'modalName'> {
  prefilledState?: SwapFormState
  settings: TransactionSettingConfig[]
  hideHeader?: boolean
  hideFooter?: boolean
  onSubmitSwap?: () => Promise<void> | void
  tokenColor?: string
}

export function SwapFlow({ settings, onSubmitSwap, tokenColor, ...transactionModalProps }: SwapFlowProps): JSX.Element {
  const transactionSettingsContext = useGetTransactionSettingsContextValue()
  const swapDependenciesStore = useSwapDependenciesStoreBase()
  const swapFormStore = useSwapFormStoreBase()

  return (
    <TransactionModal modalName={ModalName.Swap} {...transactionModalProps}>
      {/* Re-create the TransactionSettingsContextProvider, since rendering within a Portal causes its children to be in a separate component tree. */}
      <TransactionSettingsStoreContext.Provider value={transactionSettingsContext}>
        {/* Re-create the SwapFormStoreContextProvider, since rendering within a Portal causes its children to be in a separate component tree. */}
        <SwapFormStoreContext.Provider value={swapFormStore}>
          {/* Re-create the SwapTxStoreContextProvider, since rendering within a Portal causes its children to be in a separate component tree. */}
          <SwapTxStoreContextProvider>
            <SwapDependenciesStoreContext.Provider value={swapDependenciesStore}>
              <CurrentScreen settings={settings} tokenColor={tokenColor} onSubmitSwap={onSubmitSwap} />
            </SwapDependenciesStoreContext.Provider>
          </SwapTxStoreContextProvider>
        </SwapFormStoreContext.Provider>
      </TransactionSettingsStoreContext.Provider>
    </TransactionModal>
  )
}
