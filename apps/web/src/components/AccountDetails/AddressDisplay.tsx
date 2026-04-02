import { Flex } from '@luxfi/ui/src'
import { Unitag } from '@luxfi/ui/src/components/icons/Unitag'
import { useUnitagsAddressQuery } from '@luxexchange/lx/src/data/apiClients/unitagsApi/useUnitagsAddressQuery'
import { useENSName } from '@luxexchange/lx/src/features/ens/api'
import { TestID } from '@luxexchange/lx/src/test/fixtures/testIDs'
import { shortenAddress } from '@luxfi/utilities/src/addresses'
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
  const luxUsername = unitag?.username

  return (
    <Flex row gap="2px" alignItems="center" data-testid={TestID.AddressDisplay}>
      <IdentifierText>{luxUsername ?? ENSName ?? shortenAddress({ address })}</IdentifierText>
      {luxUsername && (
        <Flex pt="$spacing2">
          <Unitag size={18} />
        </Flex>
      )}
    </Flex>
  )
}
