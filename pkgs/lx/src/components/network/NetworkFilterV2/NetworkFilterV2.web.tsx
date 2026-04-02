import { useState } from 'react'
import { AdaptiveWebPopoverContent, Flex, Popover, useMedia, useScrollbarStyles } from 'ui/src'
import { zIndexes } from 'ui/src/theme'
import { NetworkFilterContent } from 'lx/src/components/network/NetworkFilterV2/NetworkFilterContent'
import { NetworkFilterTrigger } from 'lx/src/components/network/NetworkFilterV2/NetworkFilterTrigger'
import type { NetworkFilterV2Props } from 'lx/src/components/network/NetworkFilterV2/NetworkFilterV2'
import { NetworkSearchBar } from 'lx/src/components/network/NetworkFilterV2/NetworkSearchBar'
import { useNetworkFilterSearch } from 'lx/src/components/network/NetworkFilterV2/useNetworkFilterSearch'
import { useEnabledChains } from 'lx/src/features/chains/hooks/useEnabledChains'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { isWebApp } from 'utilities/src/platform'
import { useEvent } from 'utilities/src/react/hooks'

const DESKTOP_DROPDOWN_MAX_HEIGHT = 320
const MOBILE_DROPDOWN_MAX_HEIGHT = '50vh'
const DROPDOWN_WIDTH = 240

export function NetworkFilterV2({
  chainIds,
  selectedChain,
  onPressChain,
  includeAllNetworks,
  tieredOptions,
}: NetworkFilterV2Props): JSX.Element {
  const { defaultChainId } = useEnabledChains()
  const [isOpen, setIsOpen] = useState(false)
  const { searchQuery, setSearchQuery, filteredChainIds, filteredTieredOptions, showAllNetworks } =
    useNetworkFilterSearch({
      chainIds,
      includeAllNetworks,
      tieredOptions,
    })
  const media = useMedia()
  const scrollbarStyles = useScrollbarStyles()
  const isMobileSheet = isWebApp && media.sm
  const dropdownMaxHeight = isMobileSheet ? undefined : DESKTOP_DROPDOWN_MAX_HEIGHT
  const mobileSheetContentHeight = isMobileSheet ? MOBILE_DROPDOWN_MAX_HEIGHT : undefined
  const dropdownWidth = isMobileSheet ? '100%' : DROPDOWN_WIDTH

  const handleOpenChange = useEvent((nextIsOpen: boolean) => {
    if (!nextIsOpen) {
      setSearchQuery('')
    }
    setIsOpen(nextIsOpen)
  })

  const handleClose = useEvent(() => {
    handleOpenChange(false)
  })

  const handlePressChain = useEvent((chainId: UniverseChainId | null) => {
    onPressChain(chainId)
    handleClose()
  })

  const handleToggleOpen = useEvent(() => {
    handleOpenChange(!isOpen)
  })

  return (
    <Popover open={isOpen} placement="bottom-end" onOpenChange={handleOpenChange}>
      <Popover.Trigger>
        <NetworkFilterTrigger
          defaultChainId={defaultChainId}
          includeAllNetworks={includeAllNetworks}
          isOpen={isOpen}
          selectedChain={selectedChain}
          onPress={handleToggleOpen}
        />
      </Popover.Trigger>

      <AdaptiveWebPopoverContent
        backgroundColor="$surface1"
        borderColor="$surface3"
        borderRadius="$rounded24"
        borderWidth={0.5}
        zIndex={zIndexes.popover}
        isOpen={isOpen}
        placement="bottom-end"
        px="$spacing4"
        pb="$spacing2"
        webBottomSheetProps={{ onClose: handleClose }}
      >
        <Flex width={dropdownWidth}>
          <NetworkSearchBar autoFocus={!isMobileSheet} value={searchQuery} onChangeText={setSearchQuery} />
          <Flex
            height={mobileSheetContentHeight}
            maxHeight={dropdownMaxHeight}
            pr="$none"
            style={{ ...scrollbarStyles, scrollbarWidth: 'auto', overflow: 'auto' }}
          >
            <NetworkFilterContent
              searchQuery={searchQuery}
              chainIds={filteredChainIds}
              selectedChain={selectedChain}
              showAllNetworks={showAllNetworks}
              tieredOptions={filteredTieredOptions}
              onPressChain={handlePressChain}
            />
          </Flex>
        </Flex>
      </AdaptiveWebPopoverContent>
    </Popover>
  )
}
