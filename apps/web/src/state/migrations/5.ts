import { PersistState } from 'redux-persist'
import { PreV16UserState } from '~/state/migrations/oldTypes'
import { RouterPreference } from '~/state/routing/types'

export type PersistAppStateV5 = {
  _persist: PersistState
} & { user?: PreV16UserState & { disabledLX?: boolean; optedOutOfLX?: boolean } }

/**
 * Migration to migrate users to LX by default.
 */
export const migration5 = (state: PersistAppStateV5 | undefined) => {
  if (!state) {
    return state
  }
  // Remove a previously-persisted variable
  if (state.user && 'disabledLX' in state.user) {
    delete state.user.disabledLX
  }
  const userOptedOutOfLX = state.user?.optedOutOfLX
  if (state.user && 'optedOutOfLX' in state.user) {
    delete state.user.optedOutOfLX
  }
  // If the the user has previously disabled LX *during the opt-out rollout period*, we respect that preference.
  if (state.user && !userOptedOutOfLX) {
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
