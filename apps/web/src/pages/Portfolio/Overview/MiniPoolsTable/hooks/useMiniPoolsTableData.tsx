import { PositionStatus, ProtocolVersion } from '@luxamm/client-data-api/dist/data/v1/poolTypes_pb'
import { useMemo } from 'react'
import { useGetPositionsQuery } from 'lx/src/data/rest/getPositions'
import { useEnabledChains } from 'lx/src/features/chains/hooks/useEnabledChains'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { usePositionVisibilityCheck } from 'lx/src/features/visibility/hooks/usePositionVisibilityCheck'
import { PositionInfo } from '~/components/Liquidity/types'
import { parseRestPosition } from '~/components/Liquidity/utils/parseFromRest'
import { usePendingLPTransactionsChangeListener } from '~/state/transactions/hooks'

interface UseMiniPoolsTableDataParams {
  account: string
  maxPools?: number
  chainId?: UniverseChainId
}

export function useMiniPoolsTableData({ account, maxPools = 5, chainId }: UseMiniPoolsTableDataParams): {
  positions: PositionInfo[]
  showLoading: boolean
  hasNoData: boolean
} {
  const { chains } = useEnabledChains()
  const isPositionVisible = usePositionVisibilityCheck()

  // Positions are EVM-only (LX V2/V3/V4), so skip if no EVM address
  const skipQuery = !account

  const { data, isLoading, refetch } = useGetPositionsQuery(
    {
      address: account,
      chainIds: chainId ? [chainId] : chains,
      positionStatuses: [PositionStatus.IN_RANGE, PositionStatus.OUT_OF_RANGE],
      protocolVersions: [ProtocolVersion.V2, ProtocolVersion.V3, ProtocolVersion.V4],
      includeHidden: false,
    },
    skipQuery,
  )

  usePendingLPTransactionsChangeListener(refetch)

  // Parse and limit the number of positions displayed
  const positions = useMemo(() => {
    if (!data?.positions) {
      return []
    }

    const parsed = data.positions.map(parseRestPosition).filter((p): p is PositionInfo => p !== undefined)
    const visible = parsed.filter((position) =>
      isPositionVisible({
        poolId: position.poolId,
        tokenId: position.tokenId,
        chainId: position.chainId,
        isFlaggedSpam: position.isHidden,
      }),
    )
    return visible.slice(0, maxPools)
  }, [data?.positions, maxPools, isPositionVisible])

  const showLoading = isLoading && positions.length === 0
  const hasNoData = positions.length === 0 && !isLoading

  return { positions, showLoading, hasNoData }
}
