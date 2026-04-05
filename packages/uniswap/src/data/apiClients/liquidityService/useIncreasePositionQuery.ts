import { useQuery } from '@tanstack/react-query'
import {
  IncreaseLPPositionRequest,
  IncreaseLPPositionResponse,
} from '@uniswap/client-liquidity/dist/uniswap/liquidity/v1/api_pb'
import {
  IncreasePositionRequest,
  IncreasePositionResponse,
} from '@uniswap/client-liquidity/dist/uniswap/liquidity/v2/api_pb'
import { liquidityQueries } from 'uniswap/src/data/apiClients/liquidityService/liquidityQueries'
import { ONE_SECOND_MS } from 'utilities/src/time/time'

export function useIncreasePositionQuery({
  increaseCalldataQueryParams,
  transactionError,
  isQueryEnabled,
}: {
  increaseCalldataQueryParams: IncreaseLPPositionRequest | IncreasePositionRequest | undefined
  transactionError: boolean
  isQueryEnabled: boolean
}): {
  increaseCalldata: IncreaseLPPositionResponse | IncreasePositionResponse | undefined
  isCalldataLoading: boolean
  calldataError: Error | null
  calldataRefetch: () => void
} {
  const isV1 = increaseCalldataQueryParams instanceof IncreaseLPPositionRequest

  const {
    data: increaseV1Calldata,
    isLoading: increaseV1Loading,
    error: increaseV1Error,
    refetch: increaseV1Refetch,
  } = useQuery(
    liquidityQueries.increasePositionDeprecated({
      params: isV1 ? increaseCalldataQueryParams : undefined,
      refetchInterval: transactionError ? false : 5 * ONE_SECOND_MS,
      retry: false,
      enabled: isV1 && isQueryEnabled && Boolean(increaseCalldataQueryParams),
    }),
  )

  const {
    data: increaseV2Calldata,
    isLoading: increaseV2Loading,
    error: increaseV2Error,
    refetch: increaseV2Refetch,
  } = useQuery(
    liquidityQueries.increasePosition({
      params: !isV1 ? increaseCalldataQueryParams : undefined,
      refetchInterval: transactionError ? false : 5 * ONE_SECOND_MS,
      retry: false,
      enabled: !isV1 && isQueryEnabled && Boolean(increaseCalldataQueryParams),
    }),
  )

  const increaseCalldata = isV1 ? increaseV1Calldata : increaseV2Calldata
  const isCalldataLoading = isV1 ? increaseV1Loading : increaseV2Loading
  const calldataError = isV1 ? increaseV1Error : increaseV2Error
  const calldataRefetch = isV1 ? increaseV1Refetch : increaseV2Refetch

  return {
    increaseCalldata,
    isCalldataLoading,
    calldataError,
    calldataRefetch,
  }
}
