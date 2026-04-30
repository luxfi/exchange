/**
 * Datadog SDK has been removed. This file used to bootstrap browser-rum
 * + browser-logs and wire feature-flag correlation. The active observability
 * driver is now managed in `@l.x/utils/src/logger/datadog/Datadog` and
 * defaults to a no-op. White-labels can plug in Hanzo Insights or Sentry via
 * `setObservabilityDriver(driver)`.
 */
export async function initializeDatadog(_appName: string): Promise<void> {
  // No-op. Driver is configured at the platform layer; nothing to bootstrap.
}
