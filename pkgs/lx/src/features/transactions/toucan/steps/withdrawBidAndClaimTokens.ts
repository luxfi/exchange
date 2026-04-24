import { OnChainTransactionFields, TransactionStepType } from '@l.x/lx/src/features/transactions/steps/types'

export interface ToucanWithdrawBidAndClaimTokensTransactionStep extends OnChainTransactionFields {
  type: TransactionStepType.ToucanWithdrawBidAndClaimTokensTransactionStep
}
