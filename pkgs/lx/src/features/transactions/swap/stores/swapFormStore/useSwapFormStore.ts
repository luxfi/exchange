import { useContext } from 'react'
import type { SwapFormStore } from '@l.x/lx/src/features/transactions/swap/stores/swapFormStore/createSwapFormStore'
import { SwapFormStoreContext } from '@l.x/lx/src/features/transactions/swap/stores/swapFormStore/SwapFormStoreContext'
import type { SwapFormStoreState } from '@l.x/lx/src/features/transactions/swap/stores/swapFormStore/types'
import type { DerivedSwapInfo } from '@l.x/lx/src/features/transactions/swap/types/derivedSwapInfo'
import { useEvent } from '@l.x/utils/src/react/hooks'
import { useStore } from 'zustand'
import { useShallow } from 'zustand/shallow'

export const useSwapFormStoreBase = (): SwapFormStore => {
  const store = useContext(SwapFormStoreContext)

  if (!store) {
    throw new Error('useSwapFormStore must be used within SwapFormStoreContextProvider')
  }

  return store
}

export const useSwapFormStore = <T>(selector: (state: Omit<SwapFormStoreState, 'actions'>) => T): T => {
  const store = useSwapFormStoreBase()

  return useStore(store, useShallow(selector))
}

export const useSwapFormStoreDerivedSwapInfo = <U>(selector: (state: DerivedSwapInfo) => U): U => {
  const selectDerived = useEvent((state: Omit<SwapFormStoreState, 'actions'>) => selector(state.derivedSwapInfo))

  return useSwapFormStore(selectDerived)
}

/**
 * Actions hook to access swap form store actions
 */
export const useSwapFormStoreActions = (): SwapFormStoreState['actions'] => {
  const store = useSwapFormStoreBase()

  return useStore(
    store,
    useShallow((s) => s.actions),
  )
}
