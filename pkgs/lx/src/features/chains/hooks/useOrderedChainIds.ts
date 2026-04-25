import { ChainsConfigKey, DynamicConfigs, useDynamicConfigValue } from '@l.x/gating'
import { useMemo } from 'react'
import { ALL_CHAIN_IDS } from '@l.x/lx/src/features/chains/chainInfo'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'

// Returns the given chains ordered based on the Hanzo Insights flag payload
export function useOrderedChainIds(chainIds: UniverseChainId[]): UniverseChainId[] {
  const serverOrderedChains = useDynamicConfigValue({
    config: DynamicConfigs.Chains,
    key: ChainsConfigKey.OrderedChainIds,
    defaultValue: ALL_CHAIN_IDS,
  })

  return useMemo(() => {
    const orderedChains = serverOrderedChains.filter((c) => chainIds.includes(c))
    const unspecifiedChains = chainIds.filter((c) => !serverOrderedChains.includes(c))
    return [...orderedChains, ...unspecifiedChains]
  }, [serverOrderedChains, chainIds])
}
