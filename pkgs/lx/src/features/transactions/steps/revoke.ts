import { RevokeApproveFields, TransactionStepType } from '@l.x/lx/src/features/transactions/steps/types'
import { ValidatedTransactionRequest } from '@l.x/lx/src/features/transactions/types/transactionRequests'
import { parseERC20ApproveCalldata } from '@l.x/lx/src/utils/approvals'

export interface TokenRevocationTransactionStep extends RevokeApproveFields {
  type: TransactionStepType.TokenRevocationTransaction
}

export function createRevocationTransactionStep({
  txRequest,
  tokenAddress,
  chainId,
}: {
  txRequest: ValidatedTransactionRequest | undefined
  tokenAddress: TokenRevocationTransactionStep['tokenAddress']
  chainId: TokenRevocationTransactionStep['chainId']
}): TokenRevocationTransactionStep | undefined {
  if (!txRequest?.data || !tokenAddress) {
    return undefined
  }

  const type = TransactionStepType.TokenRevocationTransaction
  const { spender, amount } = parseERC20ApproveCalldata(txRequest.data.toString())

  if (amount !== BigInt(0)) {
    return undefined
  }

  return { type, txRequest, tokenAddress, spender, amount: '0', chainId }
}
