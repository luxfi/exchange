import { GqlResult } from '@universe/api'
import { useMemo } from 'react'
import type { AddressGroup } from 'lx/src/features/accounts/store/types/AccountsState'
import { usePortfolioBalances } from 'lx/src/features/dataApi/balances/balances'
import { PortfolioBalance } from 'lx/src/features/dataApi/types'

export function usePortfolioBalancesForAddressById(
  addresses: AddressGroup,
): GqlResult<Record<Address, PortfolioBalance> | undefined> {
  const {
    data: portfolioBalancesById,
    error,
    refetch,
    loading,
  } = usePortfolioBalances({
    ...addresses,
    fetchPolicy: 'cache-first', // we want to avoid re-renders when token selector is opening
  })

  return useMemo(
    () => ({
      data: portfolioBalancesById,
      error,
      refetch,
      loading,
    }),
    [portfolioBalancesById, error, refetch, loading],
  )
}
