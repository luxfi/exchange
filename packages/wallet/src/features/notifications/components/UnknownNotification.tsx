import { AlertTriangleFilled, CheckmarkCircle } from 'ui/src/components/icons'
import { LogoWithTxStatus } from 'lx/src/components/CurrencyLogo/LogoWithTxStatus'
import { NotificationToast } from 'lx/src/components/notifications/NotificationToast'
import { AssetType } from 'lx/src/entities/assets'
import { useENS } from 'lx/src/features/ens/useENS'
import { NOTIFICATION_ICON_SIZE } from 'lx/src/features/notifications/constants'
import { TransactionNotificationBase } from 'lx/src/features/notifications/slice/types'
import { useCurrencyInfo } from 'lx/src/features/tokens/useCurrencyInfo'
import { TransactionStatus } from 'lx/src/features/transactions/types/transactionDetails'
import { buildCurrencyId } from 'lx/src/utils/currencyId'
import { useWalletNavigation } from 'wallet/src/contexts/WalletNavigationContext'
import { formUnknownTxTitle } from 'wallet/src/features/notifications/utils'

export function UnknownTxNotification({
  notification: { address, chainId, tokenAddress, txStatus, txType, hideDelay },
}: {
  notification: TransactionNotificationBase
}): JSX.Element {
  const { name: ensName } = useENS({ nameOrAddress: tokenAddress, chainId })
  const currencyInfo = useCurrencyInfo(tokenAddress ? buildCurrencyId(chainId, tokenAddress) : undefined)
  const title = formUnknownTxTitle({ txStatus, tokenAddress, ensName })
  const icon = currencyInfo ? (
    <LogoWithTxStatus
      assetType={AssetType.Currency}
      chainId={chainId}
      currencyInfo={currencyInfo}
      size={NOTIFICATION_ICON_SIZE}
      txStatus={txStatus}
      txType={txType}
    />
  ) : txStatus === TransactionStatus.Success ? (
    <CheckmarkCircle size="$icon.24" />
  ) : (
    <AlertTriangleFilled color="$statusCritical" size="$icon.24" />
  )

  const { navigateToAccountActivityList } = useWalletNavigation()

  return (
    <NotificationToast
      address={address}
      hideDelay={hideDelay}
      icon={icon}
      title={title}
      onPress={navigateToAccountActivityList}
    />
  )
}
