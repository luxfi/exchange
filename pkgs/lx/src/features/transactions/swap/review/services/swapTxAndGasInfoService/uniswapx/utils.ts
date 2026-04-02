import { TradingApi } from '@l.x/api'
import type { ApprovalTxInfo } from 'lx/src/features/transactions/swap/review/hooks/useTokenApprovalInfo'
import type { TransactionRequestInfo } from 'lx/src/features/transactions/swap/review/services/swapTxAndGasInfoService/utils'
import {
  createApprovalFields,
  createGasFields,
} from 'lx/src/features/transactions/swap/review/services/swapTxAndGasInfoService/utils'
import type {
  LxSwapGasBreakdown,
  LXSwapTxAndGasInfo,
} from 'lx/src/features/transactions/swap/types/swapTxAndGasInfo'
import { PermitMethod } from 'lx/src/features/transactions/swap/types/swapTxAndGasInfo'
import type { LxSwapTrade } from 'lx/src/features/transactions/swap/types/trade'
import { validatePermit } from 'lx/src/features/transactions/swap/utils/trade'

export function processLXResponse({
  permitData,
}: {
  permitData: TradingApi.NullablePermit | undefined
}): TransactionRequestInfo {
  return {
    gasFeeResult: { value: '0', displayValue: '0', error: null, isLoading: false }, // There is no gas fee for LX swap
    gasEstimate: {},
    txRequests: undefined,
    swapRequestArgs: undefined,
    permitData,
  }
}

function createLxSwapGasBreakdown({
  trade,
  approvalTxInfo,
  swapTxInfo,
}: {
  trade: LxSwapTrade
  approvalTxInfo: ApprovalTxInfo
  swapTxInfo: TransactionRequestInfo
}): { gasFeeBreakdown: LxSwapGasBreakdown } {
  const { approvalGasFeeResult } = approvalTxInfo
  const gasFeeBreakdown = {
    classicGasUseEstimateUSD: trade.quote.quote.classicGasUseEstimateUSD,
    approvalCost: approvalGasFeeResult.displayValue,
    wrapCost: swapTxInfo.gasFeeResult.displayValue,
    inputTokenSymbol: trade.inputAmount.currency.symbol,
  }

  return { gasFeeBreakdown }
}

export function getLXSwapTxAndGasInfo({
  trade,
  swapTxInfo,
  approvalTxInfo,
}: {
  trade: LxSwapTrade
  swapTxInfo: TransactionRequestInfo
  approvalTxInfo: ApprovalTxInfo
}): LXSwapTxAndGasInfo {
  const permit = validatePermit(swapTxInfo.permitData)

  return {
    routing: trade.routing,
    trade,
    ...createGasFields({ swapTxInfo, approvalTxInfo }),
    ...createApprovalFields({ approvalTxInfo }),
    ...createLxSwapGasBreakdown({ trade, approvalTxInfo, swapTxInfo }),
    permit: permit ? { method: PermitMethod.TypedData, typedData: permit } : undefined,
  }
}
