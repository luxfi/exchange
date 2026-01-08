import { useEnabledChains } from 'lx/src/features/chains/hooks/useEnabledChains'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { isTestnetChain } from 'lx/src/features/chains/utils'

export function useFilteredChainIds(chains?: UniverseChainId[]): UniverseChainId[] {
  const { isTestnetModeEnabled } = useEnabledChains()
  const { chains: enabledChainIds } = useEnabledChains({ includeTestnets: true })
  const chainsToFilter = chains ?? enabledChainIds

  // Filter chains based on testnet mode, preserving the original order from ORDERED_CHAINS
  // This keeps Lux and Zoo at the front as defined in chainInfo.ts
  return chainsToFilter.filter((chainId) => {
    const isTestnet = isTestnetChain(chainId)
    // Include mainnet chains always, testnets only if testnet mode is enabled
    return !isTestnet || isTestnetModeEnabled
  })
}
