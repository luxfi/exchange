/**
 * Datadog mobile SDK has been removed. This is a no-op stub for the
 * platform-split init. See `@l.x/utils/src/logger/datadog/Datadog` for the
 * active observability driver (no-op by default).
 */
export function initializeDatadog(_appName: string): void {
  // No-op. White-labels can plug in their own driver.
}
