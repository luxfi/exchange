import { FeatureFlags, useFeatureFlag } from '@l.x/gating'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { useHasAccountMismatchCallback } from '@l.x/lx/src/features/smartWallet/mismatch/hooks'
import { useEvent } from '@l.x/utils/src/react/hooks'

export function useGetCanSignPermits(): (chainId?: UniverseChainId) => boolean {
  const forceTrue = useFeatureFlag(FeatureFlags.ForcePermitTransactions)
  const mismatchUXEnabled = useFeatureFlag(FeatureFlags.EnablePermitMismatchUX)
  const getHasMismatch = useHasAccountMismatchCallback()

  return useEvent((chainId?: UniverseChainId) => {
    return forceTrue || (getHasMismatch(chainId) && mismatchUXEnabled)
  })
}
