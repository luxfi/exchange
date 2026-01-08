import { PartialMessage } from '@bufbuild/protobuf'
import { ConnectError } from '@connectrpc/connect'
import { useQuery } from '@connectrpc/connect-query'
import { UseQueryResult } from '@tanstack/react-query'
import { GetRewardsRequest, GetRewardsResponse } from '@luxdex/client-data-api/dist/data/v1/api_pb'
import { getRewards } from '@luxdex/client-data-api/dist/data/v1/api-DataApiService_connectquery'
import { uniswapGetTransport } from 'lx/src/data/rest/base'

export function useGetPoolsRewards(
  input?: PartialMessage<GetRewardsRequest>,
  enabled = true,
): UseQueryResult<GetRewardsResponse, ConnectError> {
  return useQuery(getRewards, input, { transport: uniswapGetTransport, enabled })
}
