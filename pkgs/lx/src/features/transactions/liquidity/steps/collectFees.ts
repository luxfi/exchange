import { OnChainTransactionFields, TransactionStepType } from '@l.x/lx/src/features/transactions/steps/types'
import { ValidatedTransactionRequest } from '@l.x/lx/src/features/transactions/types/transactionRequests'

export interface CollectFeesTransactionStep extends OnChainTransactionFields {
  type: TransactionStepType.CollectFeesTransactionStep
}

export function createCollectFeesStep(txRequest: ValidatedTransactionRequest): CollectFeesTransactionStep {
  return {
    type: TransactionStepType.CollectFeesTransactionStep,
    txRequest,
  }
}
