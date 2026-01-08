import { FeatureFlags, useFeatureFlag } from '@luxfi/gating'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { useUniswapXPriorityOrderFlag } from 'lx/src/features/transactions/swap/utils/protocols'

/**
 * Returns true if the chain is supported by UniswapX. Does not differentiate between UniswapX v1 and v2.
 */
export function useIsUniswapXSupportedChain(chainId?: number) {
  const isDutchV3Enabled = useFeatureFlag(FeatureFlags.ArbitrumDutchV3)
  const isPriorityOrdersEnabled = useUniswapXPriorityOrderFlag(chainId)

  return (
    chainId === UniverseChainId.Mainnet ||
    (isDutchV3Enabled && chainId === UniverseChainId.ArbitrumOne) ||
    isPriorityOrdersEnabled
  )
}
