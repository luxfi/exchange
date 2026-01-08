import type { Address } from 'viem';
import type { LXPosition, LXMarginInfo } from '../precompile/types';
/**
 * Hook to get token balance in vault
 */
export declare function useLXVaultBalance(token: Address, subaccountId?: number): {
    balance: bigint | undefined;
    isLoading: boolean;
    error: import("viem").ReadContractErrorType | null;
    refetch: (options?: import("@tanstack/query-core").RefetchOptions) => Promise<import("@tanstack/query-core").QueryObserverResult<bigint, import("viem").ReadContractErrorType>>;
};
/**
 * Hook to get position for a market
 */
export declare function useLXVaultPosition(marketId: number, subaccountId?: number): {
    position: LXPosition | undefined;
    isLoading: boolean;
    error: import("viem").ReadContractErrorType | null;
    refetch: (options?: import("@tanstack/query-core").RefetchOptions) => Promise<import("@tanstack/query-core").QueryObserverResult<{
        marketId: number;
        side: number;
        sizeX18: bigint;
        entryPxX18: bigint;
        unrealizedPnlX18: bigint;
        accumulatedFundingX18: bigint;
        lastFundingTime: bigint;
    }, import("viem").ReadContractErrorType>>;
};
/**
 * Hook to get margin info (free margin, used margin, etc.)
 */
export declare function useLXVaultMargin(subaccountId?: number): {
    margin: LXMarginInfo | undefined;
    isLoading: boolean;
    error: import("viem").ReadContractErrorType | null;
    refetch: (options?: import("@tanstack/query-core").RefetchOptions) => Promise<import("@tanstack/query-core").QueryObserverResult<{
        totalCollateralX18: bigint;
        usedMarginX18: bigint;
        freeMarginX18: bigint;
        marginRatioX18: bigint;
        maintenanceMarginX18: bigint;
        liquidatable: boolean;
    }, import("viem").ReadContractErrorType>>;
};
/**
 * Hook to check if account is liquidatable
 */
export declare function useLXVaultLiquidatable(account?: Address, subaccountId?: number): {
    liquidatable: boolean | undefined;
    shortfall: bigint | undefined;
    isLoading: boolean;
    error: import("viem").ReadContractErrorType | null;
    refetch: (options?: import("@tanstack/query-core").RefetchOptions) => Promise<import("@tanstack/query-core").QueryObserverResult<readonly [boolean, bigint], import("viem").ReadContractErrorType>>;
};
/**
 * Hook to get funding rate for a market
 */
export declare function useLXVaultFundingRate(marketId: number): {
    rateX18: bigint | undefined;
    nextFundingTime: bigint | undefined;
    isLoading: boolean;
    error: import("viem").ReadContractErrorType | null;
    refetch: (options?: import("@tanstack/query-core").RefetchOptions) => Promise<import("@tanstack/query-core").QueryObserverResult<readonly [bigint, bigint], import("viem").ReadContractErrorType>>;
};
interface UseLXVaultDepositResult {
    deposit: (token: Address, amount: bigint, subaccountId?: number) => void;
    hash: `0x${string}` | undefined;
    isPending: boolean;
    isConfirming: boolean;
    isSuccess: boolean;
    error: Error | null;
}
/**
 * Hook for depositing tokens into vault
 */
export declare function useLXVaultDeposit(): UseLXVaultDepositResult;
interface UseLXVaultWithdrawResult {
    withdraw: (token: Address, amount: bigint, subaccountId?: number) => void;
    hash: `0x${string}` | undefined;
    isPending: boolean;
    isConfirming: boolean;
    isSuccess: boolean;
    error: Error | null;
}
/**
 * Hook for withdrawing tokens from vault
 */
export declare function useLXVaultWithdraw(): UseLXVaultWithdrawResult;
interface UseLXVaultTransferResult {
    transfer: (token: Address, amount: bigint, fromSubaccount: number, toSubaccount: number) => void;
    hash: `0x${string}` | undefined;
    isPending: boolean;
    isConfirming: boolean;
    isSuccess: boolean;
    error: Error | null;
}
/**
 * Hook for transferring between subaccounts
 */
export declare function useLXVaultTransfer(): UseLXVaultTransferResult;
interface UseLXVaultLiquidateResult {
    liquidate: (targetAccount: Address, targetSubaccount: number, marketId: number, sizeX18: bigint) => void;
    hash: `0x${string}` | undefined;
    isPending: boolean;
    isConfirming: boolean;
    isSuccess: boolean;
    error: Error | null;
}
/**
 * Hook for liquidating underwater positions
 */
export declare function useLXVaultLiquidate(): UseLXVaultLiquidateResult;
/**
 * Combined hook for common vault operations
 */
export declare function useLXVault(subaccountId?: number): {
    address: `0x${string}` | undefined;
    subaccountId: number;
    margin: LXMarginInfo | undefined;
    isLoadingMargin: boolean;
    deposit: (token: Address, amount: bigint, subaccountId?: number) => void;
    withdraw: (token: Address, amount: bigint, subaccountId?: number) => void;
    transfer: (token: Address, amount: bigint, fromSubaccount: number, toSubaccount: number) => void;
    isDepositing: boolean;
    isWithdrawing: boolean;
    isTransferring: boolean;
    refetchMargin: (options?: import("@tanstack/query-core").RefetchOptions) => Promise<import("@tanstack/query-core").QueryObserverResult<{
        totalCollateralX18: bigint;
        usedMarginX18: bigint;
        freeMarginX18: bigint;
        marginRatioX18: bigint;
        maintenanceMarginX18: bigint;
        liquidatable: boolean;
    }, import("viem").ReadContractErrorType>>;
};
export {};
//# sourceMappingURL=use-lxvault.d.ts.map