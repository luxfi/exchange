import { FeatureFlags, useFeatureFlag } from '@luxexchange/gating'
import { useMemo } from 'react'
import { dataApiServiceClient } from 'lx/src/data/apiClients/dataApiService/listTokens'
import { useEvent } from '@luxfi/utilities/src/react/hooks'
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

  const listTokens = useEvent((params: Parameters<typeof dataApiServiceClient.listTokens>[0]) =>
    dataApiServiceClient.listTokens(params),
  )

  return useMemo(
    () =>
      createListTokensService({
        getSourceType,
        getTokenStats,
        listTokens,
      }),
    [getSourceType, getTokenStats, listTokens],
  )
}
