import { PartialMessage } from '@bufbuild/protobuf'
import { createPromiseClient } from '@connectrpc/connect'
import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { DataApiService } from '@uniswap/client-data-api/dist/data/v1/api_connect'
import {
  GetWalletTokenProfitLossRequest,
  GetWalletTokenProfitLossResponse,
} from '@uniswap/client-data-api/dist/data/v1/api_pb'
import { transformInput, WithoutWalletAccount } from '@universe/api'
import { dataApiGetTransport } from 'uniswap/src/data/rest/base'
import { ReactQueryCacheKey } from 'utilities/src/reactQuery/cache'

const profitLossClient = createPromiseClient(DataApiService, dataApiGetTransport)

type GetWalletTokenProfitLossInput = {
  input?: WithoutWalletAccount<PartialMessage<GetWalletTokenProfitLossRequest>> & {
    evmAddress?: string
    svmAddress?: string
  }
  enabled?: boolean
}

export function useGetWalletTokenProfitLossQuery(
  params: GetWalletTokenProfitLossInput,
): UseQueryResult<GetWalletTokenProfitLossResponse | undefined> {
  const { input, enabled } = params
  const transformedInput = transformInput(input)
  const address = transformedInput ? transformedInput.walletAccount.platformAddresses[0]?.address : undefined

  return useQuery({
    queryKey: [ReactQueryCacheKey.GetWalletTokenProfitLoss, address, input?.tokenAddress, input?.chainId] as const,
    queryFn: () =>
      transformedInput ? profitLossClient.getWalletTokenProfitLoss(transformedInput) : Promise.resolve(undefined),
    enabled: !!input?.tokenAddress && !!address && enabled !== false,
  })
}
