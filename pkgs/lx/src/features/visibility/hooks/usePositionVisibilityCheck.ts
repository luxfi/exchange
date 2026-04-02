import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { selectPositionsVisibility } from '@l.x/lx/src/features/visibility/selectors'
import { getUniquePositionId } from '@l.x/lx/src/features/visibility/utils'
import { LuxRootState } from '@l.x/lx/src/state'

type VisibilityCheckParams = {
  poolId: string
  tokenId: string | undefined
  chainId: UniverseChainId
  isFlaggedSpam?: boolean
}

export function usePositionVisibilityCheck(): (params: VisibilityCheckParams) => boolean {
  const positionVisibilities = useSelector((state: LuxRootState) => selectPositionsVisibility(state))

  const isPositionVisible = useCallback(
    ({ poolId, tokenId, chainId, isFlaggedSpam = false }: VisibilityCheckParams): boolean => {
      const positionId = getUniquePositionId({ poolId, tokenId, chainId })
      const positionState = positionVisibilities[positionId]

      if (positionState === undefined) {
        // If undefined, default to visible unless flagged as spam by the API (i.e. the isHidden property on Position)
        return !isFlaggedSpam
      }

      return positionState.isVisible
    },
    [positionVisibilities],
  )

  return isPositionVisible
}
