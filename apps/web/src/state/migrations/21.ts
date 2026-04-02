import { PersistState } from 'redux-persist'
import { SerializedTokenMap, TokenDismissInfo } from '@luxexchange/lx/src/features/tokens/warnings/slice/types'
import { unchecksumDismissedTokenWarningKeys } from '@luxexchange/lx/src/state/luxMigrations'

export type PersistAppStateV21 = {
  _persist: PersistState
  tokens?: {
    dismissedTokenWarnings: SerializedTokenMap<TokenDismissInfo>
  }
}

export const migration21 = (state: PersistAppStateV21 | undefined) => {
  if (!state) {
    return undefined
  }
  return {
    ...unchecksumDismissedTokenWarningKeys(state),
    _persist: { ...state._persist, version: 21 },
  }
}
