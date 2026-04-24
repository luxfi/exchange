import { skipToken, type UseQueryResult } from '@tanstack/react-query'
import {
  type TradingApi,
  type UseQueryWithImmediateGarbageCollectionApiHelperHookArgs,
  useQueryWithImmediateGarbageCollection,
} from '@l.x/api'
import { lxUrls } from '@l.x/lx/src/constants/urls'
import { TradingApiClient } from '@l.x/lx/src/data/apiClients/tradingApi/TradingApiClient'
import { ReactQueryCacheKey } from '@l.x/utils/src/reactQuery/cache'

export function useCheckApprovalQuery({
  params,
  ...rest
}: UseQueryWithImmediateGarbageCollectionApiHelperHookArgs<
  TradingApi.ApprovalRequest,
  TradingApi.ApprovalResponse
>): UseQueryResult<TradingApi.ApprovalResponse> {
  const queryKey = [ReactQueryCacheKey.TradingApi, lxUrls.tradingApiPaths.approval, params]

  return useQueryWithImmediateGarbageCollection<TradingApi.ApprovalResponse>({
    queryKey,
    queryFn: params
      ? async (): ReturnType<typeof TradingApiClient.fetchCheckApproval> =>
          await TradingApiClient.fetchCheckApproval(params)
      : skipToken,
    ...rest,
  })
}
