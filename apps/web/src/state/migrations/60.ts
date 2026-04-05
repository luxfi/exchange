import { PersistState } from 'redux-persist'
<<<<<<< HEAD
import { migrateDismissedTokenWarnings } from '@l.x/lx/src/state/luxMigrations'
=======
import { migrateDismissedTokenWarnings } from 'uniswap/src/state/uniswapMigrations'
>>>>>>> upstream/main

type PersistAppState = {
  _persist: PersistState
}

export const migration60 = (state: PersistAppState | undefined) => {
  if (!state) {
    return undefined
  }

  const newState = migrateDismissedTokenWarnings(state)

  return {
    ...newState,
    _persist: { ...state._persist, version: 60 },
  }
}
