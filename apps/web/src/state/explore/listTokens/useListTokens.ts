<<<<<<< HEAD
import { UniverseChainId } from 'lx/src/features/chains/types'
import { getEffectiveListTokensOptions, type UseListTokensOptions } from '~/state/explore/listTokens/types'
import { useBackendSortedListTokens } from '~/state/explore/listTokens/useBackendSortedListTokens'
import { useTopTokensLegacy } from '~/state/explore/listTokens/useTopTokensLegacy'
=======
import { useMemo } from 'react'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { useListTokensService } from '~/state/explore/listTokens/services/useListTokensService'
import { type UseListTokensOptions, type UseListTokensResult } from '~/state/explore/listTokens/types'
import { buildSparklinesFromMultichain } from '~/state/explore/listTokens/utils/buildSparklinesFromMultichain'
>>>>>>> upstream/main
import { useExploreBackendSortingEnabled } from '~/state/explore/useExploreBackendSortingEnabled'
import { useExploreQueryLatencyTracking } from '~/state/explore/useExploreQueryLatencyTracking'

/**
<<<<<<< HEAD
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
=======
 * Hook that returns top tokens data for the Explore page. Delegates to useListTokensService
 * for data, loading, pagination, and tokenSortRank; adds explore-specific sparklines and latency tracking.
 *
 * @param chainId - Optional chain ID to filter tokens
 * @param options - Optional flat options: sortMethod, sortAscending, filterString, filterTimePeriod (from TokenTableSortStore on Explore; when provided, used instead of Explore filter store). Callers should pass a stable reference (e.g. memoized) to avoid unnecessary refetches.
 */
export function useListTokens(
  chainId: UniverseChainId | undefined,
  options?: UseListTokensOptions,
): UseListTokensResult {
  const isExploreBackendSortingEnabled = useExploreBackendSortingEnabled()
  const result = useListTokensService(chainId, options)

  const sparklines = useMemo(() => buildSparklinesFromMultichain(result.topTokens), [result.topTokens])

>>>>>>> upstream/main
  useExploreQueryLatencyTracking({
    queryType: 'tokens',
    isBackendSortingEnabled: isExploreBackendSortingEnabled,
    isLoading: result.isLoading,
<<<<<<< HEAD
    resultCount: result.topTokens?.length,
    chainId,
  })

  return result
=======
    resultCount: result.topTokens.length,
    chainId,
  })

  return {
    ...result,
    sparklines,
  }
>>>>>>> upstream/main
}
