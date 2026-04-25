import { getInsights } from '@l.x/gating'
import { useEffect } from 'react'
import { useUnitagsAddressQuery } from '@l.x/lx/src/data/apiClients/unitagsApi/useUnitagsAddressQuery'
import { AccountType } from '@l.x/lx/src/features/accounts/types'
import { useENSName } from '@l.x/lx/src/features/ens/api'
import { Platform } from '@l.x/lx/src/features/platforms/types/Platform'
import { getValidAddress } from '@l.x/lx/src/utils/addresses'
import { logger } from '@l.x/utils/src/logger/logger'
import { useActiveAccount } from '@luxfi/wallet/src/features/wallet/hooks'

export function useGatingUserPropertyUsernames(): void {
  const activeAccount = useActiveAccount()
  // TODO(WALL-7065): Update to support Solana
  const validatedAddress = getValidAddress({ address: activeAccount?.address, platform: Platform.EVM })
  const { data: ens } = useENSName(validatedAddress ?? undefined)
  const { data: unitag } = useUnitagsAddressQuery({
    params: validatedAddress ? { address: validatedAddress } : undefined,
  })

  useEffect(() => {
    if (activeAccount?.type !== AccountType.SignerMnemonic) return
    try {
      const insights = getInsights()
      const newEns = ens?.split('.')[0]
      insights.register({
        $set_once: {
          unitag: unitag?.username,
          ens: newEns,
        },
      })
    } catch (error) {
      logger.warn(
        'userPropertyHooks',
        'useGatingUserPropertyUsernames',
        'Failed to set usernames for gating',
        error,
      )
    }
  }, [activeAccount?.type, ens, unitag?.username])
}
