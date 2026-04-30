/**
 * Custom transport used by the analytics layer to forward events to a
 * server-side proxy with a custom `Origin` header. Provider-agnostic: no
 * third-party analytics SDK types are referenced. The active analytics
 * driver decides whether to actually use this — Hanzo Insights handles
 * its own transport, so on white-labels this class is generally unused.
 */

export interface AnalyticsPayload {
  events: unknown[]
  [key: string]: unknown
}

export interface AnalyticsResponse {
  statusCode: number
  body: Record<string, unknown>
}

export interface AnalyticsTransport {
  send(serverUrl: string, payload: AnalyticsPayload): Promise<AnalyticsResponse | null>
}

interface TransportConfig {
  serverUrl: string
  appOrigin: string
  originOverride?: string
  appBuild?: string
  reportOriginCountry?: (country: string) => void
}

export class ApplicationTransport implements AnalyticsTransport {
  private serverUrl: string
  private appOrigin: string
  private originOverride?: string
  private appBuild?: string
  private reportOriginCountry?: (country: string) => void

  private shouldReportOriginCountry = true

  constructor(config: TransportConfig) {
    this.serverUrl = config.serverUrl
    this.appOrigin = config.appOrigin
    this.originOverride = config.originOverride
    this.appBuild = config.appBuild
    this.reportOriginCountry = config.reportOriginCountry

    if (typeof fetch === 'undefined') {
      throw new Error('FetchTransport is not supported')
    }
  }

  async send(_serverUrl: string, payload: AnalyticsPayload): Promise<AnalyticsResponse | null> {
    const headers: Record<string, string> = {
      'x-origin-application': this.appOrigin,
      'Content-Type': 'application/json',
      Accept: '*/*',
    }

    if (this.originOverride) {
      headers['Origin'] = this.originOverride
    }

    if (this.appBuild) {
      headers['x-application-build'] = this.appBuild
    }

    const request: RequestInit = {
      headers,
      keepalive: true, // allow the request to outlive the page
      body: JSON.stringify(payload),
      method: 'POST',
    }

    const response = await fetch(this.serverUrl, request)
    const responseJSON = (await response.json()) as Record<string, unknown>

    if (response.headers.has('Origin-Country') && this.shouldReportOriginCountry) {
      this.reportOriginCountry?.(response.headers.get('Origin-Country') as string)
      this.shouldReportOriginCountry = false
    }

    return { statusCode: response.status, body: responseJSON }
  }
}
