import React, { createContext, memo, PropsWithChildren, useContext, useEffect, useMemo } from 'react'
import { sendAnalyticsEvent } from './analytics'
import { ITraceContext } from './types'

export const TraceContext = createContext<ITraceContext>({})

export function useTrace(): ITraceContext {
  return useContext(TraceContext)
}

type TraceProps = {
  // Identifies the UI context (e.g., 'swap-page', 'pool-page')
  page?: string
  // Identifies the UI section (e.g., 'token-selector', 'swap-form')
  section?: string
  // Identifies the element (e.g., 'token-input', 'submit-button')
  element?: string
  // Additional properties to include in events
  properties?: Record<string, unknown>
  // Event to send on mount
  logImpression?: boolean
} & ITraceContext

/**
 * Trace component that provides analytics context to children.
 * Optionally logs an impression event when mounted.
 */
function TraceComponent({
  children,
  page,
  section,
  element,
  properties,
  logImpression,
  ...parentContext
}: PropsWithChildren<TraceProps>): React.JSX.Element {
  const parentTrace = useTrace()

  const combinedContext = useMemo(
    () => ({
      ...parentTrace,
      ...parentContext,
      page: page ?? parentTrace.page,
      section: section ?? parentTrace.section,
      element: element ?? parentTrace.element,
    }),
    [parentTrace, parentContext, page, section, element]
  )

  useEffect(() => {
    if (logImpression) {
      sendAnalyticsEvent('Impression', {
        ...combinedContext,
        ...properties,
      })
    }
  }, [logImpression, combinedContext, properties])

  return <TraceContext.Provider value={combinedContext}>{children}</TraceContext.Provider>
}

export const Trace = memo(TraceComponent)
