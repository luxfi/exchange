import { Currency } from '@luxamm/sdk-core'
import { GraphQLApi } from '@l.x/api'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import {
  TransactionOptions,
  TransactionStatus,
  DEXOrderDetails,
} from '@l.x/lx/src/features/transactions/types/transactionDetails'

/**
 * TODO: refactor parsing / Activity so that all Activity Types can have a detail sheet.
 */

export type Activity = {
  id: string
  hash?: string
  chainId: UniverseChainId
  outputChainId?: UniverseChainId
  status: TransactionStatus
  offchainOrderDetails?: DEXOrderDetails
  statusMessage?: string
  timestamp: number
  title: string
  descriptor?: string | JSX.Element
  logos?: Array<string | undefined>
  // TODO(WEB-3839): replace Currency with CurrencyInfo
  currencies?: Array<Currency | undefined>
  otherAccount?: string
  from: string
  options?: TransactionOptions
  prefixIconSrc?: string
  suffixIconSrc?: string
  isSpam?: boolean
  type?: GraphQLApi.TransactionType
}

export type ActivityMap = { [id: string]: Activity | undefined }
