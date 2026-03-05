import { Flex } from 'ui/src'
import { Unitag } from 'ui/src/components/icons'
import { LogoWithTxStatus } from 'lx/src/components/CurrencyLogo/LogoWithTxStatus'
import { NotificationToast } from 'lx/src/components/notifications/NotificationToast'
import { DisplayNameType } from 'lx/src/features/accounts/types'
import { useLocalizationContext } from 'lx/src/features/language/LocalizationContext'
import { NOTIFICATION_ICON_SIZE } from 'lx/src/features/notifications/constants'
import { TransferCurrencyTxNotification } from 'lx/src/features/notifications/slice/types'
import { useCurrencyInfo } from 'lx/src/features/tokens/useCurrencyInfo'
import { TransactionStatus, TransactionType } from 'lx/src/features/transactions/types/transactionDetails'
import { buildCurrencyId } from 'lx/src/utils/currencyId'
import { isAndroid } from 'utilities/src/platform'
import { useWalletNavigation } from 'wallet/src/contexts/WalletNavigationContext'
import { formTransferCurrencyNotificationTitle } from 'wallet/src/features/notifications/utils'
import { useDisplayName } from 'wallet/src/features/wallet/hooks'

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
