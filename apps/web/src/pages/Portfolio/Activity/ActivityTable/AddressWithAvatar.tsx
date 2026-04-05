import { memo } from 'react'
<<<<<<< HEAD
import { Flex, Text } from '@l.x/ui/src'
import { Unitag } from '@l.x/ui/src/components/icons/Unitag'
import { iconSizes } from '@l.x/ui/src/theme'
import { useUnitagsAddressQuery } from '@l.x/lx/src/data/apiClients/unitagsApi/useUnitagsAddressQuery'
import { AccountIcon } from '@l.x/lx/src/features/accounts/AccountIcon'
import { useENSName } from '@l.x/lx/src/features/ens/api'
import { shortenAddress } from '@l.x/utils/src/addresses'
=======
import { Flex, Text } from 'ui/src'
import { Unitag } from 'ui/src/components/icons/Unitag'
import { iconSizes } from 'ui/src/theme'
import { useUnitagsAddressQuery } from 'uniswap/src/data/apiClients/unitagsApi/useUnitagsAddressQuery'
import { AccountIcon } from 'uniswap/src/features/accounts/AccountIcon'
import { useENSName } from 'uniswap/src/features/ens/api'
import { shortenAddress } from 'utilities/src/addresses'
>>>>>>> upstream/main
import { useActivityAddressLookupValue } from '~/pages/Portfolio/Activity/ActivityTable/ActivityAddressLookupStore'

interface AddressWithAvatarProps {
  address: Address
  showAvatar?: boolean
}

<<<<<<< HEAD
function _AddressWithAvatar({ address, showAvatar = true }: AddressWithAvatarProps) {
=======
function AddressWithAvatarInner({ address, showAvatar = true }: AddressWithAvatarProps) {
>>>>>>> upstream/main
  // Try to get Unitag from store first (batch fetched)
  const { unitagsMap } = useActivityAddressLookupValue()
  const contextUnitag = unitagsMap.get(address)

  // Fallback to individual query if not in context (for addresses outside the table)
  const { data: unitag } = useUnitagsAddressQuery({
    params: address && !contextUnitag ? { address } : undefined,
  })

  // ENS lookups are handled individually - React Query will deduplicate
  const { data: ENSName } = useENSName(address)

  // Use context Unitag if available, otherwise fallback to individual query result
<<<<<<< HEAD
  const luxUsername = contextUnitag ?? unitag?.username

  const displayName = luxUsername ?? ENSName ?? shortenAddress({ address })
  const hasUnitag = Boolean(luxUsername)
=======
  const uniswapUsername = contextUnitag ?? unitag?.username

  const displayName = uniswapUsername ?? ENSName ?? shortenAddress({ address })
  const hasUnitag = Boolean(uniswapUsername)
>>>>>>> upstream/main

  return (
    <Flex row alignItems="center" gap="$gap8">
      {showAvatar && <AccountIcon address={address} size={iconSizes.icon16} />}
      <Text variant="body3" color="$neutral1">
        {displayName}
      </Text>
      {hasUnitag && (
        <Flex pt="$spacing1">
          <Unitag size={16} />
        </Flex>
      )}
    </Flex>
  )
}

<<<<<<< HEAD
export const AddressWithAvatar = memo(_AddressWithAvatar)
=======
export const AddressWithAvatar = memo(AddressWithAvatarInner)
>>>>>>> upstream/main
