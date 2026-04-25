import { InsightsProvider } from '@hanzo/insights-react'
import { getInsights } from '@l.x/gating'
import { type ReactNode, useEffect, useMemo } from 'react'

type InsightsProviderWrapperProps = {
  distinctId?: string
  children: ReactNode
  onInit?: () => void
  superProperties?: Record<string, unknown>
}

export function InsightsProviderWrapper({
  children,
  distinctId,
  superProperties,
  onInit,
}: InsightsProviderWrapperProps): ReactNode {
  const insights = useMemo(() => getInsights(), [])

  useEffect(() => {
    if (distinctId) {
      insights.identify(distinctId, superProperties)
    } else if (superProperties) {
      insights.register(superProperties)
    }
  }, [insights, distinctId, superProperties])

  useEffect(() => {
    const off = insights.onFeatureFlags(() => onInit?.())
    return off
  }, [insights, onInit])

  return <InsightsProvider client={insights}>{children}</InsightsProvider>
}
