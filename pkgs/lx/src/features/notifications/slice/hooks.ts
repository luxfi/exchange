import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
  makeSelectAddressNotifications,
  makeSelectHasNotifications,
} from '@l.x/lx/src/features/notifications/slice/selectors'
import { AppNotification } from '@l.x/lx/src/features/notifications/slice/types'
import { LXState } from '@l.x/lx/src/state/lxReducer'

export function useSelectAddressHasNotifications(address: Address | null): boolean | undefined {
  const selectHasNotifications = useMemo(makeSelectHasNotifications, [])
  return useSelector((state: LXState) => selectHasNotifications(state, address))
}

export function useSelectAddressNotifications(address: Address | null): AppNotification[] | undefined {
  const selectAddressNotifications = useMemo(makeSelectAddressNotifications, [])
  return useSelector((state: LXState) => selectAddressNotifications(state, address))
}
