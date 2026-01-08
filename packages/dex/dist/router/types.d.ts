/**
 * Router Types
 * Types for hybrid CLOB + AMM routing
 */
import type { Address } from 'viem';
/**
 * Route source - where liquidity comes from
 */
export type RouteSource = 'clob' | 'amm' | 'hybrid';
/**
 * Quote request
 */
export interface QuoteRequest {
    tokenIn: Address;
    tokenOut: Address;
    amountIn: bigint;
    slippageTolerance?: number;
    preferredSource?: RouteSource;
}
/**
 * Route step
 */
export interface RouteStep {
    source: RouteSource;
    tokenIn: Address;
    tokenOut: Address;
    amountIn: bigint;
    amountOut: bigint;
    pool?: Address;
    symbol?: string;
    fee: bigint;
    priceImpact: number;
}
/**
 * Quote response
 */
export interface Quote {
    tokenIn: Address;
    tokenOut: Address;
    amountIn: bigint;
    amountOut: bigint;
    minimumAmountOut: bigint;
    route: RouteStep[];
    priceImpact: number;
    estimatedGas: bigint;
    validUntil: number;
}
/**
 * Swap request
 */
export interface SwapRequest {
    quote: Quote;
    recipient: Address;
    deadline?: number;
}
/**
 * Swap result
 */
export interface SwapResult {
    txHash: `0x${string}`;
    amountIn: bigint;
    amountOut: bigint;
    route: RouteStep[];
}
/**
 * Router configuration
 */
export interface RouterConfig {
    clobUrl?: string;
    clobEnabled?: boolean;
    ammEnabled?: boolean;
    maxHops?: number;
    preferCLOB?: boolean;
    hybridEnabled?: boolean;
}
//# sourceMappingURL=types.d.ts.map