# Analytics Providers

The analytics layer is **provider-pluggable**. The 200+ `sendAnalyticsEvent(...)`
call sites flow through a single `AnalyticsDriver` interface — swap drivers to
retarget every event without touching application code.

## Default driver

Hanzo Insights, registered by `apps/web/src/tracing/insights.ts` after the
`@hanzo/insights` SDK loads. Maps:

| AnalyticsDriver method | Insights call            |
| ---------------------- | ------------------------ |
| `capture`              | `insights.capture`       |
| `identify`             | `insights.identify`      |
| `setUserProperties`    | `insights.setPersonProperties` (fallback: `register`) |
| `flush`                | `insights.flush`         |
| `reset`                | `insights.reset`         |

If `REACT_APP_INSIGHTS_HOST` / `REACT_APP_INSIGHTS_API_KEY` are unset (or the
package is not installed), no driver is registered and every `track()` becomes
a no-op.

## Plugging in a different backend

Implement `AnalyticsDriver` (`./backend.ts`) and register before the first
event fires:

```ts
import { setAnalyticsDriver, type AnalyticsDriver } from '@l.x/utils/src/telemetry/analytics/backend'

const sentryDriver: AnalyticsDriver = {
  capture(event, properties) {
    Sentry.addBreadcrumb({ category: 'analytics', message: event, data: properties })
  },
  identify(userId, properties) {
    Sentry.setUser({ id: userId, ...properties })
  },
  setUserProperties(properties) {
    Sentry.setUser({ ...Sentry.getCurrentScope().getUser(), ...properties })
  },
  reset() {
    Sentry.setUser(null)
  },
}

setAnalyticsDriver(sentryDriver)
```

For multi-driver fan-out (e.g. Hanzo Insights for events + Sentry for errors),
build a composite:

```ts
function composeDrivers(...drivers: AnalyticsDriver[]): AnalyticsDriver {
  return {
    capture: (e, p) => drivers.forEach((d) => d.capture(e, p)),
    identify: (u, p) => drivers.forEach((d) => d.identify?.(u, p)),
    setUserProperties: (p) => drivers.forEach((d) => d.setUserProperties?.(p)),
    flush: async () => { for (const d of drivers) { await d.flush?.() } },
    reset: () => drivers.forEach((d) => d.reset?.()),
  }
}

setAnalyticsDriver(composeDrivers(insightsDriver, sentryDriver))
```

## Available driver implementations

| Driver           | Module                                | Notes                               |
| ---------------- | ------------------------------------- | ----------------------------------- |
| Hanzo Insights   | `apps/web/src/tracing/insights.ts`    | Default. Browser + features (autocapture, replay, flags). |
| Hanzo Insights server | `pkgs/analytics/src/service.ts`  | `InsightsAnalyticsService` for Node.js (Workers, BFF). Lazy `@hanzo/insights-node`. |
| Noop             | `pkgs/analytics/src/service.ts`       | `NoopAnalyticsService`. Safe default for unconfigured environments. |

## Server-side

`pkgs/analytics/src/service.ts` exposes `InsightsAnalyticsService` and
`NoopAnalyticsService`. Both implement `AnalyticsService<E>` (the typed,
event-name-bounded server contract). The Insights service lazy-loads
`@hanzo/insights-node` via dynamic import — calls before the SDK resolves
drop silently (consistent with Noop semantics) instead of buffering.

## What is NOT in this layer

- **No third-party event-analytics SDK** is imported from the bundle. Browser
  delivery only goes through whichever driver is registered.
- **No proxy URL is hardcoded** — `lxUrls.analyticsProxyUrl` is opt-in via
  `ANALYTICS_PROXY_URL_OVERRIDE`, and the default driver (Hanzo Insights)
  doesn't use it (Insights talks to its own host directly).
- **No identifier in any source file mentions a specific provider name**
  except in driver implementations and this document. Renaming the default
  driver to a different provider only requires changing one file.
