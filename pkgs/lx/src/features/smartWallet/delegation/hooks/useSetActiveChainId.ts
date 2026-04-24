import { useDispatch } from 'react-redux'
import { type UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { setActiveChainId } from '@l.x/lx/src/features/smartWallet/delegation/slice'
import { useEvent } from '@l.x/utils/src/react/hooks'

export function useSetActiveChainId(): (chainId?: UniverseChainId) => void {
  const dispatch = useDispatch()
  return useEvent((chainId?: UniverseChainId) => {
    dispatch(setActiveChainId({ chainId }))
  })
}
