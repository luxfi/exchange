/**
 * Datadog mobile SDK has been removed. `setDatadogUserWithUniqueId` used to
 * call `DdSdkReactNative.setUser` to associate a unique device id + active
 * wallet with the RUM session. It is now a no-op so call sites do not have
 * to change. Plug in an observability driver via `setObservabilityDriver`
 * to restore user-correlation.
 */
export function setDatadogUserWithUniqueId(
  _activeAddress: Maybe<Address>,
  _uniswapIdentifier?: string | null,
): void {
  // No-op.
}
