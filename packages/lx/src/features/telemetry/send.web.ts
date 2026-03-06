import { AppsFlyerEventProperties, UniverseEventProperties } from 'lx/src/features/telemetry/types'
import { logger } from 'utilities/src/logger/logger'
// biome-ignore lint/style/noRestrictedImports: legacy import will be migrated
import { analytics } from 'utilities/src/telemetry/analytics/analytics'

export function sendAnalyticsEvent<EventName extends keyof UniverseEventProperties>(
  ...args: undefined extends UniverseEventProperties[EventName]
    ? [EventName] | [EventName, UniverseEventProperties[EventName]]
    : [EventName, UniverseEventProperties[EventName]]
): void {
  const [eventName, eventProperties] = args
  // Legacy Amplitude pipeline (will be removed once fully migrated)
  analytics.sendEvent(eventName, eventProperties as Record<string, unknown>)
  // Forward to Hanzo Insights (insights.hanzo.ai)
  try {
    const insights = (window as any).__INSIGHTS
    if (insights?.capture) {
      insights.capture(eventName as string, eventProperties as Record<string, unknown>)
    }
  } catch {
    // Insights client not yet initialized
  }
}

export async function sendAppsFlyerEvent<EventName extends keyof AppsFlyerEventProperties>(
  ...args: undefined extends AppsFlyerEventProperties[EventName]
    ? [EventName] | [EventName, AppsFlyerEventProperties[EventName]]
    : [EventName, AppsFlyerEventProperties[EventName]]
): Promise<void> {
  logger.warn('telemetry/index.web.ts', 'sendWalletAppsFlyerEvent', 'method not supported', args)
}
