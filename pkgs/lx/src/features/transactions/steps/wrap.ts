import type { Currency, CurrencyAmount } from '@luxamm/sdk-core'
import { OnChainTransactionFields, TransactionStepType } from 'lx/src/features/transactions/steps/types'
import type { ValidatedTransactionRequest } from 'lx/src/features/transactions/types/transactionRequests'

export interface WrapTransactionStep extends OnChainTransactionFields {
  type: TransactionStepType.WrapTransaction
  amount: CurrencyAmount<Currency>
}

export function createWrapTransactionStep(
  txRequest: ValidatedTransactionRequest | undefined,
  inputAmount: CurrencyAmount<Currency> | undefined,
): WrapTransactionStep | undefined {
  return txRequest && inputAmount
    ? { txRequest, type: TransactionStepType.WrapTransaction, amount: inputAmount }
    : undefined
}
