import { TradingApi } from '@l.x/api'
import { DynamicConfigs, SwapConfigKey, useDynamicConfigValue } from '@l.x/gating'
import { useEffect, useMemo, useRef } from 'react'
import { useLuxContextSelector } from '@l.x/lx/src/contexts/LuxContext'
import { useTradingApiSwapQuery } from '@l.x/lx/src/data/apiClients/tradingApi/useTradingApiSwapQuery'
import { useActiveGasStrategy } from '@l.x/lx/src/features/gas/hooks'
import { useAllTransactionSettings } from '@l.x/lx/src/features/transactions/components/settings/stores/transactionSettingsStore/useTransactionSettingsStore'
import { FALLBACK_SWAP_REQUEST_POLL_INTERVAL_MS } from '@l.x/lx/src/features/transactions/swap/review/services/swapTxAndGasInfoService/constants'
import { processLXResponse } from '@l.x/lx/src/features/transactions/swap/review/services/swapTxAndGasInfoService/lx/utils'
import type { TransactionRequestInfo } from '@l.x/lx/src/features/transactions/swap/review/services/swapTxAndGasInfoService/utils'
import {
  createLogSwapRequestErrors,
  createPrepareSwapRequestParams,
  createProcessSwapResponse,
  getShouldSkipSwapRequest,
} from '@l.x/lx/src/features/transactions/swap/review/services/swapTxAndGasInfoService/utils'
import { usePermit2SignatureWithData } from '@l.x/lx/src/features/transactions/swap/stores/swapTxStore/hooks/usePermit2Signature'
import type { DerivedSwapInfo } from '@l.x/lx/src/features/transactions/swap/types/derivedSwapInfo'
import type { TokenApprovalInfo } from '@l.x/lx/src/features/transactions/swap/types/trade'
import { ApprovalAction } from '@l.x/lx/src/features/transactions/swap/types/trade'
import { isBridge, isClassic, isLX, isWrap } from '@l.x/lx/src/features/transactions/swap/utils/routing'
import { isWebApp } from '@l.x/utils/src/platform'
import { useTrace } from '@l.x/utils/src/telemetry/trace/TraceContext'
import { ONE_SECOND_MS } from '@l.x/utils/src/time/time'

