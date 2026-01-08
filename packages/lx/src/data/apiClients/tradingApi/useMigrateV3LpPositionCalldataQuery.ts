import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import { type TradingApi, type UseQueryApiHelperHookArgs } from '@luxfi/api'
import { uniswapUrls } from 'lx/src/constants/urls'
import { TradingApiClient } from 'lx/src/data/apiClients/tradingApi/TradingApiClient'
import { ReactQueryCacheKey } from 'utilities/src/reactQuery/cache'

export function useMigrateV3LpPositionCalldataQuery({
  params,
  ...rest
}: UseQueryApiHelperHookArgs<
  TradingApi.MigrateLPPositionRequest,
  TradingApi.MigrateLPPositionResponse
>): UseQueryResult<TradingApi.MigrateLPPositionResponse> {
  const queryKey = [ReactQueryCacheKey.TradingApi, uniswapUrls.tradingApiPaths.migrate, params]

  return useQuery<TradingApi.MigrateLPPositionResponse>({
    queryKey,
    queryFn: async () => {
      if (!params) {
        throw { name: 'Params are required' }
      }
      return await TradingApiClient.migrateV3ToV4LpPosition(params)
    },
    ...rest,
  })
}
