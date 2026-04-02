import { GqlResult } from '@luxexchange/api'
import { useMemo } from 'react'
import { TokenOption } from 'lx/src/components/lists/items/types'
import { useCommonTokensOptions } from 'lx/src/components/TokenSelector/hooks/useCommonTokensOptions'
import { useCurrencies } from 'lx/src/components/TokenSelector/hooks/useCurrencies'
import {
  currencyInfosToTokenOptions,
  useCurrencyInfosToTokenOptions,
} from 'lx/src/components/TokenSelector/hooks/useCurrencyInfosToTokenOptions'
import { COMMON_BASES } from 'lx/src/constants/routing'
import type { AddressGroup } from 'lx/src/features/accounts/store/types/AccountsState'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { currencyId } from 'lx/src/utils/currencyId'

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
