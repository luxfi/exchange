import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import { type TradingApi, type UseQueryApiHelperHookArgs } from '@luxfi/api'
import { uniswapUrls } from 'lx/src/constants/urls'
import { TradingApiClient } from 'lx/src/data/apiClients/tradingApi/TradingApiClient'
import { getTradeSettingsDeadline } from 'lx/src/data/apiClients/tradingApi/utils/getTradeSettingsDeadline'
import { ReactQueryCacheKey } from 'utilities/src/reactQuery/cache'

export function useIncreaseLpPositionCalldataQuery({
  params,
  deadlineInMinutes,
  ...rest
}: UseQueryApiHelperHookArgs<TradingApi.IncreaseLPPositionRequest, TradingApi.IncreaseLPPositionResponse> & {
  deadlineInMinutes?: number
}): UseQueryResult<TradingApi.IncreaseLPPositionResponse> {
  const queryKey = [ReactQueryCacheKey.TradingApi, uniswapUrls.tradingApiPaths.increaseLp, params]

  const deadline = getTradeSettingsDeadline(deadlineInMinutes)

  const paramsWithDeadline = { ...params, deadline }
  return useQuery<TradingApi.IncreaseLPPositionResponse>({
    queryKey,
    queryFn: async () => {
      if (!params) {
        throw { name: 'Params are required' }
      }
      return await TradingApiClient.increaseLpPosition(paramsWithDeadline)
    },
    ...rest,
  })
}
