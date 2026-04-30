/**
 * Platform-agnostic stub for `initializeDatadog`. The Datadog SDK has been
 * removed; the actual observability driver is configured in
 * `@l.x/utils/src/logger/datadog/Datadog` and defaults to a no-op.
 */
export async function initializeDatadog(_appName: string): Promise<void> {
  // No-op. Driver is configured at the platform layer.
}
