import type { Address } from 'viem';
/**
 * Hook to get token balance in vault
 */
export declare function useLXVaultBalance(token: Address, subaccountId?: number): any;
/**
 * Hook to get position for a market
 */
export declare function useLXVaultPosition(marketId: number, subaccountId?: number): any;
/**
 * Hook to get margin info (free margin, used margin, etc.)
 */
export declare function useLXVaultMargin(subaccountId?: number): any;
/**
 * Hook to check if account is liquidatable
 */
export declare function useLXVaultLiquidatable(account?: Address, subaccountId?: number): any;
/**
 * Hook to get funding rate for a market
 */
export declare function useLXVaultFundingRate(marketId: number): any;
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
export declare function useLXVault(subaccountId?: number): any;
export {};
//# sourceMappingURL=use-lxvault.d.ts.map