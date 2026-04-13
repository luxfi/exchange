import { useContext, useMemo } from 'react'
import { ExploreContext } from '~/state/explore'

/**
 * Returns factory-level stats from the luxfi/graph engine.
 * Used by the landing page to show real pool count and transaction count.
 */
export function useFactoryStats() {
  const {
    exploreStats: { data, isLoading },
  } = useContext(ExploreContext)

  return useMemo(() => {
    const factoryStats = (data?.stats as any)?.factoryStats
    return {
      isLoading,
      poolCount: factoryStats?.poolCount ?? 0,
      txCount: factoryStats?.txCount ?? 0,
      totalValueLockedUSD: factoryStats?.totalValueLockedUSD ?? 0,
    }
  }, [data, isLoading])
}
