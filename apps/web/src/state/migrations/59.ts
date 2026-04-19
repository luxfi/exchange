import { PersistState } from 'redux-persist'
import { VisibilityState } from '@l.x/lx/src/features/visibility/slice'
import { addActivityVisibility } from '@l.x/lx/src/state/luxMigrations'

type PersistAppState = {
  _persist: PersistState
  visibility?: Omit<VisibilityState, 'activity'>
}
export const migration59 = (state: PersistAppState | undefined) => {
  if (!state) {
    return undefined
  }

  const newState = addActivityVisibility(state)

  return {
    ...newState,
    _persist: { ...state._persist, version: 59 },
  }
}
