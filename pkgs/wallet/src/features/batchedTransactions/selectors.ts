import { BatchedTransaction } from '@luxfi/wallet/src/features/batchedTransactions/slice'
import { WalletState } from '@luxfi/wallet/src/state/walletReducer'

export const selectBatchedTransactionById = (state: WalletState, batchId: string): BatchedTransaction | undefined =>
  state.batchedTransactions[batchId]
