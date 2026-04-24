import { useDispatch } from 'react-redux'
import { updateDelegatedState } from '@l.x/lx/src/features/smartWallet/delegation/slice'
import { useEvent } from '@l.x/utils/src/react/hooks'

export function useUpdateDelegatedState(): (input: { chainId: string; address: string }) => void {
  const dispatch = useDispatch()
  return useEvent((input: { chainId: string; address: string }) => {
    dispatch(updateDelegatedState(input))
  })
}
