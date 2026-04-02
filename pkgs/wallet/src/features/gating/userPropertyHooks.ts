import { getStatsigClient } from '@luxexchange/gating'
import { useEffect } from 'react'
import { useUnitagsAddressQuery } from 'lx/src/data/apiClients/unitagsApi/useUnitagsAddressQuery'
import { AccountType } from 'lx/src/features/accounts/types'
import { useENSName } from 'lx/src/features/ens/api'
import { Platform } from 'lx/src/features/platforms/types/Platform'
import { getValidAddress } from 'lx/src/utils/addresses'
import { logger } from 'utilities/src/logger/logger'
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
    const statsigClient = getStatsigClient()
    const { user } = statsigClient.getContext()
    const newEns = ens?.split('.')[0]
    if (activeAccount?.type === AccountType.SignerMnemonic) {
      statsigClient
        .updateUserAsync({
          ...user,
          privateAttributes: {
            ...user.privateAttributes,
            unitag: unitag?.username,
            ens: newEns,
          },
        })
        .catch((error) => {
          logger.warn(
            'userPropertyHooks',
            'useGatingUserPropertyUsernames',
            'Failed to set usernames for gating',
            error,
          )
        })
    }
  }, [activeAccount?.type, ens, unitag?.username])
}
