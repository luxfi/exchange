import { LXState } from '@l.x/lx/src/state/lxReducer'

export const selectHasViewedBridgingBanner = (state: LXState): boolean =>
  state.lxBehaviorHistory.hasViewedBridgingBanner === true

export const selectHasDismissedBridgingWarning = (state: LXState): boolean =>
  state.lxBehaviorHistory.hasDismissedBridgingWarning === true

export const selectHasDismissedLowNetworkTokenWarning = (state: LXState): boolean =>
  state.lxBehaviorHistory.hasDismissedLowNetworkTokenWarning === true

export const selectHasViewedContractAddressExplainer = (state: LXState): boolean =>
  state.lxBehaviorHistory.hasViewedContractAddressExplainer === true

export const selectHasShownMismatchToast = (state: LXState): boolean =>
  state.lxBehaviorHistory.hasShownMismatchToast === true

/** Returns true if user has seen the modal globally (when disconnected) */
export const selectHasSeenToucanIntroModal = (state: LXState): boolean =>
  state.lxBehaviorHistory.hasSeenToucanIntroModal === true

/** Returns true if user has seen the modal for a specific wallet */
export const selectHasSeenToucanIntroModalForWallet = (state: LXState, walletAddress: string): boolean =>
  state.lxBehaviorHistory.toucanIntroModalSeenByWallet?.[walletAddress.toLowerCase()] === true

export const selectHasDismissedLxWrapped2025Banner = (state: LXState): boolean =>
  state.lxBehaviorHistory.hasDismissedLxWrapped2025Banner === true

export const selectHasDismissedCrosschainSwapsPromoBanner = (state: LXState): boolean =>
  state.lxBehaviorHistory.hasDismissedCrosschainSwapsPromoBanner === true

export const selectHasDismissedLuxWrapped2025Banner = selectHasDismissedLxWrapped2025Banner
