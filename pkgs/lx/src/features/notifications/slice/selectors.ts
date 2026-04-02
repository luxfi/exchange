import { createSelector, Selector } from '@reduxjs/toolkit'
import { AppNotification } from 'lx/src/features/notifications/slice/types'
import { LxState } from 'lx/src/state/lxReducer'

const selectNotificationQueue = (state: LxState): AppNotification[] => state.notifications.notificationQueue

export const makeSelectAddressNotifications = (): Selector<
  LxState,
  AppNotification[] | undefined,
  [Address | null]
> =>
  createSelector(
    selectNotificationQueue,
    (_: LxState, address: Address | null) => address,
    (notificationQueue, address) => {
      if (!address) {
        return undefined
      }
      // If a notification doesn't have an address param assume it belongs to the active account
      return notificationQueue.filter((notif) => !notif.address || notif.address === address)
    },
  )

const selectNotificationStatus = (
  state: LxState,
): {
  [userAddress: string]: boolean | undefined
} => state.notifications.notificationStatus

export const makeSelectHasNotifications = (): Selector<LxState, boolean | undefined, [Address | null]> =>
  createSelector(
    selectNotificationStatus,
    (_: LxState, address: Address | null) => address,
    (notificationStatuses, address) => {
      if (!address) {
        return undefined
      }
      return notificationStatuses[address]
    },
  )

export const selectLastTxNotificationUpdate = (
  state: LxState,
): {
  [address: string]: number | undefined
} => state.notifications.lastTxNotificationUpdate
