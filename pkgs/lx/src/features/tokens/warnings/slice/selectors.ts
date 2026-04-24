import {
  SerializedTokenMap,
  TokenDismissInfo,
  TokenWarningDismissal,
} from '@l.x/lx/src/features/tokens/warnings/slice/types'
import { LXState } from '@l.x/lx/src/state/lxReducer'

// selectors

export const dismissedWarningTokensSelector = (state: LXState): SerializedTokenMap<TokenWarningDismissal> =>
  state.tokens.dismissedTokenWarnings

export const dismissedBridgedAssetWarningsSelector = (state: LXState): SerializedTokenMap<TokenDismissInfo> =>
  state.tokens.dismissedBridgedAssetWarnings

export const dismissedCompatibleAddressWarningsSelector = (state: LXState): SerializedTokenMap<TokenDismissInfo> =>
  state.tokens.dismissedCompatibleAddressWarnings
