import type { Token } from '../tokens';
import type { Address } from 'viem';
/**
 * Hook to check and manage token allowance
 */
export declare function useTokenAllowance(token: Token | null, owner: Address | undefined, spender: Address | undefined, chainId: number): {
    allowance: bigint;
    isApproved: boolean;
    approve: (amount?: bigint) => Promise<`0x${string}` | undefined>;
    isPending: boolean;
    isConfirming: boolean;
    isSuccess: boolean;
    refetch?: undefined;
} | {
    allowance: bigint;
    isApproved: boolean;
    approve: (amount?: bigint) => Promise<`0x${string}` | undefined>;
    isPending: boolean;
    isConfirming: boolean;
    isSuccess: boolean;
    refetch: (options?: import("@tanstack/query-core").RefetchOptions) => Promise<import("@tanstack/query-core").QueryObserverResult<bigint, import("viem").ReadContractErrorType>>;
};
/**
 * Check if approval is needed for a specific amount
 */
export declare function needsApproval(allowance: bigint, amount: bigint): boolean;
//# sourceMappingURL=use-token-allowance.d.ts.map