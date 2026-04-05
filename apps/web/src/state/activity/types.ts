<<<<<<< HEAD
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import {
  PlanTransactionDetails,
  TransactionType,
  DEXOrderDetails,
} from '@l.x/lx/src/features/transactions/types/transactionDetails'
=======
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import {
  PlanTransactionDetails,
  TransactionType,
  UniswapXOrderDetails,
} from 'uniswap/src/features/transactions/types/transactionDetails'
>>>>>>> upstream/main
import { ConfirmedTransactionDetails, TransactionDetails } from '~/state/transactions/types'

export enum ActivityUpdateTransactionType {
  BaseTransaction = 'transaction',
<<<<<<< HEAD
  DEXOrder = TransactionType.DEXOrder,
=======
  UniswapXOrder = TransactionType.UniswapXOrder,
>>>>>>> upstream/main
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

<<<<<<< HEAD
export interface DEXOrderUpdate extends Omit<BaseUpdate<DEXOrderDetails>, 'update'> {
  type: ActivityUpdateTransactionType.DEXOrder
  update: DEXOrderDetails
=======
export interface UniswapXOrderUpdate extends Omit<BaseUpdate<UniswapXOrderDetails>, 'update'> {
  type: ActivityUpdateTransactionType.UniswapXOrder
  update: UniswapXOrderDetails
>>>>>>> upstream/main
}

export interface ActivityPlanUpdate extends Omit<BaseUpdate<PlanTransactionDetails>, 'original'> {
  type: ActivityUpdateTransactionType.Plan
  update: PlanTransactionDetails
}

<<<<<<< HEAD
export type ActivityUpdate = TransactionUpdate | DEXOrderUpdate | ActivityPlanUpdate
=======
export type ActivityUpdate = TransactionUpdate | UniswapXOrderUpdate | ActivityPlanUpdate
>>>>>>> upstream/main
export type OnActivityUpdate<T extends ActivityUpdate = ActivityUpdate> = (update: T) => void
