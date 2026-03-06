import { ExploreStatsResponse, ProtocolStatsResponse } from '@luxdex/client-explore/dist/uniswap/explore/v1/service_pb'
import { createContext, useMemo } from 'react'
import { useIsSupportedChainId } from 'lx/src/features/chains/hooks/useSupportedChainId'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { useExchangeStats } from './useLxdExploreStats'

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

  // Use our exchange stats provider (CoinGecko + DeFi Llama + LXD Gateway)
  const {
    data: exploreStatsData,
    isLoading: exploreStatsLoading,
    error: exploreStatsError,
  } = useExchangeStats(isSupportedChain ? chainId : undefined)

  const exploreContext = useMemo(() => {
    return {
      exploreStats: {
        data: exploreStatsData,
        isLoading: exploreStatsLoading,
        error: !!exploreStatsError,
      },
      protocolStats: {
        data: undefined,
        isLoading: false,
        error: false,
      },
    }
  }, [exploreStatsData, exploreStatsError, exploreStatsLoading])

  return <ExploreContext.Provider value={exploreContext}>{children}</ExploreContext.Provider>
}
