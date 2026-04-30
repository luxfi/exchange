/**
 * Web platform split for the observability driver.
 *
 * Datadog SDK has been removed. This is a no-op implementation that matches
 * the legacy Datadog API surface. White-labels can plug in their own driver
 * via `setObservabilityDriver` (e.g. Hanzo Insights, Sentry).
 *
 * The platform-split mechanism resolves bare `Datadog` imports to
 * `Datadog.web` on web bundles and `Datadog.native` on RN bundles, so this
 * file MUST NOT re-export from `./Datadog` (circular).
 */
/* biome-ignore-all lint/suspicious/noExplicitAny: Driver surface is platform-agnostic */
import { StoreEnhancerStoreCreator } from 'redux'
import { LoggerErrorContext, LogLevel } from '@l.x/utils/src/logger/types'

export interface ReduxEnhancerConfig {
  shouldLogReduxState: (state: any) => boolean
}

export interface ObservabilityDriver {
  log: (
    message: string,
    options: { level: LogLevel; args: unknown[]; fileName: string; functionName: string },
  ) => void
  warn: (
    message: string,
    options: { level: LogLevel; args: unknown[]; fileName: string; functionName: string },
  ) => void
  error: (error: Error, context?: LoggerErrorContext) => void
  attachUnhandledRejectionHandler: () => void
  setAttributes: (attributes: { [key: string]: unknown }) => Promise<void>
  reduxEnhancer: (
    config: ReduxEnhancerConfig,
  ) => (next: StoreEnhancerStoreCreator) => StoreEnhancerStoreCreator
}

const noopDriver: ObservabilityDriver = {
  log: () => {},
  warn: () => {},
  error: () => {},
  attachUnhandledRejectionHandler: () => {},
  setAttributes: async () => {},
  reduxEnhancer:
    () =>
    (next: StoreEnhancerStoreCreator): StoreEnhancerStoreCreator =>
      next,
}

let driver: ObservabilityDriver = noopDriver

export function setObservabilityDriver(next: ObservabilityDriver): void {
  driver = next
}

export function getObservabilityDriver(): ObservabilityDriver {
  return driver
}

export function logToDatadog(
  message: string,
  options: { level: LogLevel; args: unknown[]; fileName: string; functionName: string },
): void {
  driver.log(message, options)
}

export function logWarningToDatadog(
  message: string,
  options: { level: LogLevel; args: unknown[]; fileName: string; functionName: string },
): void {
  driver.warn(message, options)
}

export function logErrorToDatadog(error: Error, context?: LoggerErrorContext): void {
  driver.error(error, context)
}

export function attachUnhandledRejectionHandler(): void {
  driver.attachUnhandledRejectionHandler()
}

export async function setAttributesToDatadog(attributes: { [key: string]: unknown }): Promise<void> {
  await driver.setAttributes(attributes)
}

export function createDatadogReduxEnhancer(
  config: ReduxEnhancerConfig,
): (next: StoreEnhancerStoreCreator) => StoreEnhancerStoreCreator {
  return driver.reduxEnhancer(config)
}
