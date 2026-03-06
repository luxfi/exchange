import { combineReducers } from 'redux'
import { type PersistState } from 'redux-persist'
import { luxPersistedStateList, luxReducers } from 'lx/src/state/luxReducer'
import { type SagaState } from 'lx/src/utils/saga'
import { batchedTransactionsReducer } from 'wallet/src/features/batchedTransactions/slice'
import { behaviorHistoryReducer } from 'wallet/src/features/behaviorHistory/slice'
import { telemetryReducer } from 'wallet/src/features/telemetry/slice'
import { walletReducer } from 'wallet/src/features/wallet/slice'

export const walletReducers = {
  ...luxReducers,
  behaviorHistory: behaviorHistoryReducer,
  telemetry: telemetryReducer,
  wallet: walletReducer,
  batchedTransactions: batchedTransactionsReducer,
} as const

// used to type RootState
export const walletRootReducer = combineReducers(walletReducers)

export const walletPersistedStateList: Array<keyof typeof walletReducers> = [
  ...luxPersistedStateList,
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
