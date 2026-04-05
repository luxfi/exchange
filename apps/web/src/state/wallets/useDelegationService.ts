import { useMemo } from 'react'
<<<<<<< HEAD
import { getDelegationService } from '@l.x/lx/src/domains/services'
import { type DelegationService } from '@l.x/lx/src/features/smartWallet/delegation/delegation'
import { useUpdateDelegatedState } from '@l.x/lx/src/features/smartWallet/delegation/hooks/useUpdateDelegateState'
=======
import { getDelegationService } from 'uniswap/src/domains/services'
import { type DelegationService } from 'uniswap/src/features/smartWallet/delegation/delegation'
import { useUpdateDelegatedState } from 'uniswap/src/features/smartWallet/delegation/hooks/useUpdateDelegateState'
>>>>>>> upstream/main

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
