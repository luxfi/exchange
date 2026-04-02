import { PersistState } from 'redux-persist'
import { PreV16UserState } from '~/state/migrations/oldTypes'
import { RouterPreference } from '~/state/routing/types'

export type PersistAppStateV5 = {
  _persist: PersistState
} & { user?: PreV16UserState & { disabledDEX?: boolean; optedOutOfDEX?: boolean } }

/**
 * Migration to migrate users to DEX by default.
 */
export const migration5 = (state: PersistAppStateV5 | undefined) => {
  if (!state) {
    return state
  }
  // Remove a previously-persisted variable
  if (state.user && 'disabledDEX' in state.user) {
    delete state.user.disabledDEX
  }
  const userOptedOutOfDEX = state.user?.optedOutOfDEX
  if (state.user && 'optedOutOfDEX' in state.user) {
    delete state.user.optedOutOfDEX
  }
  // If the the user has previously disabled DEX *during the opt-out rollout period*, we respect that preference.
  if (state.user && !userOptedOutOfDEX) {
    return {
      ...state,
      user: {
        ...state.user,
        userRouterPreference: RouterPreference.X,
      },
      _persist: {
        ...state._persist,
        version: 5,
      },
    }
  }
  return {
    ...state,
    _persist: {
      ...state._persist,
      version: 5,
    },
  }
}
