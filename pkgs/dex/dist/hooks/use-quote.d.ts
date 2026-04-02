import type { Address } from 'viem';
import { type Quote } from '../router';
interface UseQuoteOptions {
    refreshInterval?: number;
    enabled?: boolean;
}
interface UseQuoteResult {
    quote: Quote | null;
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}
/**
 * Hook to get swap quotes from the omnichain router
 */
export declare function useQuote(tokenIn: Address | undefined, tokenOut: Address | undefined, amountIn: bigint | undefined, options?: UseQuoteOptions): UseQuoteResult;
export {};
//# sourceMappingURL=use-quote.d.ts.map