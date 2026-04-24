import { Pool, SearchTokensResponse, SearchType } from '@luxamm/client-search/dist/search/v1/api_pb'
import { GqlResult } from '@l.x/api'
import { useMemo } from 'react'
import { searchPoolToPoolSearchResult, useSearchTokensAndPoolsQuery } from '@l.x/lx/src/data/rest/searchTokensAndPools'
import { useEnabledChains } from '@l.x/lx/src/features/chains/hooks/useEnabledChains'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { Platform } from '@l.x/lx/src/features/platforms/types/Platform'
import { PoolSearchHistoryResult } from '@l.x/lx/src/features/search/SearchHistoryResult'
import { NUMBER_OF_RESULTS_LONG } from '@l.x/lx/src/features/search/SearchModal/constants'
import { useEvent } from '@l.x/utils/src/react/hooks'

export function useSearchPools({
  searchQuery,
  chainFilter,
  skip,
  size = NUMBER_OF_RESULTS_LONG,
}: {
  searchQuery: string | null
  chainFilter: UniverseChainId | null
  skip: boolean
  size?: number
}): GqlResult<PoolSearchHistoryResult[]> {
  const { chains: enabledChainIds } = useEnabledChains({ platform: Platform.EVM })

  const variables = useMemo(
    () => ({
      searchQuery: searchQuery ?? undefined,
      chainIds: chainFilter ? [chainFilter] : enabledChainIds,
      searchType: SearchType.POOL,
      page: 1,
      size,
    }),
    [searchQuery, chainFilter, size, enabledChainIds],
  )

  const poolSelect = useEvent((response: SearchTokensResponse): PoolSearchHistoryResult[] => {
    const responsePools: Pool[] = response.pools
    return responsePools
      .map(searchPoolToPoolSearchResult)
      .filter((pool): pool is PoolSearchHistoryResult => pool !== undefined)
  })

  const {
    data: pools,
    error,
    isPending,
    refetch,
  } = useSearchTokensAndPoolsQuery<PoolSearchHistoryResult[]>({
    input: variables,
    enabled: !skip,
    select: poolSelect,
  })

  return useMemo(
    () => ({ data: pools, loading: isPending, error: error ?? undefined, refetch }),
    [pools, isPending, error, refetch],
  )
}
