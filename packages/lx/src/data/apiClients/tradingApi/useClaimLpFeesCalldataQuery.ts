import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import { type TradingApi, type UseQueryApiHelperHookArgs } from '@luxfi/api'
import { uniswapUrls } from 'lx/src/constants/urls'
import { TradingApiClient } from 'lx/src/data/apiClients/tradingApi/TradingApiClient'
import { ReactQueryCacheKey } from 'utilities/src/reactQuery/cache'

export function useClaimLpFeesCalldataQuery({
  params,
  ...rest
}: UseQueryApiHelperHookArgs<
  TradingApi.ClaimLPFeesRequest,
  TradingApi.ClaimLPFeesResponse
>): UseQueryResult<TradingApi.ClaimLPFeesResponse> {
  const queryKey = [ReactQueryCacheKey.TradingApi, uniswapUrls.tradingApiPaths.claimLpFees, params]

  return useQuery<TradingApi.ClaimLPFeesResponse>({
    queryKey,
    queryFn: async () => {
      if (!params) {
        throw { name: 'Params are required' }
      }
      return await TradingApiClient.claimLpFees(params)
    },
    ...rest,
  })
}
