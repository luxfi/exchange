import { UniverseChainId } from 'lx/src/features/chains/types'
import { getEffectiveListTokensOptions, type UseListTokensOptions } from '~/state/explore/listTokens/types'
import { useBackendSortedListTokens } from '~/state/explore/listTokens/useBackendSortedListTokens'
import { useTopTokensLegacy } from '~/state/explore/listTokens/useTopTokensLegacy'
import { useExploreBackendSortingEnabled } from '~/state/explore/useExploreBackendSortingEnabled'
import { useExploreQueryLatencyTracking } from '~/state/explore/useExploreQueryLatencyTracking'

/**
 * Hook that returns top tokens data.
 * Uses the new ListTokens endpoint with backend sorting when ExplorePaginationImprovements is enabled,
 * otherwise falls back to the legacy ExploreContext implementation.
 * @param chainId - Optional chain ID to filter tokens
 * @param options - Optional flat options: sortMethod, sortAscending, filterString, filterTimePeriod (from TokenTableSortStore on Explore; when provided, used instead of Explore filter store). Callers should pass a stable reference (e.g. memoized) to avoid unnecessary refetches.
 */
export function useListTokens(chainId: UniverseChainId | undefined, options?: UseListTokensOptions) {
  const isExploreBackendSortingEnabled = useExploreBackendSortingEnabled()
  const effectiveOptions = getEffectiveListTokensOptions(options)

  // Legacy uses ExploreContext - skip processing when new endpoint is enabled
  const legacyResult = useTopTokensLegacy({
    enabled: !isExploreBackendSortingEnabled,
    options: effectiveOptions,
  })
  // Only fetch from new endpoint when feature flag is enabled
  const backendSortedResult = useBackendSortedListTokens({
    chainId,
    enabled: isExploreBackendSortingEnabled,
    options: effectiveOptions,
  })

  const result = isExploreBackendSortingEnabled
    ? backendSortedResult
    : {
        ...legacyResult,
        loadMore: undefined,
        hasNextPage: false,
        isFetchingNextPage: false,
      }

  // Track latency when data first loads (for both legacy and new implementations)
  useExploreQueryLatencyTracking({
    queryType: 'tokens',
    isBackendSortingEnabled: isExploreBackendSortingEnabled,
    isLoading: result.isLoading,
    resultCount: result.topTokens?.length,
    chainId,
  })

  return result
}
