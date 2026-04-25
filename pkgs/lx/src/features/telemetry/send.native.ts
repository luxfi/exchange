import appsFlyer from 'react-native-appsflyer'
import { getInsights } from '@l.x/gating'
import { AppsFlyerEventProperties, UniverseEventProperties } from '@l.x/lx/src/features/telemetry/types'
import { isBetaEnv, isDevEnv } from '@l.x/utils/src/environment/env'
import { logger } from '@l.x/utils/src/logger/logger'

export function sendAnalyticsEvent<EventName extends keyof UniverseEventProperties>(
  ...args: undefined extends UniverseEventProperties[EventName]
    ? [EventName] | [EventName, UniverseEventProperties[EventName]]
    : [EventName, UniverseEventProperties[EventName]]
): void {
  const [eventName, eventProperties] = args
  try {
    getInsights().capture(eventName as string, eventProperties as Record<string, unknown> | undefined)
  } catch {
    /* INSIGHTS_API_KEY not configured — events disabled */
  }
}

export async function sendAppsFlyerEvent<EventName extends keyof AppsFlyerEventProperties>(
  ...args: undefined extends AppsFlyerEventProperties[EventName]
    ? [EventName] | [EventName, AppsFlyerEventProperties[EventName]]
    : [EventName, AppsFlyerEventProperties[EventName]]
): Promise<void> {
  const [eventName, eventProperties] = args
  if (__DEV__ || isDevEnv() || isBetaEnv()) {
    logger.debug('telemetry/send.native.ts', 'sendAppsFlyerEvent', JSON.stringify({ eventName, eventProperties }))
  } else {
    await appsFlyer.logEvent(eventName, eventProperties ?? {})
  }
}
