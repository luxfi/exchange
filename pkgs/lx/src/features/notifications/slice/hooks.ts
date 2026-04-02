import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
  makeSelectAddressNotifications,
  makeSelectHasNotifications,
} from 'lx/src/features/notifications/slice/selectors'
import { AppNotification } from 'lx/src/features/notifications/slice/types'
import { LxState } from 'lx/src/state/lxReducer'

export function useSelectAddressHasNotifications(address: Address | null): boolean | undefined {
  const selectHasNotifications = useMemo(makeSelectHasNotifications, [])
  return useSelector((state: LxState) => selectHasNotifications(state, address))
}

export function useSelectAddressNotifications(address: Address | null): AppNotification[] | undefined {
  const selectAddressNotifications = useMemo(makeSelectAddressNotifications, [])
  return useSelector((state: LxState) => selectAddressNotifications(state, address))
}
