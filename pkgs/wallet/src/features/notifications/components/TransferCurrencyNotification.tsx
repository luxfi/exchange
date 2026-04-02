import { Flex } from '@l.x/ui/src'
import { Unitag } from '@l.x/ui/src/components/icons'
import { LogoWithTxStatus } from '@l.x/lx/src/components/CurrencyLogo/LogoWithTxStatus'
import { NotificationToast } from '@l.x/lx/src/components/notifications/NotificationToast'
import { DisplayNameType } from '@l.x/lx/src/features/accounts/types'
import { useLocalizationContext } from '@l.x/lx/src/features/language/LocalizationContext'
import { NOTIFICATION_ICON_SIZE } from '@l.x/lx/src/features/notifications/constants'
import { TransferCurrencyTxNotification } from '@l.x/lx/src/features/notifications/slice/types'
import { useCurrencyInfo } from '@l.x/lx/src/features/tokens/useCurrencyInfo'
import { TransactionStatus, TransactionType } from '@l.x/lx/src/features/transactions/types/transactionDetails'
import { buildCurrencyId } from '@l.x/lx/src/utils/currencyId'
import { isAndroid } from '@l.x/utils/src/platform'
import { useWalletNavigation } from '@luxfi/wallet/src/contexts/WalletNavigationContext'
import { formTransferCurrencyNotificationTitle } from '@luxfi/wallet/src/features/notifications/utils'
import { useDisplayName } from '@luxfi/wallet/src/features/wallet/hooks'

const platformAdjustedUnitagYPosition = isAndroid ? -1 : -2

export function TransferCurrencyNotification({
  notification,
}: {
  notification: TransferCurrencyTxNotification
}): JSX.Element {
  const formatter = useLocalizationContext()
  const { address, assetType, chainId, tokenAddress, currencyAmountRaw, txType, txStatus, hideDelay } = notification
  const senderOrRecipient = txType === TransactionType.Send ? notification.recipient : notification.sender
  const { name: displayName, type: displayNameType } =
    useDisplayName(senderOrRecipient, { includeUnitagSuffix: false }) ?? {}
  const currencyInfo = useCurrencyInfo(buildCurrencyId(chainId, tokenAddress))
  // Transfer canceled title doesn't end with the display name
  const showUnicon = txStatus !== TransactionStatus.Canceled && displayNameType === DisplayNameType.Unitag

  const title = formTransferCurrencyNotificationTitle({
    formatter,
    txType,
    txStatus,
    currency: currencyInfo?.currency,
    tokenAddress,
    currencyAmountRaw,
    senderOrRecipient: displayNameType !== DisplayNameType.Address && displayName ? displayName : senderOrRecipient,
  })

  const { navigateToAccountActivityList } = useWalletNavigation()

  const icon = (
    <LogoWithTxStatus
      assetType={assetType}
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
      postCaptionElement={
        showUnicon ? (
          <Flex y={platformAdjustedUnitagYPosition}>
            <Unitag size="$icon.24" />
          </Flex>
        ) : undefined
      }
      title={title}
      onPress={navigateToAccountActivityList}
    />
  )
}
