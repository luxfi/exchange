import { PersistState } from 'redux-persist'
import { TokensState } from '@luxexchange/lx/src/features/tokens/warnings/slice/slice'
import { removeThaiBahtFromFiatCurrency } from '@luxexchange/lx/src/state/luxMigrations'

type PersistAppStateV25 = {
  _persist: PersistState
  tokens?: TokensState
}

export const migration25 = (state: PersistAppStateV25 | undefined) => {
  if (!state) {
    return undefined
  }
  return {
    ...removeThaiBahtFromFiatCurrency(state),
    _persist: { ...state._persist, version: 25 },
  }
}
