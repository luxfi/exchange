/**
 * Server-side analytics service. Provider-agnostic: the production driver
 * is Hanzo Insights (`@hanzo/insights-node`), loaded lazily so package
 * resolution never blocks the parent build if the SDK isn't installed
 * (or has a broken transitive dep on the public registry). Until the
 * SDK loads, calls fall through to `NoopAnalyticsService` semantics.
 *
 * Replace the dynamic import + `new Insights(...)` call to swap in any
 * other provider that implements the same `track / identify / flush`
 * shape — no other consumer needs to change.
 */

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

interface InsightsClient {
  capture(params: {
    distinctId: string
    event: string
    properties?: Record<string, unknown>
    [key: string]: unknown
  }): void
  identify(params: { distinctId: string; properties?: Record<string, unknown> }): void
  flush?(): Promise<void> | void
}

/**
 * Server-side analytics powered by Hanzo Insights (`@hanzo/insights-node`).
 * Singleton-instance per process. The SDK is loaded lazily via dynamic
 * import — calls before it resolves are dropped (consistent with the
 * NoopAnalyticsService contract) rather than buffered, so memory growth
 * is bounded under boot bursts.
 */
export class InsightsAnalyticsService<E extends string = string> implements AnalyticsService<E> {
  private static client: InsightsClient | null = null
  private static loading: Promise<InsightsClient | null> | null = null
  private readonly platform: string
  private readonly apiKey: string
  private readonly host?: string

  constructor(apiKey: string, platform: string, options?: { host?: string }) {
    this.apiKey = apiKey
    this.platform = platform
    this.host = options?.host
    void this.ensureClient()
  }

  private async ensureClient(): Promise<InsightsClient | null> {
    if (InsightsAnalyticsService.client) {
      return InsightsAnalyticsService.client
    }
    if (!InsightsAnalyticsService.loading) {
      InsightsAnalyticsService.loading = (async () => {
        try {
          const pkg = '@hanzo/insights-node'
          const mod: any = await import(/* @vite-ignore */ pkg).catch(() => null)
          if (!mod) {
            return null
          }
          const Ctor = mod.Insights ?? mod.default ?? mod
          const client: InsightsClient = new Ctor(this.apiKey, {
            host: this.host,
            flushInterval: 10_000,
          })
          InsightsAnalyticsService.client = client
          return client
        } catch {
          return null
        }
      })()
    }
    return InsightsAnalyticsService.loading
  }

  track(event: E, properties: Record<string, unknown>, serverContext: ServerEventContext): void {
    const client = InsightsAnalyticsService.client
    if (!client) {
      return
    }
    client.capture({
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
    const client = InsightsAnalyticsService.client
    if (!client) {
      return
    }
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

    client.identify({ distinctId: userId, properties })
  }

  async flush(): Promise<void> {
    const client = InsightsAnalyticsService.client
    if (!client || typeof client.flush !== 'function') {
      return
    }
    await client.flush()
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
