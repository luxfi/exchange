import { useMemo } from 'react'
import { getDelegationService } from 'lx/src/domains/services'
import { type DelegationService } from 'lx/src/features/smartWallet/delegation/delegation'
import { useUpdateDelegatedState } from 'lx/src/features/smartWallet/delegation/hooks/useUpdateDelegateState'

export function useDelegationService(): DelegationService {
  const updateDelegatedState = useUpdateDelegatedState()
  return useMemo(() => {
    return getDelegationService({
      onDelegationDetected: (payload) => {
        // update redux state
        updateDelegatedState({
          chainId: String(payload.chainId),
          address: payload.address,
        })
      },
    })
  }, [updateDelegatedState])
}
