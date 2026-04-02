import { LxState } from 'lx/src/state/lxReducer'

export const selectHasViewedBridgingBanner = (state: LxState): boolean =>
  state.lxBehaviorHistory.hasViewedBridgingBanner === true

export const selectHasDismissedBridgingWarning = (state: LxState): boolean =>
  state.lxBehaviorHistory.hasDismissedBridgingWarning === true

export const selectHasDismissedLowNetworkTokenWarning = (state: LxState): boolean =>
  state.lxBehaviorHistory.hasDismissedLowNetworkTokenWarning === true

export const selectHasViewedContractAddressExplainer = (state: LxState): boolean =>
  state.lxBehaviorHistory.hasViewedContractAddressExplainer === true

export const selectHasShownMismatchToast = (state: LxState): boolean =>
  state.lxBehaviorHistory.hasShownMismatchToast === true

/** Returns true if user has seen the modal globally (when disconnected) */
export const selectHasSeenToucanIntroModal = (state: LxState): boolean =>
  state.lxBehaviorHistory.hasSeenToucanIntroModal === true

/** Returns true if user has seen the modal for a specific wallet */
export const selectHasSeenToucanIntroModalForWallet = (state: LxState, walletAddress: string): boolean =>
  state.lxBehaviorHistory.toucanIntroModalSeenByWallet?.[walletAddress.toLowerCase()] === true

export const selectHasDismissedLxWrapped2025Banner = (state: LxState): boolean =>
  state.lxBehaviorHistory.hasDismissedLxWrapped2025Banner === true

export const selectHasDismissedCrosschainSwapsPromoBanner = (state: LxState): boolean =>
  state.lxBehaviorHistory.hasDismissedCrosschainSwapsPromoBanner === true

export const selectHasDismissedLuxWrapped2025Banner = selectHasDismissedLxWrapped2025Banner
