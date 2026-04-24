import { combineReducers } from 'redux'
import { appearanceSettingsReducer } from '@l.x/lx/src/features/appearance/slice'
import { lxBehaviorHistoryReducer } from '@l.x/lx/src/features/behaviorHistory/slice'
import { favoritesReducer } from '@l.x/lx/src/features/favorites/slice'
import { notificationReducer } from '@l.x/lx/src/features/notifications/slice/slice'
import { portfolioReducer } from '@l.x/lx/src/features/portfolio/slice/slice'
import { searchHistoryReducer } from '@l.x/lx/src/features/search/searchHistorySlice'
import { userSettingsReducer } from '@l.x/lx/src/features/settings/slice'
import { delegationReducer } from '@l.x/lx/src/features/smartWallet/delegation/slice'
import { timingReducer } from '@l.x/lx/src/features/timing/slice'
import { tokensReducer } from '@l.x/lx/src/features/tokens/warnings/slice/slice'
import { transactionReducer } from '@l.x/lx/src/features/transactions/slice'
import { swapSettingsReducer } from '@l.x/lx/src/features/transactions/swap/state/slice'
import { visibilityReducer } from '@l.x/lx/src/features/visibility/slice'

export const lxReducers = {
  appearanceSettings: appearanceSettingsReducer,
  swapSettings: swapSettingsReducer,
  favorites: favoritesReducer,
  notifications: notificationReducer,
  portfolio: portfolioReducer,
  searchHistory: searchHistoryReducer,
  timing: timingReducer,
  tokens: tokensReducer,
  transactions: transactionReducer,
  lxBehaviorHistory: lxBehaviorHistoryReducer,
  userSettings: userSettingsReducer,
  visibility: visibilityReducer,
  delegation: delegationReducer,
} as const

// used to type RootState
export const lxReducer = combineReducers(lxReducers)

export const lxPersistedStateList: Array<keyof typeof lxReducers> = [
  'appearanceSettings',
  'favorites',
  'portfolio',
  'searchHistory',
  'tokens',
  'transactions',
  'lxBehaviorHistory',
  'userSettings',
  'visibility',
]

export type LXState = ReturnType<typeof lxReducer>
