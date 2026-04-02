import { LogoWithTxStatus } from '@l.x/lx/src/components/CurrencyLogo/LogoWithTxStatus'
import { NotificationToast } from '@l.x/lx/src/components/notifications/NotificationToast'
import { AssetType } from '@l.x/lx/src/entities/assets'
import { NOTIFICATION_ICON_SIZE } from '@l.x/lx/src/features/notifications/constants'
import { ApproveTxNotification } from '@l.x/lx/src/features/notifications/slice/types'
import { useCurrencyInfo } from '@l.x/lx/src/features/tokens/useCurrencyInfo'
import { buildCurrencyId } from '@l.x/lx/src/utils/currencyId'
import { useWalletNavigation } from '@luxfi/wallet/src/contexts/WalletNavigationContext'
import { formApproveNotificationTitle } from '@luxfi/wallet/src/features/notifications/utils'

export function ApproveNotification({
  notification: { address, chainId, tokenAddress, spender, txStatus, txType, hideDelay },
}: {
  notification: ApproveTxNotification
}): JSX.Element {
  const { navigateToAccountActivityList } = useWalletNavigation()

  const currencyInfo = useCurrencyInfo(buildCurrencyId(chainId, tokenAddress))

  const title = formApproveNotificationTitle({
    txStatus,
    currency: currencyInfo?.currency,
    tokenAddress,
    spender,
  })

  const icon = (
    <LogoWithTxStatus
      assetType={AssetType.Currency}
      chainId={chainId}
      currencyInfo={currencyInfo}
      size={NOTIFICATION_ICON_SIZE}
      txStatus={txStatus}
      txType={txType}
    />
  )

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
