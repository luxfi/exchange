import { createContext } from 'react'
import type { SwapFormWarningStore } from 'lx/src/features/transactions/swap/form/stores/swapFormWarningStore/createSwapFormWarningStore'

export const SwapFormWarningStoreContext = createContext<SwapFormWarningStore | null>(null)
