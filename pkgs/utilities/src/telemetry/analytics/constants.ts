import { SharedEventName } from '@luxamm/analytics-events'

export const DUMMY_KEY = '00000000000000000000000000000000'

export const ALLOW_ANALYTICS_ATOM_KEY = 'allow_analytics'

// Privacy controls passed to the analytics backend's `init({ trackingOptions })`.
// Names kept stable (driver-agnostic — match the canonical analytics-options shape so the
// Hanzo Insights driver can mirror them; future drivers should accept the same).
export const ANALYTICS_SHARED_TRACKING_OPTIONS = {
  country: false,
  city: false,
  dma: false, // designated market area
  ipAddress: false,
  region: false,
}

export const ANALYTICS_NATIVE_TRACKING_OPTIONS = {
  adid: false,
  carrier: false,
}

export const ANONYMOUS_EVENT_NAMES: string[] = [
  SharedEventName.ANALYTICS_SWITCH_TOGGLED.valueOf(),
  SharedEventName.HEARTBEAT.valueOf(),
  'Swap Transaction Completed', // equal to SwapEventName.SwapTransactionCompleted, but can't import in utilities
]
