import { type TransactionRequest } from '@ethersproject/providers'
import { keepPreviousData, skipToken, type UseQueryResult } from '@tanstack/react-query'
import {
  type GasFeeResultWithoutState,
  type GasStrategy,
  type UseQueryWithImmediateGarbageCollectionApiHelperHookArgs,
  useQueryWithImmediateGarbageCollection,
} from '@universe/api'
import { useStatsigClientStatus } from '@universe/gating'
import { luxUrls } from 'lx/src/constants/urls'
import { LuxApiClient } from 'lx/src/data/apiClients/luxApi/LuxApiClient'
import { getActiveGasStrategy } from 'lx/src/features/gas/utils'
import { ReactQueryCacheKey } from 'utilities/src/reactQuery/cache'

export function useGasFeeQuery({
  params,
  // Warning: only use when it's Ok to return old data even when params change.
  shouldUsePreviousValueDuringLoading,
  ...rest
}: UseQueryWithImmediateGarbageCollectionApiHelperHookArgs<
  {
    tx: TransactionRequest
    fallbackGasLimit?: number
    smartContractDelegationAddress?: Address
    gasStrategy?: GasStrategy
  },
  GasFeeResultWithoutState
> & { shouldUsePreviousValueDuringLoading?: boolean }): UseQueryResult<GasFeeResultWithoutState> {
  const { isStatsigReady } = useStatsigClientStatus()
  const queryKey = [
    ReactQueryCacheKey.LuxApi,
    luxUrls.gasServicePath,
    params?.tx,
    params?.fallbackGasLimit,
    params?.smartContractDelegationAddress,
    params?.gasStrategy,
  ]

  return useQueryWithImmediateGarbageCollection<GasFeeResultWithoutState>({
    queryKey,
    queryFn: params
      ? (): Promise<GasFeeResultWithoutState> => fetchGasFeeQuery({ ...params, isStatsigReady })
      : skipToken,
    ...(shouldUsePreviousValueDuringLoading && { placeholderData: keepPreviousData }),
    ...rest,
  })
}

export async function fetchGasFeeQuery(params: {
  tx: TransactionRequest
  fallbackGasLimit?: number
  smartContractDelegationAddress?: Address
  isStatsigReady: boolean
  gasStrategy?: GasStrategy
}): Promise<GasFeeResultWithoutState> {
  const {
    tx,
    fallbackGasLimit,
    smartContractDelegationAddress,
    isStatsigReady,
    gasStrategy: overrideGasStrategy,
  } = params
  const gasStrategy =
    overrideGasStrategy || getActiveGasStrategy({ chainId: tx.chainId, type: 'general', isStatsigReady })
  return LuxApiClient.fetchGasFee({ tx, fallbackGasLimit, gasStrategy, smartContractDelegationAddress })
}
