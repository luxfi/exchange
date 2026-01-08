import { useMemo } from 'react'
import { NetworkOption } from 'lx/src/components/network/NetworkOption'
import { useNewChainIds } from 'lx/src/features/chains/hooks/useNewChainIds'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { ElementName } from 'lx/src/features/telemetry/constants'

export function useNetworkOptions({
  onPress,
  selectedChain,
  includeAllNetworks,
  chainIds,
}: {
  onPress: (chainId: UniverseChainId | null) => void
  selectedChain: UniverseChainId | null
  includeAllNetworks?: boolean
  chainIds: UniverseChainId[]
}): { key: string; onPress: () => void; render: () => JSX.Element }[] {
  const newChains = useNewChainIds()
  return useMemo(
    () =>
      // null here is the "All networks" option
      [...(includeAllNetworks ? [null] : []), ...chainIds].map((chainId) => ({
        key: `${ElementName.NetworkButton}-${chainId ?? 'all'}`,
        render: () => (
          <NetworkOption
            chainId={chainId}
            currentlySelected={selectedChain === chainId}
            isNew={chainId !== null && newChains.includes(chainId)}
          />
        ),
        onPress: () => onPress(chainId),
      })),
    [includeAllNetworks, chainIds, selectedChain, newChains, onPress],
  )
}
