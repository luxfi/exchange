import { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { useActiveAddress } from 'lx/src/features/accounts/store/hooks'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { useSelectAddressNotifications } from 'lx/src/features/notifications/slice/hooks'
import { clearNotificationQueue } from 'lx/src/features/notifications/slice/slice'
import { AppNotificationType } from 'lx/src/features/notifications/slice/types'
import { Platform } from 'lx/src/features/platforms/types/Platform'
import { TransactionType } from 'lx/src/features/transactions/types/transactionDetails'

/**
 * Clears the notification queue when the provided `trigger` flag is true **and**
 * all current notifications are related to the in-progress swap (pending or completed).
 * Helps hide swap-related toasts (pending/completed) during flash-block flows.
 */
export function useClearFlashblocksSwapNotifications(isClearingNotifications: boolean): void {
  const dispatch = useDispatch()
  const evmAddress = useActiveAddress(Platform.EVM)
  const addressNotifications = useSelectAddressNotifications(evmAddress ?? null)

  const shouldClearNotifications = useMemo(() => {
    if (!isClearingNotifications || !addressNotifications || addressNotifications.length === 0) {
      return false
    }

    // Only clear if **all** notifications in the queue match the current swap context
    return addressNotifications.every((notif) => {
      if (notif.type === AppNotificationType.SwapPending) {
        return true
      }

      if (notif.type === AppNotificationType.Transaction && 'txType' in notif) {
        return (
          notif.txType === TransactionType.Swap &&
          // ensure we only clear toasts that belong to this swap tx
          ('chainId' in notif
            ? notif.chainId === UniverseChainId.Unichain || notif.chainId === UniverseChainId.UnichainSepolia
            : false)
        )
      }

      return false
    })
  }, [isClearingNotifications, addressNotifications])

  useEffect(() => {
    if (shouldClearNotifications) {
      dispatch(clearNotificationQueue())
    }
  }, [shouldClearNotifications, dispatch])
}
