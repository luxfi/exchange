import { createContext } from 'react'
import type { SwapReviewWarningStore } from 'lx/src/features/transactions/swap/review/stores/swapReviewWarningStore/createSwapReviewWarningStore'

export const SwapReviewWarningStoreContext = createContext<SwapReviewWarningStore | null>(null)
