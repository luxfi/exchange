import { GqlResult } from '@luxfi/api'
import { useMemo } from 'react'
import { OnchainItemListOptionType, TokenOption } from 'lx/src/components/lists/items/types'
import { filter } from 'lx/src/components/TokenSelector/filter'
import { usePortfolioBalancesForAddressById } from 'lx/src/components/TokenSelector/hooks/usePortfolioBalancesForAddressById'
import { useEnabledChains } from 'lx/src/features/chains/hooks/useEnabledChains'
import { UniverseChainId } from 'lx/src/features/chains/types'
import {
  sortPortfolioBalances,
  useTokenBalancesGroupedByVisibility,
} from 'lx/src/features/dataApi/balances/balances'

export function usePortfolioTokenOptions({
  evmAddress,
  svmAddress,
  chainFilter,
  searchFilter,
}: {
  evmAddress: Address | undefined
  svmAddress: Address | undefined
  chainFilter: UniverseChainId | null
  searchFilter?: string
}): GqlResult<TokenOption[] | undefined> {
  const {
    data: portfolioBalancesById,
    error,
    refetch,
    loading,
  } = usePortfolioBalancesForAddressById({ evmAddress, svmAddress })
  const { isTestnetModeEnabled } = useEnabledChains()

  const { shownTokens } = useTokenBalancesGroupedByVisibility({
    balancesById: portfolioBalancesById,
  })

  const portfolioBalances: TokenOption[] | undefined = useMemo(
    () =>
      shownTokens
        ? sortPortfolioBalances({ balances: shownTokens, isTestnetModeEnabled }).map((balance) => ({
            ...balance,
            type: OnchainItemListOptionType.Token,
          }))
        : undefined,
    [shownTokens, isTestnetModeEnabled],
  )

  const filteredPortfolioBalances = useMemo(
    () => portfolioBalances && filter({ tokenOptions: portfolioBalances, chainFilter, searchFilter, hideWSOL: true }),
    [chainFilter, portfolioBalances, searchFilter],
  )

  return {
    data: filteredPortfolioBalances,
    error,
    refetch,
    loading,
  }
}
