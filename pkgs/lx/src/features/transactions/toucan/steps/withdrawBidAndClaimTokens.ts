import { OnChainTransactionFields, TransactionStepType } from 'lx/src/features/transactions/steps/types'

export interface ToucanWithdrawBidAndClaimTokensTransactionStep extends OnChainTransactionFields {
  type: TransactionStepType.ToucanWithdrawBidAndClaimTokensTransactionStep
}
