import { createSelector, Selector } from '@reduxjs/toolkit'
import { AppNotification } from 'lx/src/features/notifications/slice/types'
import { LuxState } from 'lx/src/state/luxReducer'

const selectNotificationQueue = (state: LuxState): AppNotification[] => state.notifications.notificationQueue

export const makeSelectAddressNotifications = (): Selector<
  LuxState,
  AppNotification[] | undefined,
  [Address | null]
> =>
  createSelector(
    selectNotificationQueue,
    (_: LuxState, address: Address | null) => address,
    (notificationQueue, address) => {
      if (!address) {
        return undefined
      }
      // If a notification doesn't have an address param assume it belongs to the active account
      return notificationQueue.filter((notif) => !notif.address || notif.address === address)
    },
  )

const selectNotificationStatus = (
  state: LuxState,
): {
  [userAddress: string]: boolean | undefined
} => state.notifications.notificationStatus

export const makeSelectHasNotifications = (): Selector<LuxState, boolean | undefined, [Address | null]> =>
  createSelector(
    selectNotificationStatus,
    (_: LuxState, address: Address | null) => address,
    (notificationStatuses, address) => {
      if (!address) {
        return undefined
      }
      return notificationStatuses[address]
    },
  )

export const selectLastTxNotificationUpdate = (
  state: LuxState,
): {
  [address: string]: number | undefined
} => state.notifications.lastTxNotificationUpdate
