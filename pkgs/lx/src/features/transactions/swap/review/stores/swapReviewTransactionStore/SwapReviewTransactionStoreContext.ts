import { createContext } from 'react'
import type { createSwapReviewTransactionStore } from 'lx/src/features/transactions/swap/review/stores/swapReviewTransactionStore/createSwapReviewTransactionStore'

export const SwapReviewTransactionStoreContext = createContext<ReturnType<
  typeof createSwapReviewTransactionStore
> | null>(null)
