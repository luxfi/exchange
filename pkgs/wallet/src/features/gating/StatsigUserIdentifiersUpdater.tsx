import { useQuery } from '@tanstack/react-query'
import { provideLxIdentifierService } from '@luxexchange/api'
import { lxIdentifierQuery } from '@luxexchange/sessions'
import { useSyncStatsigUserIdentifiers } from 'lx/src/features/gating/useSyncStatsigUserIdentifiers'
import { useActiveAccountAddress } from '@luxfi/wallet/src/features/wallet/hooks'

/**
 * Component that updates Statsig user with the active wallet address and lx identifier.
 * This enables experiment targeting based on these identifiers.
 *
 * Should be rendered inside a component tree that has access to:
 * - React Query client
 * - Wallet redux store (for active account address)
 * - Statsig provider
 */
export function StatsigUserIdentifiersUpdater(): null {
  const activeAddress = useActiveAccountAddress()
  const { data: lxIdentifier } = useQuery(lxIdentifierQuery(provideLxIdentifierService))

  useSyncStatsigUserIdentifiers({
    address: activeAddress,
    lxIdentifier,
  })

  return null
}
