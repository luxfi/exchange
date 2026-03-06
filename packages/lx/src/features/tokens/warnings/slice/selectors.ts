import {
  SerializedTokenMap,
  TokenDismissInfo,
  TokenWarningDismissal,
} from 'lx/src/features/tokens/warnings/slice/types'
import { LuxState } from 'lx/src/state/luxReducer'

// selectors

export const dismissedWarningTokensSelector = (state: LuxState): SerializedTokenMap<TokenWarningDismissal> =>
  state.tokens.dismissedTokenWarnings

export const dismissedBridgedAssetWarningsSelector = (state: LuxState): SerializedTokenMap<TokenDismissInfo> =>
  state.tokens.dismissedBridgedAssetWarnings

export const dismissedCompatibleAddressWarningsSelector = (state: LuxState): SerializedTokenMap<TokenDismissInfo> =>
  state.tokens.dismissedCompatibleAddressWarnings
