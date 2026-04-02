import type { Address } from 'viem';
/**
 * Hook to get mark price for a market
 */
export declare function useLXFeedMarkPrice(marketId: number): any;
/**
 * Hook to get index price for a market
 */
export declare function useLXFeedIndexPrice(marketId: number): any;
/**
 * Hook to get funding rate for a market
 */
export declare function useLXFeedFundingRate(marketId: number): any;
/**
 * Hook to get trigger price for stop/take orders
 */
export declare function useLXFeedTriggerPrice(marketId: number, isBuy: boolean): any;
/**
 * Hook to get oracle price for token pair
 */
export declare function useLXOraclePrice(baseToken: Address, quoteToken: Address): any;
/**
 * Hook to get aggregated oracle price with deviation info
 */
export declare function useLXOracleAggregatedPrice(baseToken: Address, quoteToken: Address, maxStaleness?: bigint): any;
/**
 * Hook to check if oracle price is fresh
 */
export declare function useLXOraclePriceFresh(baseToken: Address, quoteToken: Address, maxStaleness?: bigint): any;
/**
 * Combined hook for market price data
 */
export declare function useLXMarketPrices(marketId: number): {
    markPrice: any;
    indexPrice: any;
    fundingRate: any;
    nextFundingTime: any;
    isLoading: any;
    error: any;
    refetch: () => void;
};
//# sourceMappingURL=use-lxfeed.d.ts.map