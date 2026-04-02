import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { normalizeCurrencyIdForMapLookup } from 'lx/src/data/cache'
import { makeSelectHasTokenFavorited } from 'lx/src/features/favorites/selectors'
import { LxState } from 'lx/src/state/lxReducer'

export function useSelectHasTokenFavorited(currencyId: string): boolean {
  const selectHasTokenFavorited = useMemo(makeSelectHasTokenFavorited, [])
  return useSelector((state: LxState) =>
    selectHasTokenFavorited(state, normalizeCurrencyIdForMapLookup(currencyId)),
  )
}
