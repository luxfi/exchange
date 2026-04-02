import { ValidatedTransactionRequest } from '@l.x/lx/src/features/transactions/types/transactionRequests'
import { HexString } from '@l.x/utils/src/addresses/hex'

export interface SignedTransactionRequest {
  request: ValidatedTransactionRequest
  signedRequest: HexString
  timestampBeforeSign: number
}
