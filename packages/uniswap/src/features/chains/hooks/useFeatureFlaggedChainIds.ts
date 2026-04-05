import { FeatureFlags, getFeatureFlag, useFeatureFlag } from '@universe/gating'
import { useMemo } from 'react'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { filterChainIdsByFeatureFlag } from 'uniswap/src/features/chains/utils'

export const getFeatureFlaggedChainIds = createGetFeatureFlaggedChainIds({
  getLineaStatus: () => getFeatureFlag(FeatureFlags.Linea),
  getMonadStatus: () => getFeatureFlag(FeatureFlags.Monad),
  getSoneiumStatus: () => getFeatureFlag(FeatureFlags.Soneium),
  getSolanaStatus: () => getFeatureFlag(FeatureFlags.Solana),
  getTempoStatus: () => getFeatureFlag(FeatureFlags.Tempo),
  getXLayerStatus: () => getFeatureFlag(FeatureFlags.XLayer),
})

// Used to feature flag chains. If a chain is not included in the object, it is considered enabled by default.
export function useFeatureFlaggedChainIds(): UniverseChainId[] {
  const lineaStatus = useFeatureFlag(FeatureFlags.Linea)
  const monadStatus = useFeatureFlag(FeatureFlags.Monad)
  const soneiumStatus = useFeatureFlag(FeatureFlags.Soneium)
  const solanaStatus = useFeatureFlag(FeatureFlags.Solana)
  const tempoStatus = useFeatureFlag(FeatureFlags.Tempo)
  const xLayerStatus = useFeatureFlag(FeatureFlags.XLayer)

  return useMemo(
    () =>
      createGetFeatureFlaggedChainIds({
        getLineaStatus: () => lineaStatus,
        getMonadStatus: () => monadStatus,
        getSoneiumStatus: () => soneiumStatus,
        getSolanaStatus: () => solanaStatus,
        getTempoStatus: () => tempoStatus,
        getXLayerStatus: () => xLayerStatus,
      })(),
    [lineaStatus, monadStatus, soneiumStatus, solanaStatus, tempoStatus, xLayerStatus],
  )
}

export function createGetFeatureFlaggedChainIds(ctx: {
  getLineaStatus: () => boolean
  getMonadStatus: () => boolean
  getSoneiumStatus: () => boolean
  getSolanaStatus: () => boolean
  getTempoStatus: () => boolean
  getXLayerStatus: () => boolean
}): () => UniverseChainId[] {
  return () =>
    // You can use the useFeatureFlag hook here to enable/disable chains based on feature flags.
    // Example: [ChainId.BLAST]: useFeatureFlag(FeatureFlags.BLAST)
    filterChainIdsByFeatureFlag({
      [UniverseChainId.Linea]: ctx.getLineaStatus(),
      [UniverseChainId.Monad]: ctx.getMonadStatus(),
      [UniverseChainId.Soneium]: ctx.getSoneiumStatus(),
      [UniverseChainId.Solana]: ctx.getSolanaStatus(),
      [UniverseChainId.Tempo]: ctx.getTempoStatus(),
      [UniverseChainId.XLayer]: ctx.getXLayerStatus(),
    })
}
