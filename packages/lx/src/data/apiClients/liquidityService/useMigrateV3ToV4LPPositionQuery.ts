import { UseQueryResult, useQuery } from '@tanstack/react-query'
import {
  MigrateV3ToV4LPPositionRequest,
  MigrateV3ToV4LPPositionResponse,
} from '@luxdex/client-liquidity/dist/uniswap/liquidity/v1/api_pb'
import { LIQUIDITY_PATHS, type UseQueryApiHelperHookArgs } from '@luxfi/api'
import { uniswapUrls } from 'lx/src/constants/urls'
import { LiquidityServiceClient } from 'lx/src/data/apiClients/liquidityService/LiquidityServiceClient'
import { ReactQueryCacheKey } from 'utilities/src/reactQuery/cache'

export function useMigrateV3ToV4LPPositionQuery({
  params,
  ...rest
}: UseQueryApiHelperHookArgs<
  MigrateV3ToV4LPPositionRequest,
  MigrateV3ToV4LPPositionResponse
>): UseQueryResult<MigrateV3ToV4LPPositionResponse> {
  const queryKey = [
    ReactQueryCacheKey.LiquidityService,
    uniswapUrls.liquidityServiceUrl,
    LIQUIDITY_PATHS.migrateV3ToV4LPPosition,
    params,
  ]

  return useQuery<MigrateV3ToV4LPPositionResponse>({
    queryKey,
    queryFn: async () => {
      if (!params) {
        throw { name: 'Params are required' }
      }
      return await LiquidityServiceClient.migrateV3ToV4LpPosition(params)
    },
    ...rest,
  })
}
