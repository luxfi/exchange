import { TradingApi } from '@l.x/api'
import {
  OnChainTransactionDetails,
  TransactionStatus,
} from '@l.x/lx/src/features/transactions/types/transactionDetails'
import { isBridgeTypeInfo } from '@l.x/lx/src/features/transactions/types/utils'
import { createTransactionId } from '@l.x/lx/src/utils/createTransactionId'
import { SubmitTransactionParamsWithTypeInfo } from '@luxfi/wallet/src/features/transactions/executeTransaction/services/TransactionService/transactionService'

export function createUnsubmittedTransactionDetails(
  executeTransactionParams: SubmitTransactionParamsWithTypeInfo,
): OnChainTransactionDetails {
  const { txId, chainId, typeInfo, account, options, transactionOriginType } = executeTransactionParams
  const id = txId ?? createTransactionId()

  const transaction: OnChainTransactionDetails = {
    routing: isBridgeTypeInfo(typeInfo) ? TradingApi.Routing.BRIDGE : TradingApi.Routing.CLASSIC,
    id,
    chainId,
    typeInfo,
    from: account.address,
    addedTime: Date.now(),
    status: TransactionStatus.Pending,
    options,
    transactionOriginType,
  }
  return transaction
}
