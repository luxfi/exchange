import { WatchQueryFetchPolicy } from '@apollo/client'
import { useMemo } from 'react'
import { usePortfolioBalances } from 'lx/src/features/dataApi/balances/balances'
import { PortfolioBalance } from 'lx/src/features/dataApi/types'
import { CurrencyId } from 'lx/src/types/currency'

export function useBalances({
  evmAddress,
  svmAddress,
  currencies,
  fetchPolicy = 'cache-and-network',
}: {
  evmAddress?: Address
  svmAddress?: Address
  currencies: CurrencyId[] | undefined
  fetchPolicy?: WatchQueryFetchPolicy
}): PortfolioBalance[] | null {
  const { data: balances } = usePortfolioBalances({
    evmAddress,
    svmAddress,
    fetchPolicy,
  })

  return useMemo(() => {
    if (!currencies || !currencies.length || !balances) {
      return null
    }

    return currencies.map((id: CurrencyId) => balances[id] ?? null).filter((x): x is PortfolioBalance => Boolean(x))
  }, [balances, currencies])
}
