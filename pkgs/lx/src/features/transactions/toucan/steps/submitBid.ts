import { OnChainTransactionFields, TransactionStepType } from 'lx/src/features/transactions/steps/types'

export interface ToucanBidTransactionStep extends OnChainTransactionFields {
  type: TransactionStepType.ToucanBidTransactionStep
}
