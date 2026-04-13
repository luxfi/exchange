import type { PartialMessage } from '@bufbuild/protobuf'
import type { ListTokensRequest, ListTokensResponse } from '@uniswap/client-data-api/dist/data/v1/api_pb'
import type { MultichainToken } from '@uniswap/client-data-api/dist/data/v1/types_pb'
import { TokenSortMethod } from '~/components/Tokens/constants'
import { backendSortedToMultichainTokens } from '~/state/explore/listTokens/services/backendSorted/backendSortedToMultichainTokens'
import { tokenStatsToMultichainTokens } from '~/state/explore/listTokens/services/legacy/legacyToMultichainTokens'
import { UseListTokensOptions } from '~/state/explore/listTokens/types'
import {
  timePeriodToVolumeOrderBy,
  tokenSortMethodToOrderBy,
} from '~/state/explore/listTokens/utils/topTokensOrderByMappings'
import type { TokenStat } from '~/state/explore/types'

type ListTokensSourceType = 'legacy' | 'backend_sorted_legacy' | 'backend_sorted_multichain'

interface ListTokensParams {
  chainIds: number[]
  options: Required<UseListTokensOptions>
  pageToken?: string
  pageSize: number
}

interface ListTokensResult {
  multichainTokens: MultichainToken[]
  nextPageToken?: string
}

/**
 * Service for fetching and returning explore tokens in a unified MultichainToken[]
 * shape. Delegates to legacy explore API, backend-sorted legacy response, or
 * backend-sorted multichain response depending on feature flags and context.
 */
interface ListTokensService {
  /**
   * Fetches tokens for the given chains and options. Returns paginated
   * multichain tokens and an optional nextPageToken for pagination.
   */
  getListTokens: (params: ListTokensParams) => Promise<ListTokensResult>
}

function buildBackendRequestParams({
  chainIds,
  options,
  pageToken,
  pageSize,
}: ListTokensParams): PartialMessage<ListTokensRequest> {
  const { sortMethod, sortAscending, filterTimePeriod } = options
  const isPriceSorting = sortMethod === TokenSortMethod.PRICE
  const orderBy = isPriceSorting
    ? undefined
    : sortMethod === TokenSortMethod.VOLUME
      ? timePeriodToVolumeOrderBy[filterTimePeriod]
      : tokenSortMethodToOrderBy[sortMethod]

  return {
    chainIds,
    pageToken,
    pageSize,
    ...(orderBy && { orderBy }),
    ...(!isPriceSorting && { ascending: sortAscending }),
  }
}

async function getListTokensFromBackend({
  listTokens,
  params,
  multichain,
}: {
  listTokens: (params: PartialMessage<ListTokensRequest>) => Promise<ListTokensResponse>
  params: ListTokensParams
  multichain: boolean
}): Promise<ListTokensResult> {
  const base = buildBackendRequestParams(params)
  const response = await listTokens({ ...base, multichain })
  return multichain
    ? response
    : {
        multichainTokens: backendSortedToMultichainTokens(response),
        nextPageToken: response.nextPageToken,
      }
}

/**
 * Creates a ListTokensService that uses the provided context to decide between
 * legacy explore stats, backend-sorted legacy (tokens → multichain transform), or
 * backend-sorted multichain response. Use with useListTokensService for the React hook
 * that wires feature flags and data sources.
 */
export function createListTokensService(ctx: {
  getSourceType: () => ListTokensSourceType
  getTokenStats: () => TokenStat[] | undefined
  listTokens: (params: PartialMessage<ListTokensRequest>) => Promise<ListTokensResponse>
}): ListTokensService {
  const { getSourceType, getTokenStats, listTokens } = ctx

  return {
    async getListTokens(params) {
      const source = getSourceType()

      if (source === 'legacy') {
        const tokenStats = getTokenStats()
        const multichainTokens = tokenStatsToMultichainTokens(tokenStats)
        return { multichainTokens }
      }

      if (source === 'backend_sorted_legacy') {
        return getListTokensFromBackend({ listTokens, params, multichain: false })
      }

      return getListTokensFromBackend({ listTokens, params, multichain: true })
    },
  }
}
