import { useQuery } from '@tanstack/react-query'
import {
  DecreaseLPPositionRequest,
  type DecreaseLPPositionResponse,
} from '@uniswap/client-liquidity/dist/uniswap/liquidity/v1/api_pb'
import type {
  DecreasePositionRequest,
  DecreasePositionResponse,
} from '@uniswap/client-liquidity/dist/uniswap/liquidity/v2/api_pb'
import { liquidityQueries } from 'uniswap/src/data/apiClients/liquidityService/liquidityQueries'
import { ONE_SECOND_MS } from 'utilities/src/time/time'

export function useDecreasePositionQuery({
  decreaseCalldataQueryParams,
  transactionError,
  isQueryEnabled,
}: {
  decreaseCalldataQueryParams: DecreaseLPPositionRequest | DecreasePositionRequest | undefined
  transactionError: boolean
  isQueryEnabled: boolean
}): {
  decreaseCalldata: DecreaseLPPositionResponse | DecreasePositionResponse | undefined
  decreaseCalldataLoading: boolean
  calldataError: Error | null
  calldataRefetch: () => void
} {
  const isV1 = decreaseCalldataQueryParams instanceof DecreaseLPPositionRequest

  const {
    data: decreaseV1Calldata,
    isLoading: decreaseV1Loading,
    error: decreaseV1Error,
    refetch: decreaseV1Refetch,
  } = useQuery(
    liquidityQueries.decreaseLPPositionDeprecated({
      params: isV1 ? decreaseCalldataQueryParams : undefined,
      refetchInterval: transactionError ? false : 5 * ONE_SECOND_MS,
      retry: false,
      enabled: isV1 && isQueryEnabled,
    }),
  )

  const {
    data: decreaseV2Calldata,
    isLoading: decreaseV2Loading,
    error: decreaseV2Error,
    refetch: decreaseV2Refetch,
  } = useQuery(
    liquidityQueries.decreasePosition({
      params: !isV1 ? decreaseCalldataQueryParams : undefined,
      refetchInterval: transactionError ? false : 5 * ONE_SECOND_MS,
      retry: false,
      enabled: !isV1 && isQueryEnabled && Boolean(decreaseCalldataQueryParams),
    }),
  )

  const decreaseCalldata = isV1 ? decreaseV1Calldata : decreaseV2Calldata
  const decreaseCalldataLoading = isV1 ? decreaseV1Loading : decreaseV2Loading
  const calldataError = isV1 ? decreaseV1Error : decreaseV2Error
  const calldataRefetch = isV1 ? decreaseV1Refetch : decreaseV2Refetch

  return {
    decreaseCalldata,
    decreaseCalldataLoading,
    calldataError,
    calldataRefetch,
  }
}
