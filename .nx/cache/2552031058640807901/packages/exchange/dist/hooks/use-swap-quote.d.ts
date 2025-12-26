import type { Token } from '../tokens';
export interface SwapQuote {
    amountIn: bigint;
    amountOut: bigint;
    priceImpact: number;
    route: Token[];
    gasEstimate: bigint;
}
export interface UseSwapQuoteParams {
    tokenIn: Token | null;
    tokenOut: Token | null;
    amountIn: bigint;
    chainId: number;
}
/**
 * Hook to get swap quote from V3 Quoter
 */
export declare function useSwapQuote({ tokenIn, tokenOut, amountIn, chainId, }: UseSwapQuoteParams): import("@tanstack/react-query").UseQueryResult<SwapQuote | null, Error>;
//# sourceMappingURL=use-swap-quote.d.ts.map