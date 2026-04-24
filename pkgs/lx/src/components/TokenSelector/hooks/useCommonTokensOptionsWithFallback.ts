import { GqlResult } from '@l.x/api'
import { useMemo } from 'react'
import { TokenOption } from '@l.x/lx/src/components/lists/items/types'
import { useCommonTokensOptions } from '@l.x/lx/src/components/TokenSelector/hooks/useCommonTokensOptions'
import { useCurrencies } from '@l.x/lx/src/components/TokenSelector/hooks/useCurrencies'
import {
  currencyInfosToTokenOptions,
  useCurrencyInfosToTokenOptions,
} from '@l.x/lx/src/components/TokenSelector/hooks/useCurrencyInfosToTokenOptions'
import { COMMON_BASES } from '@l.x/lx/src/constants/routing'
import type { AddressGroup } from '@l.x/lx/src/features/accounts/store/types/AccountsState'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { currencyId } from '@l.x/lx/src/utils/currencyId'

export function useCommonTokensOptionsWithFallback({
  addresses,
  chainFilter,
}: {
  addresses: AddressGroup
  chainFilter: UniverseChainId | null
}): GqlResult<TokenOption[] | undefined> {
  const { data, error, refetch, loading } = useCommonTokensOptions({ addresses, chainFilter })
  const commonBases = chainFilter ? currencyInfosToTokenOptions(COMMON_BASES[chainFilter]) : undefined
  const commonBasesCurrencyIds = useMemo(
    () => commonBases?.map((token) => currencyId(token.currencyInfo.currency)).filter(Boolean) ?? [],
    [commonBases],
  )
  const { data: commonBasesCurrencies } = useCurrencies(commonBasesCurrencyIds)
  const commonBasesTokenOptions = useCurrencyInfosToTokenOptions({
    currencyInfos: commonBasesCurrencies,
    portfolioBalancesById: {},
  })

  const shouldFallback = data?.length === 0 && commonBases?.length

  return useMemo(
    () => ({
      data: shouldFallback ? commonBasesTokenOptions : data,
      error: shouldFallback ? undefined : error,
      refetch,
      loading,
    }),
    [commonBasesTokenOptions, data, error, loading, refetch, shouldFallback],
  )
}
