import { useQuery } from '@tanstack/react-query'
import { CheckApprovalLPRequest } from '@uniswap/client-liquidity/dist/uniswap/liquidity/v1/api_pb'
import { type LPApprovalRequest } from '@uniswap/client-liquidity/dist/uniswap/liquidity/v2/api_pb'
import { liquidityQueries } from 'uniswap/src/data/apiClients/liquidityService/liquidityQueries'
import {
  type NormalizedApprovalData,
  normalizeApprovalResponse,
  type TokenAddresses,
} from 'uniswap/src/data/apiClients/liquidityService/normalizeApprovalResponse'
import { ONE_SECOND_MS } from 'utilities/src/time/time'

export function useCheckLPApprovalQuery({
  approvalQueryParams,
  isQueryEnabled,
  positionTokenAddress,
}: {
  approvalQueryParams: CheckApprovalLPRequest | LPApprovalRequest | undefined
  isQueryEnabled: boolean
  positionTokenAddress?: string
}): {
  approvalData: NormalizedApprovalData | undefined
  approvalLoading: boolean
  approvalError: Error | null
  approvalRefetch: () => void
} {
  const isV1 = approvalQueryParams instanceof CheckApprovalLPRequest

  const {
    data: approvalV1Data,
    isLoading: approvalV1Loading,
    error: approvalV1Error,
    refetch: approvalV1Refetch,
  } = useQuery(
    liquidityQueries.checkApprovalDeprecated({
      params: isV1 ? approvalQueryParams : undefined,
      staleTime: 5 * ONE_SECOND_MS,
      enabled: isV1 && isQueryEnabled,
      retry: false,
    }),
  )

  const {
    data: approvalV2Data,
    isLoading: approvalV2Loading,
    error: approvalV2Error,
    refetch: approvalV2Refetch,
  } = useQuery(
    liquidityQueries.checkApproval({
      params: !isV1 ? approvalQueryParams : undefined,
      staleTime: 5 * ONE_SECOND_MS,
      enabled: !isV1 && isQueryEnabled,
      retry: false,
    }),
  )

  const rawData = isV1 ? approvalV1Data : approvalV2Data
  const approvalLoading = isV1 ? approvalV1Loading : approvalV2Loading
  const approvalError = isV1 ? approvalV1Error : approvalV2Error
  const approvalRefetch = isV1 ? approvalV1Refetch : approvalV2Refetch

  const tokenAddresses: TokenAddresses | undefined = !isV1
    ? {
        token0Address: approvalQueryParams?.lpTokens[0]?.tokenAddress,
        token1Address: approvalQueryParams?.lpTokens[1]?.tokenAddress,
        positionTokenAddress,
      }
    : undefined

  return {
    approvalData: normalizeApprovalResponse(rawData, tokenAddresses),
    approvalLoading,
    approvalError,
    approvalRefetch,
  }
}
