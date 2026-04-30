/* biome-ignore-all lint/suspicious/noExplicitAny: Driver surface is platform-agnostic */
import { StoreEnhancerStoreCreator } from 'redux'
import { LoggerErrorContext, LogLevel } from '@l.x/utils/src/logger/types'

export interface ReduxEnhancerConfig {
  shouldLogReduxState: (state: any) => boolean
}

/**
 * ObservabilityDriver — pluggable RUM/log sink.
 *
 * Default driver is a no-op. White-labels can plug in Hanzo Insights, Sentry,
 * or any other observability backend by calling `setObservabilityDriver`.
 *
 * This file replaces the previous Datadog-specific implementation. The legacy
 * `logToDatadog` / `logErrorToDatadog` etc. function names are kept for
 * backward compatibility — they now route through the driver.
 */
export interface ObservabilityDriver {
  log: (
    message: string,
    options: {
      level: LogLevel
      args: unknown[]
      fileName: string
      functionName: string
    },
  ) => void
  warn: (
    message: string,
    options: {
      level: LogLevel
      args: unknown[]
      fileName: string
      functionName: string
    },
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

// Legacy API surface — kept so call sites do not have to change.
// Each just routes to the active driver.
export function logToDatadog(
  message: string,
  options: {
    level: LogLevel
    args: unknown[]
    fileName: string
    functionName: string
  },
): void {
  driver.log(message, options)
}

export function logWarningToDatadog(
  message: string,
  options: {
    level: LogLevel
    args: unknown[]
    fileName: string
    functionName: string
  },
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
