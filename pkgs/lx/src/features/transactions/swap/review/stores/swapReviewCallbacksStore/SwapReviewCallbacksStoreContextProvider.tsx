import { type ReactNode, useEffect, useMemo, useState } from 'react'
import type { AuthTrigger } from '@l.x/lx/src/features/auth/types'
import type { TransactionScreen } from '@l.x/lx/src/features/transactions/components/TransactionModal/TransactionModalContext'
import { useParsedSwapWarnings } from '@l.x/lx/src/features/transactions/swap/hooks/useSwapWarnings/useSwapWarnings'
import { useCreateSwapReviewCallbacks } from '@l.x/lx/src/features/transactions/swap/review/hooks/useCreateSwapReviewCallbacks'
import { createSwapReviewCallbacksStore } from '@l.x/lx/src/features/transactions/swap/review/stores/swapReviewCallbacksStore/createSwapReviewCallbacksStore'
import { SwapReviewCallbacksStoreContext } from '@l.x/lx/src/features/transactions/swap/review/stores/swapReviewCallbacksStore/SwapReviewCallbacksStoreContext'
import { useSwapReviewActions } from '@l.x/lx/src/features/transactions/swap/review/stores/swapReviewStore/useSwapReviewStore'
import {
  useSwapReviewWarningStateActions,
  useSwapReviewWarningStore,
} from '@l.x/lx/src/features/transactions/swap/review/stores/swapReviewWarningStore/useSwapReviewWarningStore'
import type { GetExecuteSwapService } from '@l.x/lx/src/features/transactions/swap/services/executeSwapService'
import { useSwapFormStore } from '@l.x/lx/src/features/transactions/swap/stores/swapFormStore/useSwapFormStore'
import { useHasValueChanged } from '@l.x/utils/src/react/useHasValueChanged'

interface SwapReviewCallbacksContextProviderProps {
  children: ReactNode
  setScreen: (screen: TransactionScreen) => void
  authTrigger?: AuthTrigger
  onSubmitSwap?: () => Promise<void> | void
  onClose: () => void
  getExecuteSwapService: GetExecuteSwapService
}

export const SwapReviewCallbacksContextProvider = ({
  children,
  setScreen,
  authTrigger,
  onSubmitSwap,
  onClose,
  getExecuteSwapService,
}: SwapReviewCallbacksContextProviderProps): JSX.Element => {
  const { setShowWarningModal, setWarningAcknowledged, setShouldSubmitTx } = useSwapReviewWarningStateActions()

  const { showWarningModal, warningAcknowledged, shouldSubmitTx } = useSwapReviewWarningStore((s) => ({
    showWarningModal: s.showWarningModal,
    warningAcknowledged: s.warningAcknowledged,
    shouldSubmitTx: s.shouldSubmitTx,
  }))

  const { setCurrentStep, setSteps, resetCurrentStep, setSubmissionError, setRetrySwap } = useSwapReviewActions()
  const updateSwapForm = useSwapFormStore((s) => s.updateSwapForm)
  const { reviewScreenWarning } = useParsedSwapWarnings()

  const { onSwapButtonClick, onConfirmWarning, onCancelWarning, onShowWarning, onCloseWarning } =
    useCreateSwapReviewCallbacks({
      resetCurrentStep,
      setSubmissionError,
      setRetrySwap,
      showWarningModal,
      warningAcknowledged,
      shouldSubmitTx,
      setShowWarningModal,
      setWarningAcknowledged,
      setShouldSubmitTx,
      setScreen,
      authTrigger,
      onSubmitSwap,
      onClose,
      getExecuteSwapService,
      updateSwapForm,
      reviewScreenWarning,
      setCurrentStep,
      setSteps,
    })

  const derivedState = useMemo(
    () => ({
      onSwapButtonClick,
      onConfirmWarning,
      onCancelWarning,
      onShowWarning,
      onCloseWarning,
    }),
    [onSwapButtonClick, onConfirmWarning, onCancelWarning, onShowWarning, onCloseWarning],
  )

  const [store] = useState(() => createSwapReviewCallbacksStore(derivedState))

  const hasDerivedStateChanged = useHasValueChanged(derivedState)

  useEffect(() => {
    if (hasDerivedStateChanged) {
      store.setState(derivedState)
    }
  }, [derivedState, store, hasDerivedStateChanged])

  return <SwapReviewCallbacksStoreContext.Provider value={store}>{children}</SwapReviewCallbacksStoreContext.Provider>
}
