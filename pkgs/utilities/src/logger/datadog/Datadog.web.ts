/**
 * Web platform split for the observability driver.
 *
 * Datadog SDK has been removed. This re-exports the platform-agnostic
 * no-op driver from `./Datadog`. White-labels can plug in their own driver
 * via `setObservabilityDriver` (e.g. Hanzo Insights, Sentry).
 */
export {
  attachUnhandledRejectionHandler,
  createDatadogReduxEnhancer,
  getObservabilityDriver,
  logErrorToDatadog,
  logToDatadog,
  logWarningToDatadog,
  setAttributesToDatadog,
  setObservabilityDriver,
} from '@l.x/utils/src/logger/datadog/Datadog'
export type { ObservabilityDriver, ReduxEnhancerConfig } from '@l.x/utils/src/logger/datadog/Datadog'
