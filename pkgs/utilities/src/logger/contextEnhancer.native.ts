/**
 * Datadog mobile SDK has been removed. Context updates used to be forwarded
 * to RUM as custom actions; they are now no-ops by default. Plug in an
 * observability driver via `setObservabilityDriver` if needed.
 */
export function logContextUpdate(_contextName: string, _newState: unknown): void {
  // No-op.
}
