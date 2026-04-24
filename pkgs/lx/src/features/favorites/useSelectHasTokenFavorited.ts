import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { normalizeCurrencyIdForMapLookup } from '@l.x/lx/src/data/cache'
import { makeSelectHasTokenFavorited } from '@l.x/lx/src/features/favorites/selectors'
import { LXState } from '@l.x/lx/src/state/lxReducer'

export function useSelectHasTokenFavorited(currencyId: string): boolean {
  const selectHasTokenFavorited = useMemo(makeSelectHasTokenFavorited, [])
  return useSelector((state: LXState) =>
    selectHasTokenFavorited(state, normalizeCurrencyIdForMapLookup(currencyId)),
  )
}
