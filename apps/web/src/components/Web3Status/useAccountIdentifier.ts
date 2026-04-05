<<<<<<< HEAD
import { useUnitagsAddressQuery } from '@l.x/lx/src/data/apiClients/unitagsApi/useUnitagsAddressQuery'
import { useActiveAddresses } from '@l.x/lx/src/features/accounts/store/hooks'
import { shortenAddress } from '@l.x/utils/src/addresses'
=======
import { useUnitagsAddressQuery } from 'uniswap/src/data/apiClients/unitagsApi/useUnitagsAddressQuery'
import { useActiveAddresses } from 'uniswap/src/features/accounts/store/hooks'
import { shortenAddress } from 'utilities/src/addresses'
>>>>>>> upstream/main
import { useEnsName } from 'wagmi'

// Returns an identifier for the current or recently connected account, prioritizing unitag -> ENS name -> address
export function useAccountIdentifier() {
  const { evmAddress, svmAddress } = useActiveAddresses()

  const { data: unitagResponse } = useUnitagsAddressQuery({
    params: evmAddress ? { address: evmAddress } : undefined,
  })
  const unitag = unitagResponse?.username
  const { data: ensName } = useEnsName({ address: evmAddress })

  const accountIdentifier = unitag ?? ensName ?? shortenAddress({ address: evmAddress ?? svmAddress })

  return {
    accountIdentifier,
    hasUnitag: Boolean(unitag),
  }
}
