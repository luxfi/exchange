import { useCallback } from 'react'
import { easeInEaseOutLayoutAnimation } from '@l.x/ui/src/animations/layout/layoutAnimation'
import { AlertTriangle } from '@l.x/ui/src/components/icons/AlertTriangle'
import { iconSizes } from '@l.x/ui/src/theme'
import { NetworkLogo } from '@l.x/lx/src/components/CurrencyLogo/NetworkLogo'
import {
  ActionSheetDropdown,
  ActionSheetDropdownStyleProps,
} from '@l.x/lx/src/components/dropdowns/ActionSheetDropdown'
import { useNetworkOptions } from '@l.x/lx/src/components/network/hooks'
import { useEnabledChains } from '@l.x/lx/src/features/chains/hooks/useEnabledChains'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { isMobileApp } from '@l.x/utils/src/platform'

const NETWORK_ICON_SIZE = iconSizes.icon20

export interface NetworkFilterProps {
  chainIds: UniverseChainId[]
  selectedChain: UniverseChainId | null
  onPressChain: (chainId: UniverseChainId | null) => void
  includeAllNetworks?: boolean
  showUnsupportedConnectedChainWarning?: boolean
  styles?: ActionSheetDropdownStyleProps
  hideArrow?: boolean
}

export function NetworkFilter({
  chainIds,
  selectedChain,
  onPressChain,
  includeAllNetworks,
  showUnsupportedConnectedChainWarning,
  styles,
  hideArrow = false,
}: NetworkFilterProps): JSX.Element {
  const { defaultChainId } = useEnabledChains()

  const onPress = useCallback(
    async (chainId: UniverseChainId | null) => {
      // Ensures smooth animation on mobile
      if (isMobileApp) {
        easeInEaseOutLayoutAnimation()
      }

      onPressChain(chainId)
    },
    [onPressChain],
  )

  const networkOptions = useNetworkOptions({
    selectedChain,
    onPress,
    includeAllNetworks,
    chainIds,
  })

  return (
    <ActionSheetDropdown
      options={networkOptions}
      showArrow={!hideArrow}
      styles={{
        alignment: 'right',
        buttonPaddingY: '$none',
        ...styles,
      }}
      testID="chain-selector"
    >
      {showUnsupportedConnectedChainWarning ? (
        <AlertTriangle color="$neutral2" size={20} />
      ) : (
        <NetworkLogo chainId={selectedChain ?? (includeAllNetworks ? null : defaultChainId)} size={NETWORK_ICON_SIZE} />
      )}
    </ActionSheetDropdown>
  )
}
