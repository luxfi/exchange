import { type PartialMessage } from '@bufbuild/protobuf'
import { createPromiseClient } from '@connectrpc/connect'
import { infiniteQueryOptions } from '@tanstack/react-query'
import { DataApiService } from '@luxamm/client-data-api/dist/data/v1/api_connect'
import type { ListTokensRequest, ListTokensResponse } from '@luxamm/client-data-api/dist/data/v1/api_pb'
import { createDataApiServiceClient } from '@l.x/api'
import { lxGetTransport } from '@l.x/lx/src/data/rest/base'
import { ReactQueryCacheKey } from 'utilities/src/reactQuery/cache'

export type ListTokensInput = {
  params?: Omit<PartialMessage<ListTokensRequest>, 'pageToken'>
  enabled?: boolean
}

type ListTokensQueryKey = readonly [ReactQueryCacheKey.DataApiService, 'listTokens', ListTokensInput['params']]

export const dataApiServiceClient = createDataApiServiceClient({
  rpcClient: createPromiseClient(DataApiService, lxGetTransport),
})

export function getListTokensQueryOptions({
  params,
  enabled,
}: ListTokensInput): ReturnType<
  typeof infiniteQueryOptions<ListTokensResponse, Error, ListTokensResponse, ListTokensQueryKey, string>
> {
  return infiniteQueryOptions({
    queryKey: [ReactQueryCacheKey.DataApiService, 'listTokens', params] as const,
    queryFn: async ({ pageParam }: { pageParam: string }): Promise<ListTokensResponse> => {
      if (!params) {
        throw new Error('params required')
      }
      return dataApiServiceClient.listTokens({ ...params, pageToken: pageParam })
    },
    initialPageParam: '',
    getNextPageParam: (lastPage: ListTokensResponse) => lastPage.nextPageToken || undefined,
    enabled,
  })
}
