import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useFeatureFlaggedChainIds } from 'lx/src/features/chains/hooks/useFeatureFlaggedChainIds'
// This is the only file that should be importing `useOrderedChainIds` directly.
// biome-ignore lint/style/noRestrictedImports: legacy import will be migrated
import { useOrderedChainIds } from 'lx/src/features/chains/hooks/useOrderedChainIds'
import { EnabledChainsInfo, UniverseChainId } from 'lx/src/features/chains/types'
import { getEnabledChains, isTestnetChain } from 'lx/src/features/chains/utils'
import { Platform } from 'lx/src/features/platforms/types/Platform'
// biome-ignore lint/style/noRestrictedImports: legacy import will be migrated
import { selectIsTestnetModeEnabled } from 'lx/src/features/settings/selectors'

export function useIsModeMismatch(chainId?: UniverseChainId): boolean {
  const { isTestnetModeEnabled } = useEnabledChains()
  return isTestnetChain(chainId ?? UniverseChainId.Mainnet) ? !isTestnetModeEnabled : isTestnetModeEnabled
}

export function useEnabledChains(options?: { platform?: Platform; includeTestnets?: boolean }): EnabledChainsInfo {
  const featureFlaggedChainIds = useFeatureFlaggedChainIds()
  const isTestnetModeEnabled = useSelector(selectIsTestnetModeEnabled)

  const {
    chains: unorderedChains,
    gqlChains,
    defaultChainId,
  } = useMemo(
    () =>
      getEnabledChains({
        platform: options?.platform,
        includeTestnets: options?.includeTestnets,
        isTestnetModeEnabled,
        featureFlaggedChainIds,
      }),
    [options?.platform, options?.includeTestnets, isTestnetModeEnabled, featureFlaggedChainIds],
  )

  const orderedChains = useOrderedChainIds(unorderedChains)

  return useMemo(() => {
    return { chains: orderedChains, gqlChains, defaultChainId, isTestnetModeEnabled }
  }, [defaultChainId, gqlChains, isTestnetModeEnabled, orderedChains])
}

// use in non hook contexts
export function createGetEnabledChains(ctx: {
  getIsTestnetModeEnabled: () => boolean
  getFeatureFlaggedChainIds: () => UniverseChainId[]
}): () => EnabledChainsInfo {
  const { getIsTestnetModeEnabled, getFeatureFlaggedChainIds } = ctx
  return () =>
    getEnabledChains({
      isTestnetModeEnabled: getIsTestnetModeEnabled(),
      featureFlaggedChainIds: getFeatureFlaggedChainIds(),
    })
}
