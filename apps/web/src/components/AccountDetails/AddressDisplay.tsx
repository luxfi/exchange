<<<<<<< HEAD
import { Flex } from '@l.x/ui/src'
import { Unitag } from '@l.x/ui/src/components/icons/Unitag'
import { useUnitagsAddressQuery } from '@l.x/lx/src/data/apiClients/unitagsApi/useUnitagsAddressQuery'
import { useENSName } from '@l.x/lx/src/features/ens/api'
import { TestID } from '@l.x/lx/src/test/fixtures/testIDs'
import { shortenAddress } from '@l.x/utils/src/addresses'
=======
import { Flex } from 'ui/src'
import { Unitag } from 'ui/src/components/icons/Unitag'
import { useUnitagsAddressQuery } from 'uniswap/src/data/apiClients/unitagsApi/useUnitagsAddressQuery'
import { useENSName } from 'uniswap/src/features/ens/api'
import { TestID } from 'uniswap/src/test/fixtures/testIDs'
import { shortenAddress } from 'utilities/src/addresses'
>>>>>>> upstream/main
import { deprecatedStyled } from '~/lib/deprecated-styled'
import { EllipsisStyle } from '~/theme/components/styles'

const IdentifierText = deprecatedStyled.span`
  ${EllipsisStyle}
`

export function AddressDisplay({ address }: { address: Address }) {
  const { data: ENSName } = useENSName(address)
  const { data: unitag } = useUnitagsAddressQuery({
    params: address ? { address } : undefined,
  })
<<<<<<< HEAD
  const luxUsername = unitag?.username

  return (
    <Flex row gap="2px" alignItems="center" data-testid={TestID.AddressDisplay}>
      <IdentifierText>{luxUsername ?? ENSName ?? shortenAddress({ address })}</IdentifierText>
      {luxUsername && (
=======
  const uniswapUsername = unitag?.username

  return (
    <Flex row gap="2px" alignItems="center" data-testid={TestID.AddressDisplay}>
      <IdentifierText>{uniswapUsername ?? ENSName ?? shortenAddress({ address })}</IdentifierText>
      {uniswapUsername && (
>>>>>>> upstream/main
        <Flex pt="$spacing2">
          <Unitag size={18} />
        </Flex>
      )}
    </Flex>
  )
}
