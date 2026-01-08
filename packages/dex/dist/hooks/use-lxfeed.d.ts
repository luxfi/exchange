import type { Address } from 'viem';
import type { LXMarkPrice } from '../precompile/types';
/**
 * Hook to get mark price for a market
 */
export declare function useLXFeedMarkPrice(marketId: number): {
    markPrice: LXMarkPrice | undefined;
    isLoading: boolean;
    error: import("viem").ReadContractErrorType | null;
    refetch: (options?: import("@tanstack/query-core").RefetchOptions) => Promise<import("@tanstack/query-core").QueryObserverResult<{
        indexPxX18: bigint;
        markPxX18: bigint;
        premiumX18: bigint;
        timestamp: bigint;
    }, import("viem").ReadContractErrorType>>;
};
/**
 * Hook to get index price for a market
 */
export declare function useLXFeedIndexPrice(marketId: number): {
    priceX18: bigint | undefined;
    timestamp: bigint | undefined;
    isLoading: boolean;
    error: import("viem").ReadContractErrorType | null;
    refetch: (options?: import("@tanstack/query-core").RefetchOptions) => Promise<import("@tanstack/query-core").QueryObserverResult<readonly [bigint, timestamp: bigint], import("viem").ReadContractErrorType>>;
};
/**
 * Hook to get funding rate for a market
 */
export declare function useLXFeedFundingRate(marketId: number): {
    rateX18: bigint | undefined;
    nextFundingTime: bigint | undefined;
    isLoading: boolean;
    error: import("viem").ReadContractErrorType | null;
    refetch: (options?: import("@tanstack/query-core").RefetchOptions) => Promise<import("@tanstack/query-core").QueryObserverResult<readonly [bigint, bigint], import("viem").ReadContractErrorType>>;
};
/**
 * Hook to get trigger price for stop/take orders
 */
export declare function useLXFeedTriggerPrice(marketId: number, isBuy: boolean): {
    triggerPriceX18: bigint | undefined;
    isLoading: boolean;
    error: import("viem").ReadContractErrorType | null;
    refetch: (options?: import("@tanstack/query-core").RefetchOptions) => Promise<import("@tanstack/query-core").QueryObserverResult<bigint, import("viem").ReadContractErrorType>>;
};
/**
 * Hook to get oracle price for token pair
 */
export declare function useLXOraclePrice(baseToken: Address, quoteToken: Address): {
    price: {
        price: bigint;
        confidence: bigint;
        timestamp: bigint;
        source: number;
        expo: number;
    } | undefined;
    isLoading: boolean;
    error: import("viem").ReadContractErrorType | null;
    refetch: (options?: import("@tanstack/query-core").RefetchOptions) => Promise<import("@tanstack/query-core").QueryObserverResult<{
        price: bigint;
        confidence: bigint;
        timestamp: bigint;
        source: number;
        expo: number;
    }, import("viem").ReadContractErrorType>>;
};
/**
 * Hook to get aggregated oracle price with deviation info
 */
export declare function useLXOracleAggregatedPrice(baseToken: Address, quoteToken: Address, maxStaleness?: bigint): {
    aggregated: {
        price: bigint;
        minPrice: bigint;
        maxPrice: bigint;
        deviation: bigint;
        numSources: bigint;
        timestamp: bigint;
    } | undefined;
    isLoading: boolean;
    error: import("viem").ReadContractErrorType | null;
    refetch: (options?: import("@tanstack/query-core").RefetchOptions) => Promise<import("@tanstack/query-core").QueryObserverResult<{
        price: bigint;
        minPrice: bigint;
        maxPrice: bigint;
        deviation: bigint;
        numSources: bigint;
        timestamp: bigint;
    }, import("viem").ReadContractErrorType>>;
};
/**
 * Hook to check if oracle price is fresh
 */
export declare function useLXOraclePriceFresh(baseToken: Address, quoteToken: Address, maxStaleness?: bigint): {
    isFresh: boolean | undefined;
    isLoading: boolean;
    error: import("viem").ReadContractErrorType | null;
    refetch: (options?: import("@tanstack/query-core").RefetchOptions) => Promise<import("@tanstack/query-core").QueryObserverResult<boolean, import("viem").ReadContractErrorType>>;
};
/**
 * Combined hook for market price data
 */
export declare function useLXMarketPrices(marketId: number): {
    markPrice: LXMarkPrice | undefined;
    indexPrice: bigint | undefined;
    fundingRate: bigint | undefined;
    nextFundingTime: bigint | undefined;
    isLoading: boolean;
    error: import("viem").ReadContractErrorType | null;
    refetch: () => void;
};
//# sourceMappingURL=use-lxfeed.d.ts.map