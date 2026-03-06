import { TradingApi } from '@luxfi/api'
import { SignTypedDataStepFields } from 'lx/src/features/transactions/steps/permit2Signature'
import { TransactionStepType } from 'lx/src/features/transactions/steps/types'
import { ValidatedPermit } from 'lx/src/features/transactions/swap/utils/trade'

export interface DEXSignatureStep extends SignTypedDataStepFields {
  type: TransactionStepType.DEXSignature
  deadline: number
  quote: TradingApi.DutchQuoteV2 | TradingApi.DutchQuoteV3 | TradingApi.PriorityQuote
}

export function createSignDEXOrderStep(
  permitData: ValidatedPermit,
  quote: TradingApi.DutchQuoteV2 | TradingApi.DutchQuoteV3 | TradingApi.PriorityQuote,
): DEXSignatureStep {
  return { type: TransactionStepType.DEXSignature, deadline: quote.orderInfo.deadline, quote, ...permitData }
}

export interface DEXPlanSignatureStep extends SignTypedDataStepFields, TradingApi.PlanStep {
  type: TransactionStepType.DEXPlanSignature
  deadline: number
}

export function createDEXPlanSignatureStep(
  permitData: ValidatedPermit,
  step: TradingApi.PlanStep,
): DEXPlanSignatureStep {
  const dexPlanSignatureStep: DEXPlanSignatureStep = {
    ...step,
    ...permitData,
    type: TransactionStepType.DEXPlanSignature,
    deadline: Number(permitData.values['deadline']),
  }
  return dexPlanSignatureStep
}
