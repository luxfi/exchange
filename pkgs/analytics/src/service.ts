/**
 * Server-side analytics service. Provider-agnostic: the production driver is
 * Hanzo Insights (`@hanzo/insights-node`). Replace the import + `new Insights`
 * call to swap in any other provider that implements the same `track` /
 * `identify` / `flush` shape.
 *
 * No third-party SDK is referenced here other than `@hanzo/insights-node`,
 * which is the canonical Hanzo native analytics layer.
 */
import { Insights } from '@hanzo/insights-node'

export interface ServerEventContext {
  userId?: string
  deviceId?: string
  provider?: string
  language?: string
  country?: string
  referrer?: string
  referringDomain?: string
}

export interface UserTraits {
  loginMethod?: string
  apiKeyCount?: number
  browser?: string
  country?: string
  referrer?: string
  referringDomain?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
}

export interface AnalyticsService<E extends string = string> {
  track(event: E, properties: Record<string, unknown>, serverContext: ServerEventContext): void
  identify(userId: string, traits: UserTraits): void
  flush(): Promise<void>
}

/**
 * Server-side analytics powered by Hanzo Insights (`@hanzo/insights-node`).
 * Singleton-instance per process — `flushIntervalMillis` matches the prior
 * legacy 10s cadence (10s) so dashboards see continuity, not a gap.
 */
export class InsightsAnalyticsService<E extends string = string> implements AnalyticsService<E> {
  private static client: Insights | null = null
  private readonly platform: string

  constructor(apiKey: string, platform: string, options?: { host?: string }) {
    this.platform = platform

    if (!InsightsAnalyticsService.client) {
      InsightsAnalyticsService.client = new Insights(apiKey, {
        host: options?.host,
        flushInterval: 10_000,
      })
    }
  }

  track(event: E, properties: Record<string, unknown>, serverContext: ServerEventContext): void {
    InsightsAnalyticsService.client?.capture({
      distinctId: serverContext.userId ?? serverContext.deviceId ?? 'anonymous',
      event,
      properties: {
        ...properties,
        ...(serverContext.deviceId ? { device_id: serverContext.deviceId } : {}),
        ...(serverContext.language ? { language: serverContext.language } : {}),
        ...(serverContext.provider ? { provider: serverContext.provider } : {}),
        platform: this.platform,
      },
    })
  }

  identify(userId: string, traits: UserTraits): void {
    const properties: Record<string, unknown> = {}
    if (traits.loginMethod) {
      properties.loginMethod = traits.loginMethod
    }
    if (traits.apiKeyCount !== undefined) {
      properties.apiKeyCount = traits.apiKeyCount
    }
    if (traits.browser) {
      properties.browser = traits.browser
    }
    if (traits.country) {
      properties.country = traits.country
    }
    if (traits.referrer) {
      properties.referrer = traits.referrer
    }
    if (traits.referringDomain) {
      properties.referringDomain = traits.referringDomain
    }
    if (traits.utmSource) {
      properties.utmSource = traits.utmSource
    }
    if (traits.utmMedium) {
      properties.utmMedium = traits.utmMedium
    }
    if (traits.utmCampaign) {
      properties.utmCampaign = traits.utmCampaign
    }
    if (traits.utmContent) {
      properties.utmContent = traits.utmContent
    }

    InsightsAnalyticsService.client?.identify({
      distinctId: userId,
      properties,
    })
  }

  async flush(): Promise<void> {
    const client = InsightsAnalyticsService.client as unknown as { flush?: () => Promise<void> }
    if (client && typeof client.flush === 'function') {
      await client.flush()
    }
  }
}

export class NoopAnalyticsService implements AnalyticsService {
  track(): void {
    // No-op
  }
  identify(): void {
    // No-op
  }
  async flush(): Promise<void> {
    // No-op
  }
}
