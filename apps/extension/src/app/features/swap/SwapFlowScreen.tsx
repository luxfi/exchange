import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useExtensionNavigation } from 'src/app/navigation/utils'
import { Flex } from '@luxfi/ui/src'
import { useEnabledChains } from '@luxexchange/lx/src/features/chains/hooks/useEnabledChains'
import { useHighestBalanceNativeCurrencyId } from '@luxexchange/lx/src/features/dataApi/balances/balances'
import { clearNotificationsByType } from '@luxexchange/lx/src/features/notifications/slice/slice'
import { AppNotificationType } from '@luxexchange/lx/src/features/notifications/slice/types'
import { useSwapPrefilledState } from '@luxexchange/lx/src/features/transactions/swap/form/hooks/useSwapPrefilledState'
import { selectFilteredChainIds } from '@luxexchange/lx/src/features/transactions/swap/state/selectors'
import { prepareSwapFormState, TransactionState } from '@luxexchange/lx/src/features/transactions/types/transactionState'
import { CurrencyField } from '@luxexchange/lx/src/types/currency'
import { logger } from '@luxfi/utilities/src/logger/logger'
import { WalletSwapFlow } from '@luxfi/wallet/src/features/transactions/swap/WalletSwapFlow'
import { invalidateAndRefetchWalletDelegationQueries } from '@luxfi/wallet/src/features/transactions/watcher/transactionFinalizationSaga'
import { useActiveAccountWithThrow } from '@luxfi/wallet/src/features/wallet/hooks'

export function SwapFlowScreen(): JSX.Element {
  const dispatch = useDispatch()
  const { navigateBack, locationState } = useExtensionNavigation()
  const { defaultChainId } = useEnabledChains()
  const account = useActiveAccountWithThrow()
  const ignorePersistedFilteredChainIds = !!locationState?.initialTransactionState
  const persistedFilteredChainIds = useSelector(selectFilteredChainIds)
  const inputCurrencyId = useHighestBalanceNativeCurrencyId({
    evmAddress: account.address,
    chainId: !ignorePersistedFilteredChainIds ? persistedFilteredChainIds?.[CurrencyField.INPUT] : undefined,
  })
  const initialState = prepareSwapFormState({
    inputCurrencyId,
    defaultChainId,
    filteredChainIdsOverride: ignorePersistedFilteredChainIds ? undefined : persistedFilteredChainIds,
  })

  // Update flow start timestamp every time modal is opened for logging
  useEffect(() => {
    invalidateAndRefetchWalletDelegationQueries().catch((error) =>
      logger.debug('SwapFlowScreen', 'useEffect', 'Failed to invalidate and refetch wallet delegation queries', error),
    )
  }, [])

  const preservedTransactionStateRef = useRef<TransactionState | null>(null)
  const initialTransactionState = useMemo(() => {
    if (locationState?.initialTransactionState) {
      preservedTransactionStateRef.current = locationState.initialTransactionState
      return locationState.initialTransactionState
    }

    // If we have a previously preserved state, use it (prevents reset when navigating away from the swap flow)
    if (preservedTransactionStateRef.current) {
      return preservedTransactionStateRef.current
    }

    // Only fallback to initialState if we've never had any transaction state (first time opening the swap flow)
    preservedTransactionStateRef.current = initialState
    return initialState
  }, [locationState?.initialTransactionState, initialState])

  const swapPrefilledState = useSwapPrefilledState(initialTransactionState)

  // Clear network change notification toasts when the swap flow closes
  const onClose = useCallback(() => {
    dispatch(
      clearNotificationsByType({
        types: [AppNotificationType.NetworkChanged, AppNotificationType.NetworkChangedBridge],
      }),
    )
    navigateBack()
  }, [dispatch, navigateBack])

  return (
    <Flex fill p="$spacing12">
      <WalletSwapFlow prefilledState={swapPrefilledState} walletNeedsRestore={false} onClose={onClose} />
    </Flex>
  )
}
