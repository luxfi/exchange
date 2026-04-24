import type { SwapTxAndGasInfo } from '@l.x/lx/src/features/transactions/swap/types/swapTxAndGasInfo'
import { isDevEnv } from '@l.x/utils/src/environment/env'
import { logContextUpdate } from '@l.x/utils/src/logger/contextEnhancer'
import type { StoreApi, UseBoundStore } from 'zustand'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type SwapTxStoreState = SwapTxAndGasInfo

export type SwapTxStore = UseBoundStore<StoreApi<SwapTxStoreState>>

export const createSwapTxStore = (
  initialState: SwapTxStoreState,
): {
  store: SwapTxStore
  cleanup: () => void
} => {
  const store = create<SwapTxStoreState>()(
    devtools(() => initialState, {
      name: 'useSwapTxStore',
      enabled: isDevEnv(),
      trace: true,
      traceLimit: 25,
    }),
  )

  // TODO: how do we want to refactor this?
  const cleanup = store.subscribe((state) => {
    logContextUpdate('SwapTxContext', state)
  })

  return { store, cleanup }
}
