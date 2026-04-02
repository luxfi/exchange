import { useTranslation } from 'react-i18next'
import { Flex, Text, TouchableArea, useMedia } from 'ui/src'
import { zIndexes } from 'ui/src/theme'
import { NoResultsFound } from 'lx/src/components/lists/NoResultsFound'
import type { TieredNetworkOptions } from 'lx/src/components/network/NetworkFilterV2/types'
import { NetworkOption } from 'lx/src/components/network/NetworkOption'
import { useNewChainIds } from 'lx/src/features/chains/hooks/useNewChainIds'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { isExtensionApp, isWebApp } from 'utilities/src/platform'
import { useEvent } from 'utilities/src/react/hooks'

interface NetworkFilterContentProps {
  searchQuery: string
  tieredOptions?: TieredNetworkOptions
  selectedChain: UniverseChainId | null
  onPressChain: (chainId: UniverseChainId | null) => void
  chainIds: UniverseChainId[]
  showAllNetworks: boolean
}

interface SelectableNetworkOptionProps {
  chainId: UniverseChainId | null
  selectedChain: UniverseChainId | null
  newChains: UniverseChainId[]
  onPressChain: (chainId: UniverseChainId | null) => void
}

function SectionHeader({ title }: { title: string }): JSX.Element {
  const media = useMedia()
  const shouldStickHeader = isExtensionApp || (isWebApp && !media.sm)

  return (
    <Flex
      backgroundColor="$surface1"
      pb="$spacing4"
      pt="$spacing8"
      px="$spacing8"
      zIndex={zIndexes.sticky}
      $platform-web={shouldStickHeader ? { position: 'sticky', top: 0 } : undefined}
    >
      <Text color="$neutral2" variant="body4">
        {title}
      </Text>
    </Flex>
  )
}

function SelectableNetworkOption({
  chainId,
  selectedChain,
  newChains,
  onPressChain,
}: SelectableNetworkOptionProps): JSX.Element {
  const handlePress = useEvent((): void => {
    onPressChain(chainId)
  })

  return (
    <TouchableArea hoverable borderRadius="$rounded8" onPress={handlePress}>
      <NetworkOption
        chainId={chainId}
        currentlySelected={selectedChain === chainId}
        isNew={chainId !== null && newChains.includes(chainId)}
      />
    </TouchableArea>
  )
}

export function NetworkFilterContent({
  searchQuery,
  tieredOptions,
  selectedChain,
  onPressChain,
  chainIds,
  showAllNetworks,
}: NetworkFilterContentProps): JSX.Element {
  const { t } = useTranslation()
  const newChains = useNewChainIds()
  const hasVisibleOptions = chainIds.length > 0 || showAllNetworks

  if (!hasVisibleOptions) {
    return (
      <Flex pb="$spacing24">
        <NoResultsFound searchFilter={searchQuery} />
      </Flex>
    )
  }

  if (!tieredOptions) {
    return (
      <Flex gap="$spacing4" py="$spacing4" pl="$spacing2">
        {showAllNetworks && (
          <SelectableNetworkOption
            chainId={null}
            selectedChain={selectedChain}
            newChains={newChains}
            onPressChain={onPressChain}
          />
        )}
        {chainIds.map((chainId) => (
          <SelectableNetworkOption
            key={chainId}
            chainId={chainId}
            selectedChain={selectedChain}
            newChains={newChains}
            onPressChain={onPressChain}
          />
        ))}
      </Flex>
    )
  }

  const hasWithBalances = tieredOptions.withBalances.length > 0
  const hasOtherNetworks = tieredOptions.otherNetworks.length > 0
  const withBalanceChainIds = tieredOptions.withBalances.map((option) => option.chainId)
  const otherNetworkChainIds = tieredOptions.otherNetworks.map((option) => option.chainId)

  return (
    <Flex gap="$spacing4" py="$spacing4" pl="$spacing2">
      {showAllNetworks && (
        <SelectableNetworkOption
          chainId={null}
          selectedChain={selectedChain}
          newChains={newChains}
          onPressChain={onPressChain}
        />
      )}

      {hasWithBalances && (
        <>
          <SectionHeader title={t('network.filter.withBalances')} />
          {withBalanceChainIds.map((chainId) => (
            <SelectableNetworkOption
              key={chainId}
              chainId={chainId}
              selectedChain={selectedChain}
              newChains={newChains}
              onPressChain={onPressChain}
            />
          ))}
        </>
      )}

      {hasOtherNetworks && (
        <>
          <SectionHeader title={t('network.filter.otherNetworks')} />
          {otherNetworkChainIds.map((chainId) => (
            <SelectableNetworkOption
              key={chainId}
              chainId={chainId}
              selectedChain={selectedChain}
              newChains={newChains}
              onPressChain={onPressChain}
            />
          ))}
        </>
      )}
    </Flex>
  )
}
