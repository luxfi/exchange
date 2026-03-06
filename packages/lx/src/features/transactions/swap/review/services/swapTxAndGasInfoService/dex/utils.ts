import { TradingApi } from '@luxfi/api'
import type { ApprovalTxInfo } from 'lx/src/features/transactions/swap/review/hooks/useTokenApprovalInfo'
import type { TransactionRequestInfo } from 'lx/src/features/transactions/swap/review/services/swapTxAndGasInfoService/utils'
import {
  createApprovalFields,
  createGasFields,
} from 'lx/src/features/transactions/swap/review/services/swapTxAndGasInfoService/utils'
import type {
  DEXGasBreakdown,
  DEXSwapTxAndGasInfo,
} from 'lx/src/features/transactions/swap/types/swapTxAndGasInfo'
import { PermitMethod } from 'lx/src/features/transactions/swap/types/swapTxAndGasInfo'
import type { DEXTrade } from 'lx/src/features/transactions/swap/types/trade'
import { validatePermit } from 'lx/src/features/transactions/swap/utils/trade'

export function processDEXResponse({
  permitData,
}: {
  permitData: TradingApi.NullablePermit | undefined
}): TransactionRequestInfo {
  return {
    gasFeeResult: { value: '0', displayValue: '0', error: null, isLoading: false }, // There is no gas fee for DEX swap
    gasEstimate: {},
    txRequests: undefined,
    swapRequestArgs: undefined,
    permitData,
  }
}

function createDEXGasBreakdown({
  trade,
  approvalTxInfo,
  swapTxInfo,
}: {
  trade: DEXTrade
  approvalTxInfo: ApprovalTxInfo
  swapTxInfo: TransactionRequestInfo
}): { gasFeeBreakdown: DEXGasBreakdown } {
  const { approvalGasFeeResult } = approvalTxInfo
  const gasFeeBreakdown = {
    classicGasUseEstimateUSD: trade.quote.quote.classicGasUseEstimateUSD,
    approvalCost: approvalGasFeeResult.displayValue,
    wrapCost: swapTxInfo.gasFeeResult.displayValue,
    inputTokenSymbol: trade.inputAmount.currency.symbol,
  }

  return { gasFeeBreakdown }
}

export function getDEXSwapTxAndGasInfo({
  trade,
  swapTxInfo,
  approvalTxInfo,
}: {
  trade: DEXTrade
  swapTxInfo: TransactionRequestInfo
  approvalTxInfo: ApprovalTxInfo
}): DEXSwapTxAndGasInfo {
  const permit = validatePermit(swapTxInfo.permitData)

  return {
    routing: trade.routing,
    trade,
    ...createGasFields({ swapTxInfo, approvalTxInfo }),
    ...createApprovalFields({ approvalTxInfo }),
    ...createDEXGasBreakdown({ trade, approvalTxInfo, swapTxInfo }),
    permit: permit ? { method: PermitMethod.TypedData, typedData: permit } : undefined,
  }
}
