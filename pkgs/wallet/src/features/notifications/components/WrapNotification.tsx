import { useTranslation } from 'react-i18next'
import { SplitLogo } from 'lx/src/components/CurrencyLogo/SplitLogo'
import { NotificationToast } from 'lx/src/components/notifications/NotificationToast'
import { useLocalizationContext } from 'lx/src/features/language/LocalizationContext'
import { NOTIFICATION_ICON_SIZE } from 'lx/src/features/notifications/constants'
import { WrapTxNotification } from 'lx/src/features/notifications/slice/types'
import { useNativeCurrencyInfo, useWrappedNativeCurrencyInfo } from 'lx/src/features/tokens/useCurrencyInfo'
import { TransactionStatus } from 'lx/src/features/transactions/types/transactionDetails'
import { useWalletNavigation } from '@luxfi/wallet/src/contexts/WalletNavigationContext'
import { formWrapNotificationTitle } from '@luxfi/wallet/src/features/notifications/utils'
import { useCreateWrapFormState } from '@luxfi/wallet/src/features/transactions/hooks/useCreateWrapFormState'

export function WrapNotification({
  notification: { txId, txStatus, currencyAmountRaw, address, hideDelay, unwrapped, chainId },
}: {
  notification: WrapTxNotification
}): JSX.Element {
  const { t } = useTranslation()
  const formatter = useLocalizationContext()

  const nativeCurrencyInfo = useNativeCurrencyInfo(chainId)
  const wrappedCurrencyInfo = useWrappedNativeCurrencyInfo(chainId)
  const inputCurrencyInfo = unwrapped ? wrappedCurrencyInfo : nativeCurrencyInfo
  const outputCurrencyInfo = unwrapped ? nativeCurrencyInfo : wrappedCurrencyInfo

  const title = formWrapNotificationTitle({
    formatter,
    txStatus,
    inputCurrency: inputCurrencyInfo?.currency,
    outputCurrency: outputCurrencyInfo?.currency,
    currencyAmountRaw,
    unwrapped,
  })

  const wrapFormState = useCreateWrapFormState({
    address,
    chainId,
    txId,
    inputCurrency: inputCurrencyInfo?.currency,
    outputCurrency: outputCurrencyInfo?.currency,
  })

  const { navigateToAccountActivityList, navigateToSwapFlow } = useWalletNavigation()

  const onRetry = (): void => {
    navigateToSwapFlow(wrapFormState ? { initialState: wrapFormState } : undefined)
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
