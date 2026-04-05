<<<<<<< HEAD
import { FeatureFlags, useFeatureFlag } from '@l.x/gating'
import { useMemo } from 'react'
import { dataApiServiceClient } from 'lx/src/data/apiClients/dataApiService/listTokens'
import { useEvent } from '@l.x/utils/src/react/hooks'
import { createListTokensService, type ListTokensService } from '~/state/explore/listTokens/services/listTokensService'
import { getEffectiveListTokensOptions, type UseListTokensOptions } from '~/state/explore/listTokens/types'
import { useTopTokensLegacy } from '~/state/explore/listTokens/useTopTokensLegacy'
import { useExploreBackendSortingEnabled } from '~/state/explore/useExploreBackendSortingEnabled'

/**
 * Returns a ListTokensService that fetches explore tokens as MultichainToken[].
 * Chooses legacy explore API vs backend-sorted list-tokens (with or without multichain
 * response) based on backend sorting and multichain UX feature flags. Options
 * (sort, time period, etc.) are applied when calling getListTokens on the
 * returned service.
 *
 * @param options - Optional list options; defaults from getEffectiveListTokensOptions.
 */
// eslint-disable-next-line import/no-unused-modules -- service used by consumers that need ListTokens in MultichainToken shape
export function useListTokensService(options?: UseListTokensOptions): ListTokensService {
  const effectiveOptions = getEffectiveListTokensOptions(options)
  const backendSorting = useExploreBackendSortingEnabled()
  const multichainUx = useFeatureFlag(FeatureFlags.MultichainTokenUx)

=======
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { FeatureFlags, useFeatureFlag } from '@universe/gating'
import { useMemo } from 'react'
import { dataApiServiceClient, type ListTokensParams } from 'uniswap/src/data/apiClients/dataApiService/listTokens'
import { useEnabledChains } from 'uniswap/src/features/chains/hooks/useEnabledChains'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { useEvent } from 'utilities/src/react/hooks'
import { EXPLORE_API_PAGE_SIZE } from '~/state/explore/constants'
import { useInfiniteLoadMore } from '~/state/explore/hooks/useInfiniteLoadMore'
import { createListTokensService } from '~/state/explore/listTokens/services/listTokensService'
import {
  getEffectiveListTokensOptions,
  type UseListTokensOptions,
  type UseListTokensServiceResult,
} from '~/state/explore/listTokens/types'
import { useTopTokensLegacy } from '~/state/explore/listTokens/useTopTokensLegacy'
import { processMultichainTokensForDisplay } from '~/state/explore/listTokens/utils/processMultichainTokensForDisplay'
import { useExploreBackendSortingEnabled } from '~/state/explore/useExploreBackendSortingEnabled'

/**
 * Runs both legacy (useTopTokensLegacy) and backend (infinite query) data paths and returns
 * a unified result. Loading and error state are symmetric: both come from this hook.
 *
 * @param chainId - Optional chain ID to filter tokens
 * @param options - Optional list options; defaults from getEffectiveListTokensOptions.
 */
export function useListTokensService(
  chainId: UniverseChainId | undefined,
  options?: UseListTokensOptions,
): UseListTokensServiceResult {
  const effectiveOptions = getEffectiveListTokensOptions(options)
  const { chains: enabledChainIds } = useEnabledChains()
  const backendSorting = useExploreBackendSortingEnabled()
  const multichainUx = useFeatureFlag(FeatureFlags.MultichainTokenUx)

  const chainIds = useMemo(() => (chainId !== undefined ? [chainId] : enabledChainIds), [chainId, enabledChainIds])

  // Stable keys so pagination/query state is preserved and we avoid refetches on load-state changes
  const optionsKeySegment = useMemo(
    () =>
      [
        effectiveOptions.sortMethod,
        effectiveOptions.sortAscending,
        effectiveOptions.filterString,
        effectiveOptions.filterTimePeriod,
      ] as const,
    [
      effectiveOptions.sortMethod,
      effectiveOptions.sortAscending,
      effectiveOptions.filterString,
      effectiveOptions.filterTimePeriod,
    ],
  )
  const listTokensQueryKey = useMemo(
    () => ['topTokens', chainIds, ...optionsKeySegment, backendSorting, multichainUx] as const,
    [chainIds, optionsKeySegment, backendSorting, multichainUx],
  )
  const legacyQueryKey = useMemo(
    () => ['topTokens', 'legacy', chainIds, ...optionsKeySegment] as const,
    [chainIds, optionsKeySegment],
  )

>>>>>>> upstream/main
  const legacyResult = useTopTokensLegacy({
    enabled: !backendSorting,
    options: effectiveOptions,
  })
  const getTokenStats = useEvent(() => legacyResult.topTokens)

  const getSourceType = useEvent(() => {
    if (!backendSorting) {
      return 'legacy' as const
    }
    return multichainUx ? ('backend_sorted_multichain' as const) : ('backend_sorted_legacy' as const)
  })

<<<<<<< HEAD
  const listTokens = useEvent((params: Parameters<typeof dataApiServiceClient.listTokens>[0]) =>
    dataApiServiceClient.listTokens(params),
  )

  return useMemo(
=======
  const listTokens = useEvent((params: ListTokensParams) => dataApiServiceClient.listTokens(params))

  const service = useMemo(
>>>>>>> upstream/main
    () =>
      createListTokensService({
        getSourceType,
        getTokenStats,
        listTokens,
      }),
    [getSourceType, getTokenStats, listTokens],
  )
<<<<<<< HEAD
=======

  const {
    data,
    isLoading: isBackendLoading,
    error: backendError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: listTokensQueryKey,
    queryFn: ({ pageParam }) =>
      service.getListTokens({
        chainIds,
        options: effectiveOptions,
        pageSize: EXPLORE_API_PAGE_SIZE,
        pageToken: pageParam,
      }),
    getNextPageParam: (lastPage) => lastPage.nextPageToken || undefined,
    initialPageParam: '',
    enabled: backendSorting,
  })

  const {
    data: legacyData,
    isLoading: isLegacyQueryLoading,
    isError: isLegacyQueryError,
  } = useQuery({
    queryKey: legacyQueryKey,
    queryFn: () =>
      service.getListTokens({
        chainIds,
        options: effectiveOptions,
        pageSize: EXPLORE_API_PAGE_SIZE,
        pageToken: '',
      }),
    enabled: !backendSorting && !legacyResult.isLoading,
  })

  const { topTokens, tokenSortRank } = useMemo(() => {
    const flat = backendSorting
      ? (data?.pages ?? []).flatMap((p) => p.multichainTokens)
      : (legacyData?.multichainTokens ?? [])
    return processMultichainTokensForDisplay(flat, {
      ...effectiveOptions,
      chainId: multichainUx && chainId !== undefined ? chainId : undefined,
    })
  }, [backendSorting, chainId, data?.pages, effectiveOptions, legacyData?.multichainTokens, multichainUx])

  const loadMore = useInfiniteLoadMore({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    dataLength: topTokens.length,
  })

  const isLoading = backendSorting ? isBackendLoading : legacyResult.isLoading || isLegacyQueryLoading
  const isError = backendSorting ? !!backendError : !!legacyResult.isError || isLegacyQueryError

  return {
    topTokens,
    tokenSortRank,
    isLoading,
    isError,
    loadMore: backendSorting ? loadMore : undefined,
    hasNextPage: backendSorting ? hasNextPage : false,
    isFetchingNextPage: backendSorting ? isFetchingNextPage : false,
  }
>>>>>>> upstream/main
}
