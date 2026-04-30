import { PlatformSplitStubError } from '@l.x/utils/src/errors'
import { ApplicationTransport } from '@l.x/utils/src/telemetry/analytics/ApplicationTransport'

// matches the canonical analytics value shape, kept independent of any specific provider
export type UserPropertyValue = number | string | boolean | Array<string | number>

export interface TestnetModeConfig {
  aggregateEventName: string
  passthroughAllowlistEvents: string[]
  allowlistEvents: string[]
}

export async function getAnalyticsAtomDirect(_forceRead?: boolean): Promise<boolean> {
  throw new PlatformSplitStubError('getAnalyticsAtomDirect')
}

export type AnalyticsInitConfig = {
  transportProvider: ApplicationTransport
  allowed: boolean
  initHash?: string
  userIdGetter?: () => Promise<string>
}

export interface Analytics {
  init(config: AnalyticsInitConfig): Promise<void>
  setAllowAnalytics(allowed: boolean): Promise<void>
  setTestnetMode(enabled: boolean, _config: TestnetModeConfig): void
  sendEvent(eventName: string, eventProperties: Record<string, unknown>): void
  flushEvents(): void
  setUserProperty(property: string, value: UserPropertyValue, insert?: boolean): void
}

export const analytics: Analytics = {
  init(_config: AnalyticsInitConfig): Promise<void> {
    throw new PlatformSplitStubError('initAnalytics')
  },
  setAllowAnalytics(_allowed: boolean): Promise<void> {
    throw new PlatformSplitStubError('flushAnalyticsEvents')
  },
  setTestnetMode(_enabled: boolean, _config: TestnetModeConfig): void {
    throw new PlatformSplitStubError('setTestnetMode')
  },
  sendEvent(_eventName: string, ..._eventProperties: unknown[]): void {
    throw new PlatformSplitStubError('sendAnalyticsEvent')
  },
  flushEvents(): void {
    throw new PlatformSplitStubError('flushAnalyticsEvents')
  },
  // eslint-disable-next-line max-params
  setUserProperty(_property: string, _value: UserPropertyValue, _insert?: boolean): void {
    throw new PlatformSplitStubError('setUserProperty')
  },
}
