/**
 * First-Visit Attribution Capture
 *
 * Captures UTM params, referrer, browser, and country on the first visit.
 * Persists UTM in a cookie (first-touch attribution) and fires an Amplitude
 * `identify` call to set user properties.
 *
 * Called from the root loader — runs on every SSR page load but only
 * identifies when there's new attribution data to capture.
 */

import { getClientCountry } from './client-identity'
import type { AnalyticsService, UserTraits } from './service'
import { extractDomain, stripQueryParams } from './url-utils'

const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'] as const

export interface AttributionData {
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  referrer?: string
  referringDomain?: string
  country?: string
  browser?: string
}

/**
 * Adapter for cookie parse/serialize — lets consumers bring their own
 * cookie implementation (react-router createCookie, hono cookie, etc.).
 */
export interface CookieAdapter {
  parse(cookieHeader: string | null): Promise<Record<string, string> | null>
  serialize(value: Record<string, string>): Promise<string>
}

/**
 * Parse browser family from User-Agent string.
 * Intentionally simple — covers the major browsers.
 */
function parseBrowser(ua: string): string {
  if (ua.includes('Edg/')) {
    return 'Edge'
  }
  if (ua.includes('OPR/') || ua.includes('Opera')) {
    return 'Opera'
  }
  if (ua.includes('Chrome/') && !ua.includes('Chromium/')) {
    return 'Chrome'
  }
  if (ua.includes('Firefox/')) {
    return 'Firefox'
  }
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) {
    return 'Safari'
  }
  if (ua.includes('MSIE') || ua.includes('Trident/')) {
    return 'IE'
  }
  return 'Other'
}

interface AttributionTrackerDeps {
  analyticsService: AnalyticsService
  cookie: CookieAdapter
}

interface AttributionInput {
  request: Request
  userId: string | undefined
}

/**
 * Create an attribution tracker with the analytics service injected.
 *
 * The boundary (root loader) owns the wiring; the returned function
 * only takes per-request input. Returns a Set-Cookie header for UTM
 * persistence on first-touch, and fires an Amplitude identify call.
 */
export function createAttributionTracker({ analyticsService, cookie }: AttributionTrackerDeps) {
  return async ({ request, userId }: AttributionInput): Promise<{ setCookieHeader: string | null }> => {
    if (!userId) {
      return { setCookieHeader: null }
    }

    const url = new URL(request.url)
    const ua = request.headers.get('user-agent') ?? ''
    const referrer = request.headers.get('Referer') ?? undefined

    // Extract UTM from query params
    const utmData: Record<string, string> = {}
    for (const param of UTM_PARAMS) {
      const value = url.searchParams.get(param)
      if (value) {
        utmData[param] = value
      }
    }

    const hasUtm = Object.keys(utmData).length > 0
    const existingUtm = await cookie.parse(request.headers.get('Cookie'))
    const isFirstUtm = hasUtm && !existingUtm

    // Build traits — setOnce in the service means these won't overwrite
    const traits: UserTraits = {}
    const country = getClientCountry(request)
    const browser = parseBrowser(ua)

    if (browser !== 'Other') {
      traits.browser = browser
    }
    if (country) {
      traits.country = country
    }
    if (referrer) {
      traits.referrer = stripQueryParams(referrer)
      traits.referringDomain = extractDomain(referrer)
    }
    if (hasUtm) {
      if (utmData['utm_source']) {
        traits.utmSource = utmData['utm_source']
      }
      if (utmData['utm_medium']) {
        traits.utmMedium = utmData['utm_medium']
      }
      if (utmData['utm_campaign']) {
        traits.utmCampaign = utmData['utm_campaign']
      }
      if (utmData['utm_content']) {
        traits.utmContent = utmData['utm_content']
      }
    }

    // Only identify if we have something meaningful to set
    const hasTraits = Object.keys(traits).length > 0
    if (hasTraits) {
      analyticsService.identify(userId, traits)
    }

    return {
      setCookieHeader: isFirstUtm ? await cookie.serialize(utmData) : null,
    }
  }
}
