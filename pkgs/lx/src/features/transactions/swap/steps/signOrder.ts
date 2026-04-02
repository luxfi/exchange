import { TradingApi } from '@luxexchange/api'
import { SignTypedDataStepFields } from 'lx/src/features/transactions/steps/permit2Signature'
import { TransactionStepType } from 'lx/src/features/transactions/steps/types'
import { ValidatedPermit } from 'lx/src/features/transactions/swap/utils/trade'

export interface LXSignatureStep extends SignTypedDataStepFields {
  type: TransactionStepType.LXSignature
  deadline: number
  quote: TradingApi.DutchQuoteV2 | TradingApi.DutchQuoteV3 | TradingApi.PriorityQuote
}

export function createSignLxSwapOrderStep(
  permitData: ValidatedPermit,
  quote: TradingApi.DutchQuoteV2 | TradingApi.DutchQuoteV3 | TradingApi.PriorityQuote,
): LXSignatureStep {
  return { type: TransactionStepType.LXSignature, deadline: quote.orderInfo.deadline, quote, ...permitData }
}

export interface LxSwapPlanSignatureStep extends SignTypedDataStepFields, TradingApi.PlanStep {
  type: TransactionStepType.LxSwapPlanSignature
  deadline: number
}

export function createLxSwapPlanSignatureStep(
  permitData: ValidatedPermit,
  step: TradingApi.PlanStep,
): LxSwapPlanSignatureStep {
  const lxSwapPlanSignatureStep: LxSwapPlanSignatureStep = {
    ...step,
    ...permitData,
    type: TransactionStepType.LxSwapPlanSignature,
    deadline: Number(permitData.values['deadline']),
  }
  return lxSwapPlanSignatureStep
}
