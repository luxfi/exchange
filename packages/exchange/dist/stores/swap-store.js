import { create } from 'zustand';
import { persist } from 'zustand/middleware';
const initialState = {
    tokenIn: null,
    tokenOut: null,
    amountIn: '',
    amountOut: '',
    independentField: 'input',
    slippageTolerance: 50, // 0.5%
    deadline: 30, // 30 minutes
};
export const useSwapStore = create()(persist((set) => ({
    ...initialState,
    setTokenIn: (token) => set((state) => {
        // If selecting same token as output, switch them
        if (token && state.tokenOut && token.address === state.tokenOut.address) {
            return {
                tokenIn: token,
                tokenOut: state.tokenIn,
            };
        }
        return { tokenIn: token };
    }),
    setTokenOut: (token) => set((state) => {
        // If selecting same token as input, switch them
        if (token && state.tokenIn && token.address === state.tokenIn.address) {
            return {
                tokenOut: token,
                tokenIn: state.tokenOut,
            };
        }
        return { tokenOut: token };
    }),
    setAmountIn: (amount) => set({
        amountIn: amount,
        independentField: 'input',
    }),
    setAmountOut: (amount) => set({
        amountOut: amount,
        independentField: 'output',
    }),
    setIndependentField: (field) => set({ independentField: field }),
    setSlippageTolerance: (tolerance) => set({ slippageTolerance: tolerance }),
    setDeadline: (deadline) => set({ deadline: deadline }),
    switchTokens: () => set((state) => ({
        tokenIn: state.tokenOut,
        tokenOut: state.tokenIn,
        amountIn: state.amountOut,
        amountOut: state.amountIn,
    })),
    reset: () => set(initialState),
}), {
    name: 'swap-storage',
    partialize: (state) => ({
        slippageTolerance: state.slippageTolerance,
        deadline: state.deadline,
    }),
}));
