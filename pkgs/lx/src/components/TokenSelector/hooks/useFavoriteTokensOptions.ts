import { GqlResult } from '@l.x/api'
import { useCallback, useMemo } from 'react'
import { TokenOption } from '@l.x/lx/src/components/lists/items/types'
import { filter } from '@l.x/lx/src/components/TokenSelector/filter'
import { useCurrencyInfosToTokenOptions } from '@l.x/lx/src/components/TokenSelector/hooks/useCurrencyInfosToTokenOptions'
import { useFavoriteCurrencies } from '@l.x/lx/src/components/TokenSelector/hooks/useFavoriteCurrencies'
import { usePortfolioBalancesForAddressById } from '@l.x/lx/src/components/TokenSelector/hooks/usePortfolioBalancesForAddressById'
import type { AddressGroup } from '@l.x/lx/src/features/accounts/store/types/AccountsState'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'

export function useFavoriteTokensOptions({
  addresses,
  chainFilter,
}: {
  addresses: AddressGroup
  chainFilter: UniverseChainId | null
}): GqlResult<TokenOption[] | undefined> {
  const {
    data: portfolioBalancesById,
    error: portfolioBalancesByIdError,
    refetch: portfolioBalancesByIdRefetch,
    loading: loadingPorfolioBalancesById,
  } = usePortfolioBalancesForAddressById(addresses)

  const {
    data: favoriteCurrencies,
    error: favoriteCurrenciesError,
    refetch: refetchFavoriteCurrencies,
    loading: loadingFavoriteCurrencies,
  } = useFavoriteCurrencies()

  const favoriteTokenOptions = useCurrencyInfosToTokenOptions({
    currencyInfos: favoriteCurrencies,
    portfolioBalancesById,
    sortAlphabetically: true,
  })

  const refetch = useCallback(() => {
    portfolioBalancesByIdRefetch?.()
    refetchFavoriteCurrencies?.()
  }, [portfolioBalancesByIdRefetch, refetchFavoriteCurrencies])

  const error =
    (!portfolioBalancesById && portfolioBalancesByIdError) || (!favoriteCurrencies && favoriteCurrenciesError)

  const filteredFavoriteTokenOptions = useMemo(
    () => favoriteTokenOptions && filter({ tokenOptions: favoriteTokenOptions, chainFilter }),
    [chainFilter, favoriteTokenOptions],
  )

  return {
    data: filteredFavoriteTokenOptions,
    refetch,
    error: error || undefined,
    loading: loadingPorfolioBalancesById || loadingFavoriteCurrencies,
  }
}
