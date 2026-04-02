import { Flex } from 'ui/src'
import { Unitag } from 'ui/src/components/icons'
import { LogoWithTxStatus } from 'lx/src/components/CurrencyLogo/LogoWithTxStatus'
import { NotificationToast } from 'lx/src/components/notifications/NotificationToast'
import { DisplayNameType } from 'lx/src/features/accounts/types'
import { useNFT } from 'lx/src/features/nfts/hooks/useNFT'
import { NOTIFICATION_ICON_SIZE } from 'lx/src/features/notifications/constants'
import { TransferNFTTxNotification } from 'lx/src/features/notifications/slice/types'
import { TransactionStatus, TransactionType } from 'lx/src/features/transactions/types/transactionDetails'
import { isAndroid } from 'utilities/src/platform'
import { useWalletNavigation } from '@luxfi/wallet/src/contexts/WalletNavigationContext'
import { formTransferNFTNotificationTitle } from '@luxfi/wallet/src/features/notifications/utils'
import { useActiveAccountAddressWithThrow, useDisplayName } from '@luxfi/wallet/src/features/wallet/hooks'

const platformAdjustedUnitagYPosition = isAndroid ? -1 : -2

export function TransferNFTNotification({ notification }: { notification: TransferNFTTxNotification }): JSX.Element {
  const { address, assetType, chainId, tokenAddress, tokenId, txType, txStatus, hideDelay } = notification
  const userAddress = useActiveAccountAddressWithThrow()
  const senderOrRecipient = txType === TransactionType.Send ? notification.recipient : notification.sender
  const nftOwner = txType === TransactionType.Send ? notification.recipient : userAddress
  const { data: nft } = useNFT({ owner: nftOwner, address: tokenAddress, tokenId })
  const { name: displayName, type: displayNameType } =
    useDisplayName(senderOrRecipient, { includeUnitagSuffix: true }) ?? {}
  const showUnicon = txStatus !== TransactionStatus.Canceled && displayNameType === DisplayNameType.Unitag

  const title = formTransferNFTNotificationTitle({
    txType,
    txStatus,
    nft,
    tokenAddress,
    tokenId,
    senderOrRecipient: displayName ?? senderOrRecipient,
  })

  const { navigateToAccountActivityList } = useWalletNavigation()

  const icon = (
    <LogoWithTxStatus
      assetType={assetType}
      chainId={chainId}
      nftImageUrl={nft?.thumbnail?.url ?? undefined}
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
