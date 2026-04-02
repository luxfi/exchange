import type { Token } from '../tokens';
export interface SwapRequest {
    tokenIn: Token;
    tokenOut: Token;
    amountIn: bigint;
    amountOutMinimum: bigint;
    recipient: `0x${string}`;
    deadline: bigint;
    chainId: number;
}
/**
 * Hook to execute a swap transaction
 */
export declare function useSwap(): {
    swap: import("@tanstack/react-query").UseMutateAsyncFunction<`0x${string}`, Error, SwapRequest, unknown>;
    hash: `0x${string}` | undefined;
    isPending: boolean;
    isConfirming: boolean;
    isSuccess: boolean;
    error: Error | null;
};
//# sourceMappingURL=use-swap.d.ts.map