import { useDispatch } from 'react-redux'
import { useEvent } from '@luxfi/utilities/src/react/hooks'
import { authActions } from '@luxfi/wallet/src/features/auth/saga'
import { AuthActionType } from '@luxfi/wallet/src/features/auth/types'

export function useUnlockWithPassword(): (params: { password: string }) => void {
  const dispatch = useDispatch()

  return useEvent(({ password }: { password: string }) => {
    dispatch(
      authActions.trigger({
        type: AuthActionType.Unlock,
        password,
      }),
    )
  })
}
