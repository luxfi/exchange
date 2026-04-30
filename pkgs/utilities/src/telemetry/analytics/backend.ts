/**
 * Provider-agnostic analytics backend.
 *
 * Delivery is owned by an `AnalyticsDriver` registered via
 * `setAnalyticsDriver(...)`. Hanzo Insights is wired in by default at the
 * tracing entrypoint (`apps/web/src/tracing/insights.ts`); white-labels
 * can swap in any driver that implements the same surface (Sentry,
 * server-side proxy, alternative provider).
 *
 * No third-party SDK is loaded by this module. The public surface
 * (`init`/`track`/`identify`/`Identify`/`getUserId`/`setDeviceId`/`flush`)
 * matches what the rest of the codebase already imports, so the 200+
 * `sendAnalyticsEvent(...)` call sites do not change when the underlying
 * provider is swapped.
 */

export interface AnalyticsDriver {
  /** Send an event with optional properties. */
  capture(eventName: string, properties?: Record<string, unknown>): void
  /** Associate the current session with a user id and optional traits. */
  identify?(userId: string, properties?: Record<string, unknown>): void
  /** Merge user-level properties (for example from `Identify().set(...)`). */
  setUserProperties?(properties: Record<string, unknown>): void
  /** Hint the driver to flush queued events. Sync or async. */
  flush?(): void | Promise<void>
  /** Reset session — clears user id, device id, person properties. */
  reset?(): void
}

let driver: AnalyticsDriver | null = null
let userIdCache: string | undefined
let deviceIdCache: string | undefined
const userProps: Record<string, unknown> = {}

export function setAnalyticsDriver(d: AnalyticsDriver | null): void {
  driver = d
}

export function getAnalyticsDriver(): AnalyticsDriver | null {
  return driver
}

// --- Public surface used by analytics.web.ts and analytics.native.ts ----
// These exist so analytics.web.ts can `import { init, track, ... } from './backend'`
// without any other changes. The driver does the actual delivery.

export type InitOptions = {
  transportProvider?: unknown
  trackingOptions?: unknown
  [key: string]: unknown
}

export function init(_apiKey: string, initialUserId?: string, _opts?: InitOptions): void {
  if (initialUserId) {
    userIdCache = initialUserId
  }
}

export function track(eventName: string, properties?: Record<string, unknown>): void {
  driver?.capture(eventName, properties)
}

export function flush(): void {
  void driver?.flush?.()
}

export function getUserId(): string | undefined {
  return userIdCache
}

export function setUserId(id: string | undefined): void {
  userIdCache = id
  if (id) {
    driver?.identify?.(id, { ...userProps })
  }
}

export function setDeviceId(id: string): void {
  deviceIdCache = id
  driver?.setUserProperties?.({ device_id: id })
}

export function getDeviceId(): string | undefined {
  return deviceIdCache
}

export function reset(): void {
  userIdCache = undefined
  deviceIdCache = undefined
  Object.keys(userProps).forEach((k) => {
    delete userProps[k]
  })
  driver?.reset?.()
}

/**
 * Operations builder for user-property merges. Calls accumulate on the
 * instance; `identify(builder)` flushes them through the driver as user-property
 * merges. `clearAll()` empties locally and tells the driver to reset properties.
 */
export class Identify {
  private ops: Array<() => void> = []

  set(property: string, value: unknown): this {
    this.ops.push(() => {
      userProps[property] = value
    })
    return this
  }

  setOnce(property: string, value: unknown): this {
    this.ops.push(() => {
      if (!(property in userProps)) {
        userProps[property] = value
      }
    })
    return this
  }

  postInsert(property: string, value: unknown): this {
    this.ops.push(() => {
      const current = userProps[property]
      userProps[property] = Array.isArray(current) ? [...current, value] : [value]
    })
    return this
  }

  unset(property: string): this {
    this.ops.push(() => {
      delete userProps[property]
    })
    return this
  }

  clearAll(): this {
    this.ops.push(() => {
      Object.keys(userProps).forEach((k) => {
        delete userProps[k]
      })
    })
    return this
  }

  /** @internal — applied by `identify(builder)`. */
  apply(): Record<string, unknown> {
    this.ops.forEach((op) => op())
    this.ops = []
    return userProps
  }
}

export function identify(i: Identify): void {
  const merged = i.apply()
  driver?.setUserProperties?.({ ...merged })
}
