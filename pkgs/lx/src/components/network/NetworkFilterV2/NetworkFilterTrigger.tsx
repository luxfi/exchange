import { Flex, TouchableArea } from '@l.x/ui/src'
import { RotatableChevron } from '@l.x/ui/src/components/icons/RotatableChevron'
import { iconSizes } from '@l.x/ui/src/theme'
import { NetworkLogo } from '@l.x/lx/src/components/CurrencyLogo/NetworkLogo'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { TestID } from '@l.x/lx/src/test/fixtures/testIDs'

const NETWORK_ICON_SIZE = iconSizes.icon20

interface NetworkFilterTriggerProps {
  defaultChainId: UniverseChainId
  includeAllNetworks?: boolean
  isOpen: boolean
  onPress: () => void
  selectedChain: UniverseChainId | null
}

export function NetworkFilterTrigger({
  defaultChainId,
  includeAllNetworks,
  isOpen,
  onPress,
  selectedChain,
}: NetworkFilterTriggerProps): JSX.Element {
  return (
    <TouchableArea testID={TestID.TokensNetworkFilterTrigger} onPress={onPress}>
      <Flex row alignItems="center" gap="$spacing4">
        <NetworkLogo chainId={selectedChain ?? (includeAllNetworks ? null : defaultChainId)} size={NETWORK_ICON_SIZE} />
        <RotatableChevron
          animation="100ms"
          animateOnly={['transform', 'opacity']}
          color="$neutral2"
          direction={isOpen ? 'up' : 'down'}
          size="$icon.20"
        />
      </Flex>
    </TouchableArea>
  )
}
