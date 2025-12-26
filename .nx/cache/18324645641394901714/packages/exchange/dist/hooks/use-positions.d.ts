import type { Address } from 'viem';
export interface Position {
    tokenId: bigint;
    token0: Address;
    token1: Address;
    fee: number;
    tickLower: number;
    tickUpper: number;
    liquidity: bigint;
    tokensOwed0: bigint;
    tokensOwed1: bigint;
}
/**
 * Hook to get user's liquidity positions
 */
export declare function usePositions(owner: Address | undefined, chainId: number): import("@tanstack/react-query").UseQueryResult<Position[], Error>;
//# sourceMappingURL=use-positions.d.ts.map