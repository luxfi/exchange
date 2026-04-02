import type { Address } from 'viem';
export interface Pool {
    address: Address;
    token0: Address;
    token1: Address;
    fee: number;
    tickSpacing: number;
    liquidity: bigint;
    sqrtPriceX96: bigint;
    tick: number;
}
/**
 * Hook to get pool information
 */
export declare function usePool(token0: Address | undefined, token1: Address | undefined, fee: number, chainId: number): import("@tanstack/react-query").UseQueryResult<Pool | null, Error>;
/**
 * Hook to get all pools for a token pair
 */
export declare function usePools(token0: Address | undefined, token1: Address | undefined, chainId: number): {
    pools: Pool[];
    isLoading: boolean;
    bestPool: Pool | null;
};
//# sourceMappingURL=use-pools.d.ts.map