import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useOnchainDisplayName } from 'lx/src/features/accounts/useOnchainDisplayName'
import { selectWatchedAddressSet } from 'lx/src/features/favorites/selectors'
import { addWatchedAddress, removeWatchedAddress } from 'lx/src/features/favorites/slice'
import { MobileEventName } from 'lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from 'lx/src/features/telemetry/send'

export function useToggleWatchedWalletCallback(address: Address): () => void {
  const dispatch = useDispatch()
  const isFavoriteWallet = useSelector(selectWatchedAddressSet).has(address)
  const displayName = useOnchainDisplayName(address)

  return useCallback(() => {
    if (isFavoriteWallet) {
      dispatch(removeWatchedAddress({ address }))
    } else {
      sendAnalyticsEvent(MobileEventName.FavoriteItem, {
        address,
        type: 'wallet',
        name: displayName?.name,
      })
      dispatch(addWatchedAddress({ address }))
    }
  }, [address, dispatch, displayName?.name, isFavoriteWallet])
}
