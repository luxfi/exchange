import { createSelector, Selector } from '@reduxjs/toolkit'
import { normalizeCurrencyIdForMapLookup } from '@l.x/lx/src/data/cache'
import { LXRootState } from '@l.x/lx/src/state'
import { unique } from '@l.x/utils/src/primitives/array'

const selectFavoriteTokensWithPossibleDuplicates = (state: LXRootState): string[] => state.favorites.tokens
export const selectFavoriteTokens = createSelector(selectFavoriteTokensWithPossibleDuplicates, unique)
export const selectHasFavoriteTokens = createSelector(selectFavoriteTokens, (tokens) => Boolean(tokens.length > 0))

export const makeSelectHasTokenFavorited = (): Selector<LXRootState, boolean, [string]> =>
  createSelector(
    selectFavoriteTokens,
    (_: LXRootState, currencyId: string) => currencyId,
    (tokens, currencyId) => tokens.includes(normalizeCurrencyIdForMapLookup(currencyId)),
  )

const selectWatchedAddresses = (state: LXRootState): string[] => state.favorites.watchedAddresses
export const selectWatchedAddressSet = createSelector(selectWatchedAddresses, (watched) => new Set(watched))

export const selectHasWatchedWallets = createSelector(selectWatchedAddresses, (watched) => Boolean(watched.length > 0))
