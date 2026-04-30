import { DependencyList } from 'react'

/**
 * Performance logger used to time render-to-render durations and forward
 * them to Datadog RUM. The Datadog SDK has been removed; this hook is now
 * a no-op so call sites do not have to change. Plug in an observability
 * driver via `setObservabilityDriver` to restore measurement.
 */
export function usePerformanceLogger(_eventName: string, _dependencyList: DependencyList): void {
  // No-op.
}
