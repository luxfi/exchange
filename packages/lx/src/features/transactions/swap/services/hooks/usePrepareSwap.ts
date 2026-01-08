import { useUniswapContext } from 'lx/src/contexts/UniswapContext'
import { AccountType } from 'lx/src/features/accounts/types'
import { isSVMChain } from 'lx/src/features/platforms/utils/chains'
import { useTransactionModalContext } from 'lx/src/features/transactions/components/TransactionModal/TransactionModalContext'
import { useSwapFormWarningStoreActions } from 'lx/src/features/transactions/swap/form/stores/swapFormWarningStore/useSwapFormWarningStore'
import { useNeedsBridgedAssetWarning } from 'lx/src/features/transactions/swap/hooks/useNeedsBridgedAssetWarning'
import { useNeedsBridgingWarning } from 'lx/src/features/transactions/swap/hooks/useSwapWarnings/useNeedsBridgingWarning'
import { useNeedsLowNativeBalanceWarning } from 'lx/src/features/transactions/swap/hooks/useSwapWarnings/useNeedsLowNativeBalanceWarning'
import { usePrefilledNeedsTokenProtectionWarning } from 'lx/src/features/transactions/swap/hooks/useSwapWarnings/usePrefilledNeedsTokenProtectionWarning'
import { createPrepareSwap } from 'lx/src/features/transactions/swap/services/prepareSwapService'
import type { WarningService } from 'lx/src/features/transactions/swap/services/warningService'
import { useSwapFormStore } from 'lx/src/features/transactions/swap/stores/swapFormStore/useSwapFormStore'
import { useWallet } from 'lx/src/features/wallet/hooks/useWallet'
import { AccountDetails } from 'lx/src/features/wallet/types/AccountDetails'
import { logger } from 'utilities/src/logger/logger'
import { useEvent } from 'utilities/src/react/hooks'

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
  const { onConnectWallet } = useUniswapContext()

  // needsTokenProtectionWarning is only true in interface, where swap component might be prefilled with a token that has a protection warning
  const { needsTokenProtectionWarning } = usePrefilledNeedsTokenProtectionWarning(derivedSwapInfo, prefilledCurrencies)

  const needsLowNativeBalanceWarning = useNeedsLowNativeBalanceWarning({ derivedSwapInfo, isMax })

  const needsBridgingWarning = useNeedsBridgingWarning(derivedSwapInfo)

  const { needsBridgedAssetWarning } = useNeedsBridgedAssetWarning(derivedSwapInfo, prefilledCurrencies)

  const isViewOnlyWallet = getIsViewOnlyWallet(activeAccount)

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
