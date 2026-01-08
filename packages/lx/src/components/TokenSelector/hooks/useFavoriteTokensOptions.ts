import { GqlResult } from '@luxfi/api'
import { useCallback, useMemo } from 'react'
import { TokenOption } from 'lx/src/components/lists/items/types'
import { filter } from 'lx/src/components/TokenSelector/filter'
import { useCurrencyInfosToTokenOptions } from 'lx/src/components/TokenSelector/hooks/useCurrencyInfosToTokenOptions'
import { useFavoriteCurrencies } from 'lx/src/components/TokenSelector/hooks/useFavoriteCurrencies'
import { usePortfolioBalancesForAddressById } from 'lx/src/components/TokenSelector/hooks/usePortfolioBalancesForAddressById'
import { UniverseChainId } from 'lx/src/features/chains/types'

export function useFavoriteTokensOptions({
  evmAddress,
  svmAddress,
  chainFilter,
}: {
  evmAddress: Address | undefined
  svmAddress: Address | undefined
  chainFilter: UniverseChainId | null
}): GqlResult<TokenOption[] | undefined> {
  const {
    data: portfolioBalancesById,
    error: portfolioBalancesByIdError,
    refetch: portfolioBalancesByIdRefetch,
    loading: loadingPorfolioBalancesById,
  } = usePortfolioBalancesForAddressById({ evmAddress, svmAddress })

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
