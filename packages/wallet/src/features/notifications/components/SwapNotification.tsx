import { useTranslation } from 'react-i18next'
import { SplitLogo } from 'lx/src/components/CurrencyLogo/SplitLogo'
import { NotificationToast } from 'lx/src/components/notifications/NotificationToast'
import { useLocalizationContext } from 'lx/src/features/language/LocalizationContext'
import { NOTIFICATION_ICON_SIZE } from 'lx/src/features/notifications/constants'
import { SwapTxNotification } from 'lx/src/features/notifications/slice/types'
import { useCurrencyInfo } from 'lx/src/features/tokens/useCurrencyInfo'
import { TransactionStatus } from 'lx/src/features/transactions/types/transactionDetails'
import { useWalletNavigation } from 'wallet/src/contexts/WalletNavigationContext'
import { formSwapNotificationTitle } from 'wallet/src/features/notifications/utils'
import { useCreateSwapFormState } from 'wallet/src/features/transactions/hooks/useCreateSwapFormState'

export function SwapNotification({
  notification: {
    chainId,
    txId,
    txStatus,
    inputCurrencyId,
    inputCurrencyAmountRaw,
    outputCurrencyId,
    outputCurrencyAmountRaw,
    tradeType,
    address,
    hideDelay,
  },
}: {
  notification: SwapTxNotification
}): JSX.Element {
  const formatter = useLocalizationContext()
  const inputCurrencyInfo = useCurrencyInfo(inputCurrencyId)
  const outputCurrencyInfo = useCurrencyInfo(outputCurrencyId)

  const title = formSwapNotificationTitle({
    formatter,
    txStatus,
    inputCurrency: inputCurrencyInfo?.currency,
    outputCurrency: outputCurrencyInfo?.currency,
    inputCurrencyId,
    outputCurrencyId,
    inputCurrencyAmountRaw,
    outputCurrencyAmountRaw,
    tradeType,
  })

  const { t } = useTranslation()

  const { navigateToAccountActivityList, navigateToSwapFlow } = useWalletNavigation()

  const swapFormState = useCreateSwapFormState({ address, chainId, txId })

  const onRetry = (): void => {
    navigateToSwapFlow(swapFormState ? { initialState: swapFormState } : undefined)
  }

  const retryButton =
    txStatus === TransactionStatus.Failed
      ? {
          title: t('common.button.retry'),
          onPress: onRetry,
        }
      : undefined

  const icon = (
    <SplitLogo
      chainId={chainId}
      inputCurrencyInfo={inputCurrencyInfo}
      outputCurrencyInfo={outputCurrencyInfo}
      size={NOTIFICATION_ICON_SIZE}
    />
  )

  return (
    <NotificationToast
      actionButton={retryButton}
      address={address}
      hideDelay={hideDelay}
      icon={icon}
      title={title}
      onPress={navigateToAccountActivityList}
    />
  )
}
