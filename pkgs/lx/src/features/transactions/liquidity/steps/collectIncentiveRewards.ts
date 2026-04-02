import { OnChainTransactionFields, TransactionStepType } from 'lx/src/features/transactions/steps/types'

export interface CollectLpIncentiveRewardsTransactionStep extends OnChainTransactionFields {
  type: TransactionStepType.CollectLpIncentiveRewardsTransactionStep
}
