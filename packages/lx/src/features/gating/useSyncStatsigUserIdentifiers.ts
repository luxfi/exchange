import { getStatsigClient } from '@universe/gating'
import { useEffect } from 'react'
import { logger } from 'utilities/src/logger/logger'

/**
 * Custom identifier keys for Statsig user.
 * These are added to customIDs to enable targeting and analysis.
 */
export const StatsigCustomIdKeys = {
  /** Wallet address for the currently active account */
  Address: 'address',
  /** Server-assigned identifier from the sessions service */
  LuxIdentifier: 'lux_identifier',
} as const

interface UseStatsigUserIdentifiersParams {
  /** The currently active wallet address */
  address?: string | null
  /** The lux identifier from the sessions service */
  luxIdentifier?: string | null
}

/**
 * Hook that syncs Statsig user with custom identifiers (address and lux_identifier).
 *
 * This hook should be called within a component that has access to the Statsig provider.
 * It will update the Statsig user whenever the address or luxIdentifier changes.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const address = useActiveAccountAddress()
 *   const { data: luxIdentifier } = useQuery(luxIdentifierQuery())
 *
 *   useSyncStatsigUserIdentifiers({ address, luxIdentifier })
 *
 *   return <div>...</div>
 * }
 * ```
 */
export function useSyncStatsigUserIdentifiers({ address, luxIdentifier }: UseStatsigUserIdentifiersParams): void {
  useEffect(() => {
    // Skip if neither identifier is available
    if (!address && !luxIdentifier) {
      return
    }

    try {
      const statsigClient = getStatsigClient()
      const currentUser = statsigClient.getContext().user

      const updatedUser = {
        ...currentUser,
        customIDs: {
          ...currentUser.customIDs,
          // Only update each identifier if available (preserves existing values)
          ...(address ? { [StatsigCustomIdKeys.Address]: address } : {}),
          ...(luxIdentifier ? { [StatsigCustomIdKeys.LuxIdentifier]: luxIdentifier } : {}),
        },
      }

      statsigClient.updateUserAsync(updatedUser).catch((error) => {
        logger.warn('useSyncStatsigUserIdentifiers', 'updateUserAsync', 'Failed to update Statsig user', { error })
      })
    } catch (error) {
      // Statsig client may not be initialized yet, which is fine
      logger.debug('useSyncStatsigUserIdentifiers', 'useEffect', 'Could not update Statsig user', { error })
    }
  }, [address, luxIdentifier])
}
