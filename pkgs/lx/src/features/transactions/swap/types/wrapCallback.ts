import { Currency, CurrencyAmount } from '@luxamm/sdk-core'
import { GasEstimate } from '@l.x/api'
import { ValidatedTransactionRequest } from 'lx/src/features/transactions/types/transactionRequests'
import { WrapType } from 'lx/src/features/transactions/types/wrap'

export type WrapCallbackParams = {
  address: string
  inputCurrencyAmount: CurrencyAmount<Currency>
  wrapType: WrapType.Wrap | WrapType.Unwrap
  onSuccess: () => void
  onFailure: () => void
  txRequest: ValidatedTransactionRequest
  txId?: string
  gasEstimate?: GasEstimate
}

export type WrapCallback = (params: WrapCallbackParams) => void
