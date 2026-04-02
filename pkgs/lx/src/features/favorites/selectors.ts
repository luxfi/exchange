import { createSelector, Selector } from '@reduxjs/toolkit'
import { normalizeCurrencyIdForMapLookup } from 'lx/src/data/cache'
import { LxRootState } from 'lx/src/state'
import { unique } from 'utilities/src/primitives/array'

const selectFavoriteTokensWithPossibleDuplicates = (state: LxRootState): string[] => state.favorites.tokens
export const selectFavoriteTokens = createSelector(selectFavoriteTokensWithPossibleDuplicates, unique)
export const selectHasFavoriteTokens = createSelector(selectFavoriteTokens, (tokens) => Boolean(tokens.length > 0))

export const makeSelectHasTokenFavorited = (): Selector<LxRootState, boolean, [string]> =>
  createSelector(
    selectFavoriteTokens,
    (_: LxRootState, currencyId: string) => currencyId,
    (tokens, currencyId) => tokens.includes(normalizeCurrencyIdForMapLookup(currencyId)),
  )

const selectWatchedAddresses = (state: LxRootState): string[] => state.favorites.watchedAddresses
export const selectWatchedAddressSet = createSelector(selectWatchedAddresses, (watched) => new Set(watched))

export const selectHasWatchedWallets = createSelector(selectWatchedAddresses, (watched) => Boolean(watched.length > 0))
