import { createSelector, Selector } from '@reduxjs/toolkit'
import { AppNotification } from '@l.x/lx/src/features/notifications/slice/types'
import { LXState } from '@l.x/lx/src/state/lxReducer'

const selectNotificationQueue = (state: LXState): AppNotification[] => state.notifications.notificationQueue

export const makeSelectAddressNotifications = (): Selector<
  LXState,
  AppNotification[] | undefined,
  [Address | null]
> =>
  createSelector(
    selectNotificationQueue,
    (_: LXState, address: Address | null) => address,
    (notificationQueue, address) => {
      if (!address) {
        return undefined
      }
      // If a notification doesn't have an address param assume it belongs to the active account
      return notificationQueue.filter((notif) => !notif.address || notif.address === address)
    },
  )

const selectNotificationStatus = (
  state: LXState,
): {
  [userAddress: string]: boolean | undefined
} => state.notifications.notificationStatus

export const makeSelectHasNotifications = (): Selector<LXState, boolean | undefined, [Address | null]> =>
  createSelector(
    selectNotificationStatus,
    (_: LXState, address: Address | null) => address,
    (notificationStatuses, address) => {
      if (!address) {
        return undefined
      }
      return notificationStatuses[address]
    },
  )

export const selectLastTxNotificationUpdate = (
  state: LXState,
): {
  [address: string]: number | undefined
} => state.notifications.lastTxNotificationUpdate
