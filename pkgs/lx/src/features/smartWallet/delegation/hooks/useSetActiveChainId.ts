import { useDispatch } from 'react-redux'
import { type UniverseChainId } from 'lx/src/features/chains/types'
import { setActiveChainId } from 'lx/src/features/smartWallet/delegation/slice'
import { useEvent } from 'utilities/src/react/hooks'

export function useSetActiveChainId(): (chainId?: UniverseChainId) => void {
  const dispatch = useDispatch()
  return useEvent((chainId?: UniverseChainId) => {
    dispatch(setActiveChainId({ chainId }))
  })
}
