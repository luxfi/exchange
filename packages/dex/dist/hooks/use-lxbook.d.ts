import { type LXAction, type LXL1, TIF } from '../precompile/types';
/**
 * Hook to get L1 (best bid/ask) for a market
 */
export declare function useLXBookL1(marketId: number): {
    l1: LXL1 | undefined;
    isLoading: boolean;
    error: import("viem").ReadContractErrorType | null;
    refetch: (options?: import("@tanstack/query-core").RefetchOptions) => Promise<import("@tanstack/query-core").QueryObserverResult<{
        bestBidPxX18: bigint;
        bestBidSzX18: bigint;
        bestAskPxX18: bigint;
        bestAskSzX18: bigint;
        lastTradePxX18: bigint;
    }, import("viem").ReadContractErrorType>>;
};
/**
 * Hook to get market config
 */
export declare function useLXBookMarket(marketId: number): {
    config: {
        baseAsset: `0x${string}`;
        quoteAsset: `0x${string}`;
        tickSizeX18: bigint;
        lotSizeX18: bigint;
        makerFeePpm: number;
        takerFeePpm: number;
        feedId: `0x${string}`;
        initialStatus: number;
    } | undefined;
    isLoading: boolean;
    error: import("viem").ReadContractErrorType | null;
};
/**
 * Hook to get market status
 */
export declare function useLXBookMarketStatus(marketId: number): {
    status: number | undefined;
    isLoading: boolean;
    error: import("viem").ReadContractErrorType | null;
};
interface UseLXBookExecuteResult {
    execute: (action: LXAction) => void;
    executeBatch: (actions: LXAction[]) => void;
    hash: `0x${string}` | undefined;
    isPending: boolean;
    isConfirming: boolean;
    isSuccess: boolean;
    error: Error | null;
}
/**
 * Hook for placing orders via LXBook execute()
 */
export declare function useLXBookExecute(): UseLXBookExecuteResult;
interface UseLXBookPlaceOrderResult {
    placeOrder: (params: {
        marketId: number;
        isBuy: boolean;
        size: bigint;
        price: bigint;
        tif?: TIF;
        reduceOnly?: boolean;
        cloid?: `0x${string}`;
    }) => void;
    placeMarketOrder: (params: {
        marketId: number;
        isBuy: boolean;
        size: bigint;
        reduceOnly?: boolean;
    }) => void;
    hash: `0x${string}` | undefined;
    isPending: boolean;
    isConfirming: boolean;
    isSuccess: boolean;
    error: Error | null;
}
/**
 * Hook for placing limit orders
 */
export declare function useLXBookPlaceOrder(): UseLXBookPlaceOrderResult;
interface UseLXBookCancelOrderResult {
    cancelByOid: (oid: bigint) => void;
    cancelByCloid: (cloid: `0x${string}`) => void;
    hash: `0x${string}` | undefined;
    isPending: boolean;
    isConfirming: boolean;
    isSuccess: boolean;
    error: Error | null;
}
/**
 * Hook for canceling orders
 */
export declare function useLXBookCancelOrder(): UseLXBookCancelOrderResult;
export {};
//# sourceMappingURL=use-lxbook.d.ts.map