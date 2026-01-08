import { atomWithStorage, createJSONStorage } from 'jotai/utils'

// Note:
// We should consider a generic sessionStorage abstraction if this pattern becomes common. (i.e., Future promo dismissals like the tax service discounts or Fiat Onramp launch notification may use this.)
// This would be something similar to the current feature flag implementation, but utilizing session instead
//
// Motivation:
// some dapp browsers need to be able to disable the NFT portion of the app in order to pass Apple's app store review
// this atom persists the inclusion of the `disableNFTs=boolean` query parameter via the webview's session storage
const storage = createJSONStorage(() => sessionStorage)
const persistStorage = createJSONStorage(() => localStorage)

export const hideMobileAppPromoBannerAtom = atomWithStorage('hideMobileAppPromoBanner', false, storage)
export const persistHideMobileAppPromoBannerAtom = atomWithStorage(
  'persistHideMobileAppPromoBanner',
  false,
  persistStorage,
)

// Track when the full wallet modal was last shown (timestamp)
// Used to throttle showing the full onboarding experience to once per hour
export const lastFullWalletModalShownAtom = atomWithStorage(
  'lastFullWalletModalShown',
  null as number | null,
  createJSONStorage(() => localStorage),
)

// One hour in milliseconds
const ONE_HOUR_MS = 60 * 60 * 1000

/**
 * Check if enough time has passed to show the full wallet modal again
 * Returns true if we should show the full modal, false if we should show a compact version
 */
export function shouldShowFullWalletModal(lastShown: number | null): boolean {
  if (lastShown === null) {
    return true
  }
  const timeSinceLastShown = Date.now() - lastShown
  return timeSinceLastShown >= ONE_HOUR_MS
}
