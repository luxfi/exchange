import { PartialMessage } from '@bufbuild/protobuf'
import { createPromiseClient } from '@connectrpc/connect'
import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { DataApiService } from '@uniswap/client-data-api/dist/data/v1/api_connect'
import {
  GetWalletTokensProfitLossRequest,
  GetWalletTokensProfitLossResponse,
} from '@uniswap/client-data-api/dist/data/v1/api_pb'
import { transformInput, WithoutWalletAccount } from '@universe/api'
import { dataApiGetTransport } from 'uniswap/src/data/rest/base'
import { ReactQueryCacheKey } from 'utilities/src/reactQuery/cache'

const profitLossClient = createPromiseClient(DataApiService, dataApiGetTransport)

type GetWalletTokensProfitLossInput = {
  input?: WithoutWalletAccount<PartialMessage<GetWalletTokensProfitLossRequest>> & {
    evmAddress?: string
    svmAddress?: string
  }
  enabled?: boolean
}

export function useGetWalletTokensProfitLossQuery(
  params: GetWalletTokensProfitLossInput,
): UseQueryResult<GetWalletTokensProfitLossResponse | undefined> {
  const { input, enabled } = params
  const transformedInput = transformInput(input)
  const address = transformedInput ? transformedInput.walletAccount.platformAddresses[0]?.address : undefined

  return useQuery({
    queryKey: [ReactQueryCacheKey.GetWalletTokensProfitLoss, address, input?.chainIds] as const,
    queryFn: () =>
      transformedInput ? profitLossClient.getWalletTokensProfitLoss(transformedInput) : Promise.resolve(undefined),
    enabled: !!address && enabled !== false,
  })
}
