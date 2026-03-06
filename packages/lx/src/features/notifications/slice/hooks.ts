import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
  makeSelectAddressNotifications,
  makeSelectHasNotifications,
} from 'lx/src/features/notifications/slice/selectors'
import { AppNotification } from 'lx/src/features/notifications/slice/types'
import { LuxState } from 'lx/src/state/luxReducer'

export function useSelectAddressHasNotifications(address: Address | null): boolean | undefined {
  const selectHasNotifications = useMemo(makeSelectHasNotifications, [])
  return useSelector((state: LuxState) => selectHasNotifications(state, address))
}

export function useSelectAddressNotifications(address: Address | null): AppNotification[] | undefined {
  const selectAddressNotifications = useMemo(makeSelectAddressNotifications, [])
  return useSelector((state: LuxState) => selectAddressNotifications(state, address))
}
