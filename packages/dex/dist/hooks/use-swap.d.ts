import type { Address } from 'viem';
import type { Quote } from '../router';
interface UseSwapResult {
    swap: (quote: Quote, recipient: Address) => Promise<void>;
    isPending: boolean;
    isConfirming: boolean;
    isSuccess: boolean;
    error: Error | null;
    txHash: `0x${string}` | undefined;
    reset: () => void;
}
/**
 * Hook to execute swaps via the DEX precompiles
 */
export declare function useSwap(): UseSwapResult;
export {};
//# sourceMappingURL=use-swap.d.ts.map