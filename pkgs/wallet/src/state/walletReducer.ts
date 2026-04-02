import { combineReducers } from 'redux'
import { type PersistState } from 'redux-persist'
import { lxPersistedStateList, lxReducers } from 'lx/src/state/lxReducer'
import { type SagaState } from 'lx/src/utils/saga'
import { batchedTransactionsReducer } from '@luxfi/wallet/src/features/batchedTransactions/slice'
import { behaviorHistoryReducer } from '@luxfi/wallet/src/features/behaviorHistory/slice'
import { telemetryReducer } from '@luxfi/wallet/src/features/telemetry/slice'
import { walletReducer } from '@luxfi/wallet/src/features/wallet/slice'

export const walletReducers = {
  ...lxReducers,
  behaviorHistory: behaviorHistoryReducer,
  telemetry: telemetryReducer,
  wallet: walletReducer,
  batchedTransactions: batchedTransactionsReducer,
} as const

// used to type RootState
export const walletRootReducer = combineReducers(walletReducers)

export const walletPersistedStateList: Array<keyof typeof walletReducers> = [
  ...lxPersistedStateList,
  'behaviorHistory',
  'notifications',
  'telemetry',
  'wallet',
  'batchedTransactions',
]

export type WalletStateReducersOnly = ReturnType<typeof walletRootReducer>
export type WalletState = WalletStateReducersOnly & {
  saga: Record<string, SagaState>
} & { _persist?: PersistState }
