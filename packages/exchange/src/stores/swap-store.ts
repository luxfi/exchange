import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Token } from '../tokens'

export type SwapField = 'input' | 'output'

export interface SwapState {
  // Tokens
  tokenIn: Token | null
  tokenOut: Token | null

  // Amounts (as strings for input fields)
  amountIn: string
  amountOut: string

  // Which field is being typed in
  independentField: SwapField

  // Slippage tolerance (in basis points, e.g., 50 = 0.5%)
  slippageTolerance: number

  // Transaction deadline (in minutes)
  deadline: number

  // Actions
  setTokenIn: (token: Token | null) => void
  setTokenOut: (token: Token | null) => void
  setAmountIn: (amount: string) => void
  setAmountOut: (amount: string) => void
  setIndependentField: (field: SwapField) => void
  setSlippageTolerance: (tolerance: number) => void
  setDeadline: (deadline: number) => void
  switchTokens: () => void
  reset: () => void
}

const initialState = {
  tokenIn: null,
  tokenOut: null,
  amountIn: '',
  amountOut: '',
  independentField: 'input' as SwapField,
  slippageTolerance: 50, // 0.5%
  deadline: 30, // 30 minutes
}

export const useSwapStore = create<SwapState>()(
  persist(
    (set) => ({
      ...initialState,

      setTokenIn: (token) =>
        set((state) => {
          // If selecting same token as output, switch them
          if (token && state.tokenOut && token.address === state.tokenOut.address) {
            return {
              tokenIn: token,
              tokenOut: state.tokenIn,
            }
          }
          return { tokenIn: token }
        }),

      setTokenOut: (token) =>
        set((state) => {
          // If selecting same token as input, switch them
          if (token && state.tokenIn && token.address === state.tokenIn.address) {
            return {
              tokenOut: token,
              tokenIn: state.tokenOut,
            }
          }
          return { tokenOut: token }
        }),

      setAmountIn: (amount) =>
        set({
          amountIn: amount,
          independentField: 'input',
        }),

      setAmountOut: (amount) =>
        set({
          amountOut: amount,
          independentField: 'output',
        }),

      setIndependentField: (field) => set({ independentField: field }),

      setSlippageTolerance: (tolerance) => set({ slippageTolerance: tolerance }),

      setDeadline: (deadline) => set({ deadline: deadline }),

      switchTokens: () =>
        set((state) => ({
          tokenIn: state.tokenOut,
          tokenOut: state.tokenIn,
          amountIn: state.amountOut,
          amountOut: state.amountIn,
        })),

      reset: () => set(initialState),
    }),
    {
      name: 'swap-storage',
      partialize: (state) => ({
        slippageTolerance: state.slippageTolerance,
        deadline: state.deadline,
      }),
    }
  )
)
