import { GqlResult } from '@luxfi/api'
import { useMemo } from 'react'
import { TokenOption } from 'lx/src/components/lists/items/types'
import { useCommonTokensOptions } from 'lx/src/components/TokenSelector/hooks/useCommonTokensOptions'
import { useCurrencies } from 'lx/src/components/TokenSelector/hooks/useCurrencies'
import {
  currencyInfosToTokenOptions,
  useCurrencyInfosToTokenOptions,
} from 'lx/src/components/TokenSelector/hooks/useCurrencyInfosToTokenOptions'
import { COMMON_BASES } from 'lx/src/constants/routing'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { isBackendSupportedChainId } from 'lx/src/features/chains/utils'
import { currencyId } from 'lx/src/utils/currencyId'

export function useCommonTokensOptionsWithFallback({
  evmAddress,
  svmAddress,
  chainFilter,
}: {
  evmAddress: Address | undefined
  svmAddress: Address | undefined
  chainFilter: UniverseChainId | null
}): GqlResult<TokenOption[] | undefined> {
  const { data, error, refetch, loading } = useCommonTokensOptions({ evmAddress, svmAddress, chainFilter })

  // Get fallback tokens directly from COMMON_BASES
  const commonBases = chainFilter ? currencyInfosToTokenOptions(COMMON_BASES[chainFilter]) : undefined

  // For non-backend-supported chains (like LuxDev), skip API enrichment entirely
  // since the API will fail anyway
  const isBackendSupported = chainFilter ? isBackendSupportedChainId(chainFilter) : true

  const commonBasesCurrencyIds = useMemo(
    () =>
      isBackendSupported
        ? (commonBases?.map((token) => currencyId(token.currencyInfo.currency)).filter(Boolean) ?? [])
        : [],
    [commonBases, isBackendSupported],
  )
  const { data: commonBasesCurrencies } = useCurrencies(commonBasesCurrencyIds)
  const commonBasesTokenOptions = useCurrencyInfosToTokenOptions({
    currencyInfos: commonBasesCurrencies,
    portfolioBalancesById: {},
  })

  // Determine if we should use fallback tokens
  const hasApiData = data && data.length > 0
  const shouldFallback = !hasApiData && commonBases && commonBases.length > 0

  // Use API-enriched token options if available, otherwise fall back to direct commonBases
  const fallbackTokens = commonBasesTokenOptions?.length ? commonBasesTokenOptions : commonBases

  return useMemo(
    () => ({
      // For non-backend-supported chains, always use commonBases directly
      // For backend-supported chains, use API data or fallback
      data: !isBackendSupported ? commonBases : shouldFallback ? fallbackTokens : data,
      // Suppress errors for non-backend-supported chains or when falling back
      error: !isBackendSupported || shouldFallback ? undefined : error,
      refetch,
      // Don't show loading for non-backend-supported chains since we use static data
      loading: isBackendSupported ? loading : false,
    }),
    [commonBases, fallbackTokens, data, error, loading, refetch, shouldFallback, isBackendSupported],
  )
}
