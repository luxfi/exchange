import { SearchTokensResponse, SearchType } from '@uniswap/client-search/dist/search/v1/api_pb'
import { GqlResult } from '@universe/api'
import { FeatureFlags, useFeatureFlag } from '@universe/gating'
import { useMemo } from 'react'
import {
  multichainTokenToCurrencyInfos,
  useSearchTokensAndPoolsQuery,
} from 'uniswap/src/data/rest/searchTokensAndPools'
import { toMultichainSearchResult } from 'uniswap/src/data/rest/toMultichainSearchResult'
import { transformSearchToMultichain } from 'uniswap/src/data/rest/transformSearchToMultichain'
import { useConnectionStatus } from 'uniswap/src/features/accounts/store/hooks'
import { useEnabledChains } from 'uniswap/src/features/chains/hooks/useEnabledChains'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { CurrencyInfo, MultichainSearchResult } from 'uniswap/src/features/dataApi/types'
import { Platform } from 'uniswap/src/features/platforms/types/Platform'
import { NUMBER_OF_RESULTS_LONG } from 'uniswap/src/features/search/SearchModal/constants'
import { isWSOL } from 'uniswap/src/utils/isWSOL'
import { useEvent } from 'utilities/src/react/hooks'

function useSearchTokensQuery<T>({
  searchQuery,
  chainFilter,
  skip,
  size = NUMBER_OF_RESULTS_LONG,
  select,
}: {
  searchQuery: string | null
  chainFilter: UniverseChainId | null
  skip: boolean
  size?: number
  select: (data: SearchTokensResponse) => T
}): GqlResult<T> {
  const { chains: enabledChainIds } = useEnabledChains()

  const isSvmConnected = useConnectionStatus(Platform.SVM).isConnected
  const isMultichainTokenUx = useFeatureFlag(FeatureFlags.MultichainTokenUx)

  const variables = useMemo(
    () => ({
      searchQuery: searchQuery ?? undefined,
      chainIds: chainFilter ? [chainFilter] : enabledChainIds,
      searchType: SearchType.TOKEN,
      page: 1,
      size,
      prioritizeSvm: isSvmConnected,
      multichain: isMultichainTokenUx,
    }),
    [searchQuery, chainFilter, size, enabledChainIds, isSvmConnected, isMultichainTokenUx],
  )

  const { data, error, isPending, refetch } = useSearchTokensAndPoolsQuery<T>({
    input: variables,
    enabled: !skip,
    select,
  })

  return useMemo(
    () => ({ data, loading: isPending, error: error ?? undefined, refetch }),
    [data, isPending, error, refetch],
  )
}

// TODO(CONS-1399): Remove useSearchTokens once MultichainTokenUx is fully rolled out.
// Callers (useTokenSectionsForSearchResults) should migrate to useMultichainSearchTokens and flatten results.
export function useSearchTokens({
  searchQuery,
  chainFilter,
  skip,
  size,
  hideWSOL = false,
}: {
  searchQuery: string | null
  chainFilter: UniverseChainId | null
  skip: boolean
  size?: number
  hideWSOL?: boolean
}): GqlResult<CurrencyInfo[]> {
  const select = useEvent((data: SearchTokensResponse): CurrencyInfo[] => {
    const multichainResponse = transformSearchToMultichain(data)
    const currencyInfos = multichainResponse.multichainTokens.flatMap(multichainTokenToCurrencyInfos)
    return currencyInfos.filter((c) => !(hideWSOL && isWSOL(c.currency)))
  })

  return useSearchTokensQuery({ searchQuery, chainFilter, skip, size, select })
}

export function useMultichainSearchTokens({
  searchQuery,
  chainFilter,
  skip,
  size,
}: {
  searchQuery: string | null
  chainFilter: UniverseChainId | null
  skip: boolean
  size?: number
}): GqlResult<MultichainSearchResult[]> {
  const select = useEvent((data: SearchTokensResponse): MultichainSearchResult[] => {
    const multichainResponse = transformSearchToMultichain(data)
    return multichainResponse.multichainTokens
      .map(toMultichainSearchResult)
      .filter((r): r is MultichainSearchResult => r !== undefined)
  })

  return useSearchTokensQuery({ searchQuery, chainFilter, skip, size, select })
}
