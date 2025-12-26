import type { Address } from 'viem';
/**
 * Hook to get native token balance
 */
export declare function useNativeBalance(address: Address | undefined, chainId?: number): {
    balance: bigint;
    formatted: string;
    symbol: string;
    decimals: number;
    isLoading: boolean;
    error: import("viem").GetBalanceErrorType | null;
    refetch: (options?: import("@tanstack/react-query").RefetchOptions) => Promise<import("@tanstack/react-query").QueryObserverResult<{
        decimals: number;
        symbol: string;
        value: bigint;
    }, import("viem").GetBalanceErrorType>>;
};
export interface TokenBalance {
    token: Address;
    balance: bigint;
}
export interface TokenBalancesResult {
    balances: TokenBalance[];
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
}
/**
 * Hook to get multiple token balances
 */
export declare function useTokenBalances(address: Address | undefined, tokens: Address[], chainId?: number): TokenBalancesResult;
/**
 * Hook to get core token balances (WLUX, LETH, LBTC, LUSD)
 * Only available on mainnet - testnet uses different tokens
 */
export declare function useCoreTokenBalances(address: Address | undefined, chainId?: number): TokenBalancesResult;
//# sourceMappingURL=use-balances.d.ts.map