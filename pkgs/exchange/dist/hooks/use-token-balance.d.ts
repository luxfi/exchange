import type { Token } from '../tokens';
import type { Address } from 'viem';
/**
 * Hook to get token balance for an address
 */
export declare function useTokenBalance(token: Token | null, address: Address | undefined, chainId: number): {
    balance: bigint;
    formatted: string;
    isLoading: boolean;
    error: import("viem").GetBalanceErrorType | null;
} | {
    balance: bigint;
    formatted: string;
    isLoading: boolean;
    error: import("viem").ReadContractErrorType | null;
};
//# sourceMappingURL=use-token-balance.d.ts.map