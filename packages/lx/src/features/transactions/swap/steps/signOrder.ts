import { TradingApi } from '@luxfi/api'
import { SignTypedDataStepFields } from 'lx/src/features/transactions/steps/permit2Signature'
import { TransactionStepType } from 'lx/src/features/transactions/steps/types'
import { ValidatedPermit } from 'lx/src/features/transactions/swap/utils/trade'

export interface UniswapXSignatureStep extends SignTypedDataStepFields {
  type: TransactionStepType.UniswapXSignature
  deadline: number
  quote: TradingApi.DutchQuoteV2 | TradingApi.DutchQuoteV3 | TradingApi.PriorityQuote
}

export function createSignUniswapXOrderStep(
  permitData: ValidatedPermit,
  quote: TradingApi.DutchQuoteV2 | TradingApi.DutchQuoteV3 | TradingApi.PriorityQuote,
): UniswapXSignatureStep {
  return { type: TransactionStepType.UniswapXSignature, deadline: quote.orderInfo.deadline, quote, ...permitData }
}

export interface UniswapXPlanSignatureStep extends SignTypedDataStepFields, TradingApi.PlanStep {
  type: TransactionStepType.UniswapXPlanSignature
  deadline: number
}

export function createUniswapXPlanSignatureStep(
  permitData: ValidatedPermit,
  step: TradingApi.PlanStep,
): UniswapXPlanSignatureStep {
  const uniswapXPlanSignatureStep: UniswapXPlanSignatureStep = {
    ...step,
    ...permitData,
    type: TransactionStepType.UniswapXPlanSignature,
    deadline: Number(permitData.values.deadline),
  }
  return uniswapXPlanSignatureStep
}
