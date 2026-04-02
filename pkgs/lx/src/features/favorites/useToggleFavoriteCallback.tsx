import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { normalizeCurrencyIdForMapLookup } from 'lx/src/data/cache'
import { addFavoriteToken, removeFavoriteToken } from 'lx/src/features/favorites/slice'
import { MobileEventName } from 'lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from 'lx/src/features/telemetry/send'
import { CurrencyId } from 'lx/src/types/currency'
import { currencyIdToAddress, currencyIdToChain } from 'lx/src/utils/currencyId'

export function useToggleFavoriteCallback({
  id,
  tokenName,
  isFavoriteToken,
}: {
  id: CurrencyId
  tokenName?: string
  isFavoriteToken: boolean
}): () => void {
  const dispatch = useDispatch()

  return useCallback(() => {
    if (isFavoriteToken) {
      dispatch(removeFavoriteToken({ currencyId: normalizeCurrencyIdForMapLookup(id) }))
    } else {
      sendAnalyticsEvent(MobileEventName.FavoriteItem, {
        address: currencyIdToAddress(normalizeCurrencyIdForMapLookup(id)),
        chain: currencyIdToChain(id) as number,
        type: 'token',
        name: tokenName,
      })
      dispatch(addFavoriteToken({ currencyId: normalizeCurrencyIdForMapLookup(id) }))
    }
  }, [dispatch, id, isFavoriteToken, tokenName])
}
