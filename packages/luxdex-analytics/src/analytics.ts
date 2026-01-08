import {
  init,
  track,
  identify,
  Identify,
  getDeviceId as amplitudeGetDeviceId,
  getUserId as amplitudeGetUserId,
  getSessionId as amplitudeGetSessionId,
} from '@amplitude/analytics-browser'

export interface AnalyticsConfig {
  /** Proxy URL for analytics endpoint */
  proxyUrl?: string
  /** Whether this is a production environment */
  isProductionEnv?: boolean
  /** Enable debug logging */
  debug?: boolean
  /** Report user's country */
  reportOriginCountry?: boolean
}

export enum OriginApplication {
  INTERFACE = 'interface',
  MOBILE = 'mobile',
  EXTENSION = 'extension',
}

export const ANONYMOUS_DEVICE_ID = '00000000-0000-0000-0000-000000000000'

let isInitialized = false
export let analyticsConfig: AnalyticsConfig | undefined

/**
 * Initializes analytics with API key.
 *
 * @param apiKey API key for analytics service
 * @param originApplication Name of the application
 * @param config Configuration options
 */
export function initializeAnalytics(
  apiKey: string,
  originApplication: OriginApplication,
  config?: AnalyticsConfig
): void {
  // Non-production environments may use hot-reloading, which will re-initialize but should be ignored.
  if (!config?.isProductionEnv && isInitialized) {
    return
  }

  if (config?.isProductionEnv) {
    if (isInitialized) {
      throw new Error('initializeAnalytics called multiple times. Ensure it is outside of a React component.')
    }
    if (config.debug) {
      throw new Error(
        `It looks like you're trying to initialize analytics in debug mode for production. Disable debug mode or use a non-production environment.`
      )
    }
  }

  isInitialized = true
  analyticsConfig = config

  init(
    apiKey,
    /* userId= */ undefined, // User ID should be undefined to let Amplitude default to Device ID
    /* options= */
    {
      // Configure the SDK to work with alternate endpoint
      serverUrl: config?.proxyUrl,
      // Disable tracking of private user information
      defaultTracking: false,
    }
  )
}

/** Sends an event to analytics. */
export function sendAnalyticsEvent(eventName: string, eventProperties?: Record<string, unknown>): void {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'unknown'

  if (analyticsConfig?.debug) {
    console.debug({
      eventName,
      eventProperties: { ...eventProperties, origin },
    })
  }

  track(eventName, { ...eventProperties, origin })
}

export function getDeviceId(): string | undefined {
  return amplitudeGetDeviceId()
}

export function getUserId(): string | undefined {
  return amplitudeGetUserId()
}

export function getSessionId(): number | undefined {
  return amplitudeGetSessionId()
}

/**
 * Class that exposes methods to mutate the User Model's properties
 * that represents the current session's user.
 */
class UserModel {
  private log(method: string, ...parameters: unknown[]): void {
    console.debug(`[analytics(Identify)]: ${method}(${parameters})`)
  }

  private call(mutate: (event: Identify) => Identify): void {
    if (!analyticsConfig?.isProductionEnv) {
      const log = (_: unknown, method: string) => this.log.bind(this, method)
      mutate(new Proxy(new Identify(), { get: log }) as Identify)
      return
    }
    identify(mutate(new Identify()))
  }

  set(key: string, value: string | number | boolean | string[]): void {
    this.call((event) => event.set(key, value))
  }

  setOnce(key: string, value: string | number | boolean | string[]): void {
    this.call((event) => event.setOnce(key, value))
  }

  add(key: string, value: number): void {
    this.call((event) => event.add(key, value))
  }

  postInsert(key: string, value: string | number): void {
    this.call((event) => event.postInsert(key, value))
  }

  remove(key: string, value: string | number): void {
    this.call((event) => event.remove(key, value))
  }
}

export const user = new UserModel()
