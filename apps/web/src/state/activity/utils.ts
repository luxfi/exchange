import { TradingApi } from '@luxfi/api'
import { TransactionType, TransactionTypeInfo } from 'lx/src/features/transactions/types/transactionDetails'

/**
 * Get the appropriate routing type for a transaction based on its type info
 * This function handles routing for various transaction types including swaps, bridges, wraps, etc.
 */
export const getRoutingForTransaction = (typeInfo: TransactionTypeInfo) => {
  return typeInfo.type === TransactionType.Bridge ? TradingApi.Routing.BRIDGE : TradingApi.Routing.CLASSIC
}
