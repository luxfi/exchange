import { FeatureFlags, useFeatureFlag } from '@luxfi/gating'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { useDEXPriorityOrderFlag } from '@l.x/lx/src/features/transactions/swap/utils/protocols'

/**
 * Returns true if the chain is supported by DEX. Does not differentiate between DEX v1 and v2.
 */
export function useIsDEXSupportedChain(chainId?: number) {
  const isDutchV3Enabled = useFeatureFlag(FeatureFlags.ArbitrumDutchV3)
  const isPriorityOrdersEnabled = useDEXPriorityOrderFlag(chainId)

  return (
    chainId === UniverseChainId.Mainnet ||
    (isDutchV3Enabled && chainId === UniverseChainId.ArbitrumOne) ||
    isPriorityOrdersEnabled
  )
}
