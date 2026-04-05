<<<<<<< HEAD
import { useEnabledChains } from '@l.x/lx/src/features/chains/hooks/useEnabledChains'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { isTestnetChain } from '@l.x/lx/src/features/chains/utils'
=======
import { useEnabledChains } from 'uniswap/src/features/chains/hooks/useEnabledChains'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { isBackendSupportedChainId, isTestnetChain } from 'uniswap/src/features/chains/utils'
>>>>>>> upstream/main

export function useFilteredChainIds(chains?: UniverseChainId[]): UniverseChainId[] {
  const { isTestnetModeEnabled } = useEnabledChains()
  const { chains: enabledChainIds } = useEnabledChains({ includeTestnets: true })
  const chainsToFilter = chains ?? enabledChainIds
<<<<<<< HEAD

  // Filter chains based on testnet mode, preserving the original order from ORDERED_CHAINS
  // This keeps Lux and Zoo at the front as defined in chainInfo.ts
  return chainsToFilter.filter((chainId) => {
    const isTestnet = isTestnetChain(chainId)
    // Include mainnet chains always, testnets only if testnet mode is enabled
    return !isTestnet || isTestnetModeEnabled
  })
=======
  const mainnetChainIds = chainsToFilter.filter(isBackendSupportedChainId).filter((c) => !isTestnetChain(c))
  const testnetChainIds = chainsToFilter.filter(isBackendSupportedChainId).filter(isTestnetChain)
  const unsupportedMainnetChainIds = chainsToFilter.filter((c) => !isBackendSupportedChainId(c) && !isTestnetChain(c))
  return [...mainnetChainIds, ...(isTestnetModeEnabled ? testnetChainIds : []), ...unsupportedMainnetChainIds]
>>>>>>> upstream/main
}
