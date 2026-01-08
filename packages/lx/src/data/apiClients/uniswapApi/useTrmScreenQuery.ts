import { skipToken, type UseQueryResult, useQuery } from '@tanstack/react-query'
import { type UseQueryApiHelperHookArgs } from '@luxfi/api'
import { uniswapUrls } from 'lx/src/constants/urls'
import {
  fetchTrmScreen,
  type ScreenRequest,
  type ScreenResponse,
} from 'lx/src/data/apiClients/uniswapApi/UniswapApiClient'
import { ReactQueryCacheKey } from 'utilities/src/reactQuery/cache'

export function useTrmScreenQuery({
  params,
  ...rest
}: UseQueryApiHelperHookArgs<ScreenRequest, ScreenResponse>): UseQueryResult<ScreenResponse> {
  const queryKey = [ReactQueryCacheKey.UniswapApi, uniswapUrls.trmPath, params]

  return useQuery<ScreenResponse>({
    queryKey,
    queryFn: params ? async (): ReturnType<typeof fetchTrmScreen> => await fetchTrmScreen(params) : skipToken,
    ...rest,
  })
}
