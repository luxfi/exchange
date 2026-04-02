import { ExploreStatsResponse, ProtocolStatsResponse } from '@luxamm/client-explore/dist/lx/explore/v1/service_pb'
import { createContext, useMemo } from 'react'
import { useIsSupportedChainId } from '@luxexchange/lx/src/features/chains/hooks/useSupportedChainId'
import { UniverseChainId } from '@luxexchange/lx/src/features/chains/types'
import { useExchangeStats } from './useExchangeStats'

interface QueryResult<T> {
  data?: T
  isLoading: boolean
  error: boolean
}

interface ExploreContextType {
  exploreStats: QueryResult<ExploreStatsResponse>
  protocolStats: QueryResult<ProtocolStatsResponse>
}

export const giveExploreStatDefaultValue = (value: number | undefined, defaultValue = 0): number => {
  return value ?? defaultValue
}

export const ExploreContext = createContext<ExploreContextType>({
  exploreStats: {
    data: undefined,
    isLoading: false,
    error: false,
  },
  protocolStats: {
    data: undefined,
    isLoading: false,
    error: false,
  },
})

export const TABLE_PAGE_SIZE = 20

export function ExploreContextProvider({
  chainId,
  children,
}: {
  chainId?: UniverseChainId
  children: React.ReactNode
}) {
  const isSupportedChain = useIsSupportedChainId(chainId)

  // Lux/Zoo: V3 Subgraph (AMM-derived prices). Other chains: CoinGecko.
  const {
    data: exploreStatsData,
    isLoading: exploreStatsLoading,
    error: exploreStatsError,
  } = useExchangeStats(isSupportedChain ? chainId : undefined)

  // Build protocolStats from pool data (TVL/volume) when available
  const protocolStatsData = useMemo(() => {
    const pools = (exploreStatsData?.stats as any)?.poolStats
    if (!pools || pools.length === 0) {
      return undefined
    }
    const now = Math.floor(Date.now() / 1000)
    const makeTimestamped = (value: number) => [{ value, timestamp: BigInt(now) }]

    let v2Tvl = 0, v3Tvl = 0, v4Tvl = 0, v2Vol = 0, v3Vol = 0, v4Vol = 0
    for (const pool of pools) {
      const tvl = pool.totalLiquidity?.value ?? 0
      const vol = pool.volume1Day?.value ?? 0
      const ver = (pool.protocolVersion ?? '').toUpperCase()
      if (ver === 'V2') { v2Tvl += tvl; v2Vol += vol }
      else if (ver === 'V4') { v4Tvl += tvl; v4Vol += vol }
      else { v3Tvl += tvl; v3Vol += vol } // default to V3
    }
    return {
      dailyProtocolTvl: {
        v2: makeTimestamped(v2Tvl),
        v3: makeTimestamped(v3Tvl),
        v4: makeTimestamped(v4Tvl),
      },
      historicalProtocolVolume: {
        Month: {
          v2: makeTimestamped(v2Vol),
          v3: makeTimestamped(v3Vol),
          v4: makeTimestamped(v4Vol),
        },
      },
    } as any as ProtocolStatsResponse
  }, [exploreStatsData])

  const exploreContext = useMemo(() => {
    return {
      exploreStats: {
        data: exploreStatsData,
        isLoading: exploreStatsLoading,
        error: !!exploreStatsError,
      },
      protocolStats: {
        data: protocolStatsData,
        isLoading: exploreStatsLoading,
        error: false,
      },
    }
  }, [exploreStatsData, exploreStatsError, exploreStatsLoading, protocolStatsData])

  return <ExploreContext.Provider value={exploreContext}>{children}</ExploreContext.Provider>
}
