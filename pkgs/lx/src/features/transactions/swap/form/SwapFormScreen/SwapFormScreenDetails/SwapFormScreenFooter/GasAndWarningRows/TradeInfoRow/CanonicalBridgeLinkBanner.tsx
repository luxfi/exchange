import { Flex, Text, TouchableArea } from '@l.x/ui/src'
import { Arrow } from '@l.x/ui/src/components/arrow/Arrow'
import { iconSizes, validColor } from '@l.x/ui/src/theme'
import { NetworkLogo } from '@l.x/lx/src/components/CurrencyLogo/NetworkLogo'
import { getCanonicalBridgingDappUrls } from '@l.x/lx/src/features/bridging/constants'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { getChainLabel } from '@l.x/lx/src/features/chains/utils'
import { useNetworkColors } from '@l.x/lx/src/utils/colors'
import { openUri } from '@l.x/lx/src/utils/linking'

export function CanonicalBridgeLinkBanner({ chainId }: { chainId: UniverseChainId }): JSX.Element {
  const { foreground } = useNetworkColors(chainId)

  const networkLabel = getChainLabel(chainId)
  const networkColor = validColor(foreground)
  const canonicalBridgeUrl = getCanonicalBridgingDappUrls([chainId])[0]

  return (
    <TouchableArea onPress={() => canonicalBridgeUrl && openUri({ uri: canonicalBridgeUrl })}>
      <Flex row gap="$spacing8" alignItems="center">
        <NetworkLogo chainId={chainId} size={iconSizes.icon20} />
        <Text color={networkColor} variant="buttonLabel3">
          {networkLabel} Bridge
        </Text>
        <Arrow color={networkColor} direction="ne" size={iconSizes.icon20} />
      </Flex>
    </TouchableArea>
  )
}
