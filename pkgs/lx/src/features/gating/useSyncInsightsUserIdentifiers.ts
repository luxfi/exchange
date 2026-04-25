import { getInsights } from '@l.x/gating'
import { useEffect } from 'react'
import { logger } from '@l.x/utils/src/logger/logger'

export const InsightsUserIdentifierKeys = {
  Address: 'address',
  LXIdentifier: 'lx_identifier',
} as const

interface UseInsightsUserIdentifiersParams {
  address?: string | null
  lxIdentifier?: string | null
}

export function useSyncInsightsUserIdentifiers({ address, lxIdentifier }: UseInsightsUserIdentifiersParams): void {
  useEffect(() => {
    if (!address && !lxIdentifier) return

    try {
      const insights = getInsights()
      const distinctId = lxIdentifier ?? address ?? undefined
      const props = {
        ...(address ? { [InsightsUserIdentifierKeys.Address]: address } : {}),
        ...(lxIdentifier ? { [InsightsUserIdentifierKeys.LXIdentifier]: lxIdentifier } : {}),
      }
      if (distinctId) {
        insights.identify(distinctId, props)
      } else {
        insights.register(props)
      }
      insights.reloadFeatureFlags()
    } catch (error) {
      logger.debug(
        'useSyncInsightsUserIdentifiers',
        'useEffect',
        'Could not update Insights user',
        { error },
      )
    }
  }, [address, lxIdentifier])
}
