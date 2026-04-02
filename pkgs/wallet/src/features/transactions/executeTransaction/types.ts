import { ValidatedTransactionRequest } from '@l.x/lx/src/features/transactions/types/transactionRequests'
import { HexString } from '@luxfi/utilities/src/addresses/hex'

export interface SignedTransactionRequest {
  request: ValidatedTransactionRequest
  signedRequest: HexString
  timestampBeforeSign: number
}
