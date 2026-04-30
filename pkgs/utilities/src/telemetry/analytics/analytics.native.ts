// Provider-agnostic analytics backend. The native target ships the same
// driver-pluggable shim as web — no third-party analytics SDK is loaded; events flow
// through whichever AnalyticsDriver is registered (Hanzo Insights when
// the React Native SDK is wired up).
import {
  flush,
  getUserId,
  Identify,
  identify,
  init,
  setDeviceId,
  track,
} from '@l.x/utils/src/telemetry/analytics/backend'
import { ANONYMOUS_DEVICE_ID } from '@luxamm/analytics'
import {
  Analytics,
  AnalyticsInitConfig,
  TestnetModeConfig,
  UserPropertyValue,
  // biome-ignore lint/style/noRestrictedImports: needed here
} from '@l.x/utils/src/telemetry/analytics/analytics'
import {
  ANALYTICS_NATIVE_TRACKING_OPTIONS,
  ANALYTICS_SHARED_TRACKING_OPTIONS,
  ANONYMOUS_EVENT_NAMES,
  DUMMY_KEY,
} from '@l.x/utils/src/telemetry/analytics/constants'
import { generateAnalyticsLoggers } from '@l.x/utils/src/telemetry/analytics/logging'
import { getProcessedEvent } from '@l.x/utils/src/telemetry/analytics/utils'

const loggers = generateAnalyticsLoggers('telemetry/analytics.native')

let initCalled: boolean = false
let allowAnalytics: Maybe<boolean>
let testnetMode: Maybe<boolean>
let testnetModeConfig: Maybe<TestnetModeConfig>
let userId: Maybe<string>

export async function getAnalyticsAtomDirect(_forceRead?: boolean): Promise<boolean> {
  return allowAnalytics ?? true
}

export const analytics: Analytics = {
  async init({ transportProvider, allowed, userIdGetter }: AnalyticsInitConfig): Promise<void> {
    try {
      // Ensure events are filtered based on the allowAnalytics setting, but not before init is called
      allowAnalytics = allowed
      initCalled = true

      // Clear all user properties if analytics are not allowed
      if (!allowed) {
        identify(new Identify().clearAll())
      }

      init(
        DUMMY_KEY, // Reverse-proxied analytics layer derives the real key server-side
        undefined, // User ID stays undefined so the driver defaults to Device ID
        {
          transportProvider, // Custom transport for proxy header injection
          // Privacy controls — driver mirrors these to disable PII tracking
          trackingOptions: {
            ...ANALYTICS_SHARED_TRACKING_OPTIONS,
            ...ANALYTICS_NATIVE_TRACKING_OPTIONS,
          },
        },
      )

      userId = userIdGetter ? await userIdGetter() : getUserId()

      if (allowed && userId) {
        setDeviceId(userId)
      }

      if (!allowed) {
        setDeviceId(ANONYMOUS_DEVICE_ID)
      }
    } catch (error) {
      loggers.init(error)
    }
  },
  async setAllowAnalytics(allowed: boolean): Promise<void> {
    allowAnalytics = allowed
    if (allowed) {
      if (userId) {
        setDeviceId(userId)
      }
    } else {
      loggers.setAllowAnalytics(allowed)
      identify(new Identify().clearAll()) // Clear all custom user properties
      setDeviceId(ANONYMOUS_DEVICE_ID)
    }
  },
  setTestnetMode(enabled: boolean, config: TestnetModeConfig): void {
    testnetMode = enabled
    testnetModeConfig = config
  },
  sendEvent(eventName: string, eventProperties?: Record<string, unknown>): void {
    if (!allowAnalytics && initCalled && !ANONYMOUS_EVENT_NAMES.includes(eventName)) {
      return
    }

    const processedTestnetEvent = getProcessedEvent({
      eventName,
      eventProperties: eventProperties || {},
      testnetModeConfig,
      isTestnetMode: testnetMode,
    })

    if (processedTestnetEvent) {
      const { eventName: processedEventName, eventProperties: processedEventProperties } = processedTestnetEvent
      loggers.sendEvent(processedEventName, processedEventProperties)
      track(processedEventName, processedEventProperties)
    }
  },
  flushEvents(): void {
    loggers.flushEvents()
    flush()
  },
  // eslint-disable-next-line max-params
  setUserProperty(property: string, value: UserPropertyValue, insert?: boolean): void {
    if (!allowAnalytics && initCalled) {
      return
    }

    if (insert) {
      identify(new Identify().postInsert(property, value))
    } else {
      loggers.setUserProperty(property, value)
      identify(new Identify().set(property, value))
    }
  },
}
