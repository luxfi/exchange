import { ChangeAssetVisibilityNotification } from 'lx/src/components/notifications/notifications/ChangeAssetVisibilityNotification'
import { CopiedNotification } from 'lx/src/components/notifications/notifications/CopiedNotification'
import { SuccessNotification } from 'lx/src/components/notifications/notifications/SuccessNotification'
import { AssetType } from 'lx/src/entities/assets'
import { AppNotification, AppNotificationType } from 'lx/src/features/notifications/slice/types'
import { TransactionType } from 'lx/src/features/transactions/types/transactionDetails'
import { ApproveNotification } from '@luxfi/wallet/src/features/notifications/components/ApproveNotification'
import { CrossChainNotification } from '@luxfi/wallet/src/features/notifications/components/BridgeNotification'
import { ChooseCountryNotification } from '@luxfi/wallet/src/features/notifications/components/ChooseCountryNotification'
import { CopyFailedNotification } from '@luxfi/wallet/src/features/notifications/components/CopyFailedNotification'
import { DefaultNotification } from '@luxfi/wallet/src/features/notifications/components/DefaultNotification'
import { ErrorNotification } from '@luxfi/wallet/src/features/notifications/components/ErrorNotification'
import { NetworkChangedBridgeNotification } from '@luxfi/wallet/src/features/notifications/components/NetworkChangedBridgeNotification'
import { NetworkChangedNotification } from '@luxfi/wallet/src/features/notifications/components/NetworkChangedNotification'
import { SmartWalletDisabledNotification } from '@luxfi/wallet/src/features/notifications/components/SmartWalletDisabledNotification'
import { SwapNotification } from '@luxfi/wallet/src/features/notifications/components/SwapNotification'
import { SwapPendingNotification } from '@luxfi/wallet/src/features/notifications/components/SwapPendingNotification'
import { TransactionPendingNotification } from '@luxfi/wallet/src/features/notifications/components/TransactionPendingNotification'
import { TransferCurrencyNotification } from '@luxfi/wallet/src/features/notifications/components/TransferCurrencyNotification'
import { TransferCurrencyPendingNotification } from '@luxfi/wallet/src/features/notifications/components/TransferCurrencyPendingNotification'
import { TransferNFTNotification } from '@luxfi/wallet/src/features/notifications/components/TransferNFTNotification'
import { UnknownTxNotification } from '@luxfi/wallet/src/features/notifications/components/UnknownNotification'
import { WrapNotification } from '@luxfi/wallet/src/features/notifications/components/WrapNotification'

// Update name in `packages/wallet/src/components/ErrorBoundary/ErrorBoundary.tsx` if we update here
// eslint-disable-next-line complexity
export function WalletNotificationToastRouter({ notification }: { notification: AppNotification }): JSX.Element | null {
  switch (notification.type) {
    case AppNotificationType.Default:
      return <DefaultNotification notification={notification} />
    case AppNotificationType.AssetVisibility:
      return <ChangeAssetVisibilityNotification notification={notification} />
    case AppNotificationType.Copied:
      return <CopiedNotification notification={notification} />
    case AppNotificationType.CopyFailed:
      return <CopyFailedNotification notification={notification} />
    case AppNotificationType.Success:
      return <SuccessNotification notification={notification} />
    case AppNotificationType.SmartWalletDisabled:
      return <SmartWalletDisabledNotification notification={notification} />
    case AppNotificationType.Error:
      return <ErrorNotification notification={notification} />
    case AppNotificationType.ChooseCountry:
      return <ChooseCountryNotification notification={notification} />
    case AppNotificationType.NetworkChanged:
      return <NetworkChangedNotification notification={notification} />
    case AppNotificationType.NetworkChangedBridge:
      return <NetworkChangedBridgeNotification notification={notification} />
    case AppNotificationType.SwapPending:
      return <SwapPendingNotification notification={notification} />
    case AppNotificationType.TransferCurrencyPending:
      return <TransferCurrencyPendingNotification />
    case AppNotificationType.TransactionPending:
      return <TransactionPendingNotification />
    case AppNotificationType.Transaction:
      switch (notification.txType) {
        case TransactionType.Approve:
          return <ApproveNotification notification={notification} />
        case TransactionType.Bridge:
        case TransactionType.Plan:
          return <CrossChainNotification notification={notification} />
        case TransactionType.Swap:
          return <SwapNotification notification={notification} />
        case TransactionType.Wrap:
          return <WrapNotification notification={notification} />
        case TransactionType.Unknown:
          return <UnknownTxNotification notification={notification} />
        case TransactionType.Send:
        case TransactionType.Receive:
          if (notification.assetType === AssetType.Currency) {
            return <TransferCurrencyNotification notification={notification} />
          } else {
            return <TransferNFTNotification notification={notification} />
          }
      }
  }

  return null
}
