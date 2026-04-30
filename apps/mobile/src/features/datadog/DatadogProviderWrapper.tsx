import { type PropsWithChildren, default as React, useState } from 'react'
import { DatadogContext } from 'src/features/datadog/DatadogContext'

/**
 * Datadog mobile SDK has been removed. This wrapper used to bootstrap
 * `@datadog/mobile-react-native` and instrument errors / interactions /
 * resources. The active observability driver is now configured in
 * `@l.x/utils/src/logger/datadog/Datadog` (no-op by default).
 *
 * The component name and Context shape are preserved so call sites do not
 * have to change. White-labels can plug in their own driver via
 * `setObservabilityDriver`.
 */
export function DatadogProviderWrapper({
  children,
  sessionSampleRate: _sessionSampleRate,
}: PropsWithChildren<{ sessionSampleRate: number | undefined }>): JSX.Element {
  const [isInitialized, setInitialized] = useState(true)
  return (
    <DatadogContext.Provider value={{ isInitialized, setInitialized }}>{children}</DatadogContext.Provider>
  )
}

// Default sample rate kept as an exported constant so call sites that
// imported it from this file still compile.
export const MOBILE_DEFAULT_DATADOG_SESSION_SAMPLE_RATE = 10 // percent