function useSwapTransactionRequestInfo({
  derivedSwapInfo,
  tokenApprovalInfo,
}: {
  derivedSwapInfo: DerivedSwapInfo
  tokenApprovalInfo: TokenApprovalInfo | undefined
}): TransactionRequestInfo {
  const trace = useTrace()
  const gasStrategy = useActiveGasStrategy(derivedSwapInfo.chainId, 'general')
  const transactionSettings = useAllTransactionSettings()

  const permitData = derivedSwapInfo.trade.trade?.quote.permitData
  // On interface, we do not fetch signature until after swap is clicked, as it requires user interaction.
  const { data: signature } = usePermit2SignatureWithData({ permitData, skip: isWebApp })

  const swapQuoteResponse = useMemo(() => {
    const quote = derivedSwapInfo.trade.trade?.quote
    if (quote && (isClassic(quote) || isBridge(quote) || isWrap(quote))) {
      return quote
    }
    return undefined
  }, [derivedSwapInfo.trade.trade?.quote])

  const swapQuote = swapQuoteResponse?.quote

  const swapDelegationInfo = useLuxContextSelector((ctx) => ctx.getSwapDelegationInfo?.(derivedSwapInfo.chainId))
  const overrideSimulation = !!swapDelegationInfo?.delegationAddress

  const prepareSwapRequestParams = useMemo(() => createPrepareSwapRequestParams({ gasStrategy }), [gasStrategy])

  const swapRequestParams = useMemo(() => {
    if (!swapQuoteResponse) {
      return undefined
    }

    const alreadyApproved = tokenApprovalInfo?.action === ApprovalAction.None && !swapQuoteResponse.permitTransaction

    return prepareSwapRequestParams({
      swapQuoteResponse,
      signature: signature ?? undefined,
      transactionSettings,
      alreadyApproved,
      overrideSimulation,
    })
  }, [
    swapQuoteResponse,
    tokenApprovalInfo?.action,
    prepareSwapRequestParams,
    signature,
    transactionSettings,
    overrideSimulation,
  ])

  const canBatchTransactions = useLuxContextSelector((ctx) =>
    ctx.getCanBatchTransactions?.(derivedSwapInfo.chainId),
  )

  const permitsDontNeedSignature = !!canBatchTransactions
  const shouldSkipSwapRequest = getShouldSkipSwapRequest({
    derivedSwapInfo,
    tokenApprovalInfo,
    signature: signature ?? undefined,
    permitsDontNeedSignature,
  })

  const tradingApiSwapRequestMs = useDynamicConfigValue({
    config: DynamicConfigs.Swap,
    key: SwapConfigKey.TradingApiSwapRequestMs,
    defaultValue: FALLBACK_SWAP_REQUEST_POLL_INTERVAL_MS,
  })

  const {
    data,
    error,
    isLoading: isSwapLoading,
  } = useTradingApiSwapQuery(
    {
      params: shouldSkipSwapRequest ? undefined : swapRequestParams,
      refetchInterval: tradingApiSwapRequestMs,
      staleTime: tradingApiSwapRequestMs,
      // We add a small buffer in case connection is too slow
      immediateGcTime: tradingApiSwapRequestMs + ONE_SECOND_MS * 5,
    },
    {
      canBatchTransactions,
      swapDelegationAddress: swapDelegationInfo?.delegationAddress,
      includesDelegation: swapDelegationInfo?.delegationInclusion,
    },
  )

  const processSwapResponse = useMemo(() => createProcessSwapResponse({ gasStrategy }), [gasStrategy])

  const result = useMemo(
    () =>
      processSwapResponse({
        response: data,
        error,
        swapQuote,
        isSwapLoading,
        permitData,
        swapRequestParams,
        isRevokeNeeded: tokenApprovalInfo?.action === ApprovalAction.RevokeAndPermit2Approve,
        permitsDontNeedSignature,
      }),
    [
      data,
      error,
      isSwapLoading,
      permitData,
      swapQuote,
      swapRequestParams,
      processSwapResponse,
      tokenApprovalInfo?.action,
      permitsDontNeedSignature,
    ],
  )

  // Only log analytics events once per request
  const previousRequestIdRef = useRef(swapQuoteResponse?.requestId)
  const logSwapRequestErrors = useMemo(() => createLogSwapRequestErrors({ trace }), [trace])

  useEffect(() => {
    logSwapRequestErrors({
      txRequest: result.txRequests?.[0],
      gasFeeResult: result.gasFeeResult,
      derivedSwapInfo,
      transactionSettings,
      previousRequestId: previousRequestIdRef.current,
    })

    if (swapQuoteResponse) {
      previousRequestIdRef.current = swapQuoteResponse.requestId
    }
  }, [logSwapRequestErrors, result, derivedSwapInfo, transactionSettings, swapQuoteResponse])

  return result
}

function useLXTransactionRequestInfo(permitData: TradingApi.NullablePermit | undefined): TransactionRequestInfo {
  return useMemo(
    () =>
      processLXResponse({
        permitData,
      }),
    [permitData],
  )
}

export function useTransactionRequestInfo({
  derivedSwapInfo,
  tokenApprovalInfo,
}: {
  derivedSwapInfo: DerivedSwapInfo
  tokenApprovalInfo: TokenApprovalInfo | undefined
}): TransactionRequestInfo {
  const lxOrderTransactionRequestInfo = useLXTransactionRequestInfo(
    derivedSwapInfo.trade.trade?.quote.permitData,
  )
  const swapTransactionRequestInfo = useSwapTransactionRequestInfo({ derivedSwapInfo, tokenApprovalInfo })

  if (derivedSwapInfo.trade.trade && isLX(derivedSwapInfo.trade.trade)) {
    return lxOrderTransactionRequestInfo
  }

  return swapTransactionRequestInfo
}
