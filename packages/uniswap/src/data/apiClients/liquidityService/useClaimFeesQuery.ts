import { useQuery } from '@tanstack/react-query'
import { ClaimLPFeesRequest, ClaimLPFeesResponse } from '@uniswap/client-liquidity/dist/uniswap/liquidity/v1/api_pb'
import { ClaimFeesRequest, ClaimFeesResponse } from '@uniswap/client-liquidity/dist/uniswap/liquidity/v2/api_pb'
import { liquidityQueries } from 'uniswap/src/data/apiClients/liquidityService/liquidityQueries'

export function useClaimFeesQuery({
  claimFeesQueryParams,
  isQueryEnabled,
}: {
  claimFeesQueryParams: ClaimLPFeesRequest | ClaimFeesRequest | undefined
  isQueryEnabled: boolean
}): {
  claimFeesData: ClaimLPFeesResponse | ClaimFeesResponse | undefined
  claimFeesLoading: boolean
  claimFeesError: Error | null
  claimFeesRefetch: () => void
} {
  const isV1 = claimFeesQueryParams instanceof ClaimLPFeesRequest

  const {
    data: claimV1Data,
    isLoading: claimV1Loading,
    error: claimV1Error,
    refetch: claimV1Refetch,
  } = useQuery(
    liquidityQueries.claimLPFeesDeprecated({
      params: isV1 ? claimFeesQueryParams : undefined,
      enabled: isV1 && isQueryEnabled,
    }),
  )

  const {
    data: claimV2Data,
    isLoading: claimV2Loading,
    error: claimV2Error,
    refetch: claimV2Refetch,
  } = useQuery(
    liquidityQueries.claimFees({
      params: !isV1 ? claimFeesQueryParams : undefined,
      enabled: !isV1 && isQueryEnabled,
    }),
  )

  const claimFeesData = isV1 ? claimV1Data : claimV2Data
  const claimFeesLoading = isV1 ? claimV1Loading : claimV2Loading
  const claimFeesError = isV1 ? claimV1Error : claimV2Error
  const claimFeesRefetch = isV1 ? claimV1Refetch : claimV2Refetch

  return {
    claimFeesData,
    claimFeesLoading,
    claimFeesError,
    claimFeesRefetch,
  }
}
