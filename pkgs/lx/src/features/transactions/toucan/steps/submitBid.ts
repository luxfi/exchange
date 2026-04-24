import { OnChainTransactionFields, TransactionStepType } from '@l.x/lx/src/features/transactions/steps/types'

export interface ToucanBidTransactionStep extends OnChainTransactionFields {
  type: TransactionStepType.ToucanBidTransactionStep
}
