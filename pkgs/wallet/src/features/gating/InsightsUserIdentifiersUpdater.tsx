import { useQuery } from '@tanstack/react-query'
import { provideLXIdentifierService } from '@l.x/api'
import { lxIdentifierQuery } from '@l.x/sessions'
import { useSyncInsightsUserIdentifiers } from '@l.x/lx/src/features/gating/useSyncInsightsUserIdentifiers'
import { useActiveAccountAddress } from '@luxfi/wallet/src/features/wallet/hooks'

export function InsightsUserIdentifiersUpdater(): null {
  const activeAddress = useActiveAccountAddress()
  const { data: lxIdentifier } = useQuery(lxIdentifierQuery(provideLXIdentifierService))

  useSyncInsightsUserIdentifiers({
    address: activeAddress,
    lxIdentifier,
  })

  return null
}
