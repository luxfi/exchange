import React, {
  Children,
  cloneElement,
  isValidElement,
  memo,
  PropsWithChildren,
  ReactElement,
  SyntheticEvent,
  useCallback,
} from 'react'
import { sendAnalyticsEvent } from './analytics'
import { useTrace } from './Trace'

type TraceEventProps = {
  // The events to listen for
  events: (keyof GlobalEventHandlersEventMap)[]
  // The name of the event to send
  name: string
  // Additional properties to include in the event
  properties?: Record<string, unknown>
  // Element identifier
  element?: string
  // Whether to prevent default behavior
  shouldLogImpression?: boolean
}

/**
 * TraceEvent component that wraps children and sends analytics events on specified DOM events.
 */
function TraceEventComponent({
  children,
  events,
  name,
  properties,
  element,
}: PropsWithChildren<TraceEventProps>): React.JSX.Element {
  const parentTrace = useTrace()

  const handleEvent = useCallback(
    (eventType: string, originalHandler?: (e: SyntheticEvent) => void) => (e: SyntheticEvent) => {
      sendAnalyticsEvent(name, {
        ...parentTrace,
        element,
        eventType,
        ...properties,
      })
      originalHandler?.(e)
    },
    [name, parentTrace, element, properties]
  )

  const child = Children.only(children)

  if (!isValidElement(child)) {
    return <>{children}</>
  }

  const childProps = child.props as Record<string, unknown>
  const eventHandlers: Record<string, (e: SyntheticEvent) => void> = {}

  events.forEach((eventType) => {
    const handlerName = `on${eventType.charAt(0).toUpperCase()}${eventType.slice(1)}` as keyof typeof childProps
    const originalHandler = childProps[handlerName] as ((e: SyntheticEvent) => void) | undefined
    eventHandlers[handlerName] = handleEvent(eventType, originalHandler)
  })

  return cloneElement(child as ReactElement, eventHandlers)
}

export const TraceEvent = memo(TraceEventComponent)
