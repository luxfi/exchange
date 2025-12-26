import type { Token } from '../tokens';
export type SwapField = 'input' | 'output';
export interface SwapState {
    tokenIn: Token | null;
    tokenOut: Token | null;
    amountIn: string;
    amountOut: string;
    independentField: SwapField;
    slippageTolerance: number;
    deadline: number;
    setTokenIn: (token: Token | null) => void;
    setTokenOut: (token: Token | null) => void;
    setAmountIn: (amount: string) => void;
    setAmountOut: (amount: string) => void;
    setIndependentField: (field: SwapField) => void;
    setSlippageTolerance: (tolerance: number) => void;
    setDeadline: (deadline: number) => void;
    switchTokens: () => void;
    reset: () => void;
}
export declare const useSwapStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<SwapState>, "setState" | "persist"> & {
    setState(partial: SwapState | Partial<SwapState> | ((state: SwapState) => SwapState | Partial<SwapState>), replace?: false | undefined): unknown;
    setState(state: SwapState | ((state: SwapState) => SwapState), replace: true): unknown;
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<SwapState, {
            slippageTolerance: number;
            deadline: number;
        }, unknown>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: SwapState) => void) => () => void;
        onFinishHydration: (fn: (state: SwapState) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<SwapState, {
            slippageTolerance: number;
            deadline: number;
        }, unknown>>;
    };
}>;
//# sourceMappingURL=swap-store.d.ts.map