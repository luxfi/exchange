import { useSelector } from 'react-redux'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { selectPositionsVisibility } from 'lx/src/features/visibility/selectors'
import { getUniquePositionId } from 'lx/src/features/visibility/utils'
import { UniswapRootState } from 'lx/src/state'

type VisibilityCheckParams = {
  poolId: string
  tokenId: string | undefined
  chainId: UniverseChainId
  isFlaggedSpam?: boolean
}

export function usePositionVisibilityCheck(): (params: VisibilityCheckParams) => boolean {
  const positionVisibilities = useSelector((state: UniswapRootState) => selectPositionsVisibility(state))

  const isPositionVisible = ({ poolId, tokenId, chainId, isFlaggedSpam = false }: VisibilityCheckParams): boolean => {
    const positionId = getUniquePositionId({ poolId, tokenId, chainId })
    const positionState = positionVisibilities[positionId]

    if (positionState === undefined) {
      // If undefined, default to visible unless flagged as spam by the API (i.e. the isHidden property on Position)
      return !isFlaggedSpam
    }

    // Return the explicitly set visibility
    return positionState.isVisible
  }

  return isPositionVisible
}
