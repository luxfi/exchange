import { NavigationContainerRefWithCurrent } from '@react-navigation/core'
import { NavigationState } from '@react-navigation/native'

/**
 * Datadog mobile RUM navigation tracking has been removed. These helpers
 * used to coordinate `DdRumReactNavigationTracking.startTrackingViews` /
 * `stopTrackingViews` across multiple nav containers (RUM does not support
 * multiple containers natively). They are now no-ops so call sites do not
 * have to change. Plug in an observability driver via
 * `setObservabilityDriver` to restore navigation tracking.
 */
export const startTracking = (
  _navRefToStartTracking: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>,
): void => {
  // No-op.
}

export const stopTracking = (_state: NavigationState | undefined): void => {
  // No-op.
}
