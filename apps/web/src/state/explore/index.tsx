import { ExploreStatsResponse, ProtocolStatsResponse } from '@luxdex/client-explore/dist/uniswap/explore/v1/service_pb'
import { ALL_NETWORKS_ARG } from '@luxfi/api'
import { createContext, useMemo } from 'react'
import { useExploreStatsQuery } from 'lx/src/data/rest/exploreStats'
import { isLxdChain } from 'lx/src/data/rest/lxdGateway'
import { useProtocolStatsQuery } from 'lx/src/data/rest/protocolStats'
import { useIsSupportedChainId } from 'lx/src/features/chains/hooks/useSupportedChainId'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { useLxdExploreStats } from './useLxdExploreStats'

interface QueryResult<T> {
  data?: T
  isLoading: boolean
  error: boolean
}

/**
 * ExploreContextType
 * @property exploreStatsData - Data for the Explore Tokens and Pools table
 * @property protocolStatsData - Data for the Protocol Stats Graphs
 */
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
  const useLxd = chainId && isLxdChain(chainId)

  // Standard Uniswap backend query (disabled for LXD chains)
  const {
    data: uniswapStatsData,
    isLoading: uniswapStatsLoading,
    error: uniswapStatsError,
  } = useExploreStatsQuery<ExploreStatsResponse>({
    input: { chainId: isSupportedChain ? chainId.toString() : ALL_NETWORKS_ARG },
    enabled: !useLxd,
  })

  // LXD Gateway query (enabled only for Lux/Zoo chains)
  const {
    data: lxdStatsData,
    isLoading: lxdStatsLoading,
    error: lxdStatsError,
  } = useLxdExploreStats(chainId)

  const {
    data: protocolStatsData,
    isLoading: protocolStatsLoading,
    error: protocolStatsError,
  } = useProtocolStatsQuery({
    chainId: isSupportedChain ? chainId.toString() : ALL_NETWORKS_ARG,
  })

  // Use LXD data for Lux/Zoo chains, Uniswap data for others
  const exploreStatsData = useLxd ? lxdStatsData : uniswapStatsData
  const exploreStatsLoading = useLxd ? lxdStatsLoading : uniswapStatsLoading
  const exploreStatsError = useLxd ? lxdStatsError : uniswapStatsError

  const exploreContext = useMemo(() => {
    return {
      exploreStats: {
        data: exploreStatsData,
        isLoading: exploreStatsLoading,
        error: !!exploreStatsError,
      },
      protocolStats: {
        data: protocolStatsData,
        isLoading: protocolStatsLoading,
        error: !!protocolStatsError,
      },
    }
  }, [
    exploreStatsData,
    exploreStatsError,
    exploreStatsLoading,
    protocolStatsData,
    protocolStatsError,
    protocolStatsLoading,
  ])
  return <ExploreContext.Provider value={exploreContext}>{children}</ExploreContext.Provider>
}
