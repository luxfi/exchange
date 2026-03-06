import { LuxState } from 'lx/src/state/luxReducer'

export const selectHasViewedBridgingBanner = (state: LuxState): boolean =>
  state.luxBehaviorHistory.hasViewedBridgingBanner === true

export const selectHasDismissedBridgingWarning = (state: LuxState): boolean =>
  state.luxBehaviorHistory.hasDismissedBridgingWarning === true

export const selectHasDismissedLowNetworkTokenWarning = (state: LuxState): boolean =>
  state.luxBehaviorHistory.hasDismissedLowNetworkTokenWarning === true

export const selectHasViewedContractAddressExplainer = (state: LuxState): boolean =>
  state.luxBehaviorHistory.hasViewedContractAddressExplainer === true

export const selectHasShownMismatchToast = (state: LuxState): boolean =>
  state.luxBehaviorHistory.hasShownMismatchToast === true

/** Returns true if user has seen the modal globally (when disconnected) */
export const selectHasSeenToucanIntroModal = (state: LuxState): boolean =>
  state.luxBehaviorHistory.hasSeenToucanIntroModal === true

/** Returns true if user has seen the modal for a specific wallet */
export const selectHasSeenToucanIntroModalForWallet = (state: LuxState, walletAddress: string): boolean =>
  state.luxBehaviorHistory.toucanIntroModalSeenByWallet?.[walletAddress.toLowerCase()] === true

export const selectHasDismissedLuxWrapped2025Banner = (state: LuxState): boolean =>
  state.luxBehaviorHistory.hasDismissedLuxWrapped2025Banner === true

export const selectHasDismissedCrosschainSwapsPromoBanner = (state: LuxState): boolean =>
  state.luxBehaviorHistory.hasDismissedCrosschainSwapsPromoBanner === true
