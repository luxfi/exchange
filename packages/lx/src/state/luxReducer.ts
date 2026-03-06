import { combineReducers } from 'redux'
import { appearanceSettingsReducer } from 'lx/src/features/appearance/slice'
import { luxBehaviorHistoryReducer } from 'lx/src/features/behaviorHistory/slice'
import { favoritesReducer } from 'lx/src/features/favorites/slice'
import { fiatOnRampAggregatorApi } from 'lx/src/features/fiatOnRamp/api'
import { notificationReducer } from 'lx/src/features/notifications/slice/slice'
import { portfolioReducer } from 'lx/src/features/portfolio/slice/slice'
import { searchHistoryReducer } from 'lx/src/features/search/searchHistorySlice'
import { userSettingsReducer } from 'lx/src/features/settings/slice'
import { delegationReducer } from 'lx/src/features/smartWallet/delegation/slice'
import { timingReducer } from 'lx/src/features/timing/slice'
import { tokensReducer } from 'lx/src/features/tokens/warnings/slice/slice'
import { transactionReducer } from 'lx/src/features/transactions/slice'
import { swapSettingsReducer } from 'lx/src/features/transactions/swap/state/slice'
import { visibilityReducer } from 'lx/src/features/visibility/slice'

export const luxReducers = {
  [fiatOnRampAggregatorApi.reducerPath]: fiatOnRampAggregatorApi.reducer,
  appearanceSettings: appearanceSettingsReducer,
  swapSettings: swapSettingsReducer,
  favorites: favoritesReducer,
  notifications: notificationReducer,
  portfolio: portfolioReducer,
  searchHistory: searchHistoryReducer,
  timing: timingReducer,
  tokens: tokensReducer,
  transactions: transactionReducer,
  luxBehaviorHistory: luxBehaviorHistoryReducer,
  userSettings: userSettingsReducer,
  visibility: visibilityReducer,
  delegation: delegationReducer,
} as const

// used to type RootState
export const luxReducer = combineReducers(luxReducers)

export const luxPersistedStateList: Array<keyof typeof luxReducers> = [
  'favorites',
  'portfolio',
  'searchHistory',
  'tokens',
  'transactions',
  'luxBehaviorHistory',
  'userSettings',
  'visibility',
]

export type LuxState = ReturnType<typeof luxReducer>
