import { UniverseChainId } from '@luxexchange/lx/src/features/chains/types'
import {
  PlanTransactionDetails,
  TransactionType,
  DEXOrderDetails,
} from '@luxexchange/lx/src/features/transactions/types/transactionDetails'
import { ConfirmedTransactionDetails, TransactionDetails } from '~/state/transactions/types'

export enum ActivityUpdateTransactionType {
  BaseTransaction = 'transaction',
  DEXOrder = TransactionType.DEXOrder,
  Plan = TransactionType.Plan,
}

interface BaseUpdate<T> {
  type: string
  chainId: UniverseChainId
  original: T
  update: Partial<T>
}

interface TransactionUpdate extends BaseUpdate<TransactionDetails> {
  type: ActivityUpdateTransactionType.BaseTransaction
  update: Required<Pick<ConfirmedTransactionDetails, 'status' | 'typeInfo'>> & Partial<ConfirmedTransactionDetails>
}

export interface DEXOrderUpdate extends Omit<BaseUpdate<DEXOrderDetails>, 'update'> {
  type: ActivityUpdateTransactionType.DEXOrder
  update: DEXOrderDetails
}

export interface ActivityPlanUpdate extends Omit<BaseUpdate<PlanTransactionDetails>, 'original'> {
  type: ActivityUpdateTransactionType.Plan
  update: PlanTransactionDetails
}

export type ActivityUpdate = TransactionUpdate | DEXOrderUpdate | ActivityPlanUpdate
export type OnActivityUpdate<T extends ActivityUpdate = ActivityUpdate> = (update: T) => void
