import { useMemo } from 'react'
import { useLuxContext } from '@l.x/lx/src/contexts/LuxContext'
import { useAccountsStore } from '@l.x/lx/src/features/accounts/store/hooks'
import { AccountType } from '@l.x/lx/src/features/accounts/types'
import { Platform } from '@l.x/lx/src/features/platforms/types/Platform'
import { isSVMChain } from '@l.x/lx/src/features/platforms/utils/chains'
import { useTransactionModalContext } from '@l.x/lx/src/features/transactions/components/TransactionModal/TransactionModalContext'
import { useSwapFormWarningStoreActions } from '@l.x/lx/src/features/transactions/swap/form/stores/swapFormWarningStore/useSwapFormWarningStore'
import { useNeedsBridgedAssetWarning } from '@l.x/lx/src/features/transactions/swap/hooks/useNeedsBridgedAssetWarning'
import { useNeedsBridgingWarning } from '@l.x/lx/src/features/transactions/swap/hooks/useSwapWarnings/useNeedsBridgingWarning'
import { useNeedsLowNativeBalanceWarning } from '@l.x/lx/src/features/transactions/swap/hooks/useSwapWarnings/useNeedsLowNativeBalanceWarning'
import { usePrefilledNeedsTokenProtectionWarning } from '@l.x/lx/src/features/transactions/swap/hooks/useSwapWarnings/usePrefilledNeedsTokenProtectionWarning'
import { getWalletExecutionContext } from '@l.x/lx/src/features/transactions/swap/plan/planSagaUtils'
import { createPrepareSwap } from '@l.x/lx/src/features/transactions/swap/services/prepareSwapService'
import type { WarningService } from '@l.x/lx/src/features/transactions/swap/services/warningService'
import { useSwapFormStore } from '@l.x/lx/src/features/transactions/swap/stores/swapFormStore/useSwapFormStore'
import { useWallet } from '@l.x/lx/src/features/wallet/hooks/useWallet'
import { AccountDetails } from '@l.x/lx/src/features/wallet/types/AccountDetails'
import { logger } from '@l.x/utils/src/logger/logger'
import { useEvent } from '@l.x/utils/src/react/hooks'

const getIsViewOnlyWallet = (activeAccount?: AccountDetails): boolean => {
  return activeAccount?.accountType === AccountType.Readonly
}

export function usePrepareSwap(ctx: { warningService: WarningService }): () => void {
  const {
    handleShowTokenWarningModal,
    handleShowBridgingWarningModal,
    handleShowMaxNativeTransferModal,
    handleShowViewOnlyModal,
    handleShowBridgedAssetModal,
  } = useSwapFormWarningStoreActions()
  const { derivedSwapInfo, updateSwapForm, exactAmountToken, prefilledCurrencies, isMax } = useSwapFormStore((s) => ({
    derivedSwapInfo: s.derivedSwapInfo,
    updateSwapForm: s.updateSwapForm,
    exactAmountToken: s.exactAmountToken,
    prefilledCurrencies: s.prefilledCurrencies,
    isMax: s.isMax,
  }))
  const { currencies, exactCurrencyField, chainId } = derivedSwapInfo
  const { swapRedirectCallback, setScreen } = useTransactionModalContext()

  const wallet = useWallet()
  const activeAccount = isSVMChain(chainId) ? wallet.svmAccount : wallet.evmAccount
  const { onConnectWallet } = useLuxContext()

  // needsTokenProtectionWarning is only true in interface, where swap component might be prefilled with a token that has a protection warning
  const { needsTokenProtectionWarning } = usePrefilledNeedsTokenProtectionWarning(derivedSwapInfo, prefilledCurrencies)

  const needsLowNativeBalanceWarning = useNeedsLowNativeBalanceWarning({ derivedSwapInfo, isMax })

  const needsBridgingWarning = useNeedsBridgingWarning(derivedSwapInfo)

  const { needsBridgedAssetWarning } = useNeedsBridgedAssetWarning(derivedSwapInfo, prefilledCurrencies)

  const isViewOnlyWallet = getIsViewOnlyWallet(activeAccount)

  const caip25Info = useAccountsStore((state) => {
    return state.getActiveConnector(Platform.EVM)?.session?.caip25Info
  })
  const walletExecutionContext = useMemo(() => getWalletExecutionContext(caip25Info), [caip25Info])

  return useEvent(
    createPrepareSwap({
      // getAction
      isConnected: !!activeAccount,
      isViewOnlyWallet,
      currencies,
      exactAmountToken,
      exactCurrencyField,
      chainId,
      needsTokenProtectionWarning,
      needsBridgingWarning,
      needsLowNativeBalanceWarning,
      needsBridgedAssetWarning,
      trade: derivedSwapInfo.trade.trade ?? undefined,
      walletExecutionContext,
      // handleEventAction
      handleShowViewOnlyModal,
      handleShowTokenWarningModal,
      handleShowBridgingWarningModal,
      handleShowMaxNativeTransferModal,
      handleShowBridgedAssetModal,
      updateSwapForm,
      setScreen,
      // shared
      swapRedirectCallback,
      onConnectWallet,
      // ctx
      warningService: ctx.warningService,
      logger,
    }),
  )
}
