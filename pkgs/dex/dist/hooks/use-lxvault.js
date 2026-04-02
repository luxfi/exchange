/**
 * LXVault Hooks (LP-9030)
 * React hooks for custody, margin, and positions via LXVault precompile
 */
import { useCallback } from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { LX } from '../precompile/addresses';
import { LX_VAULT_ABI } from '../precompile/abis';
/**
 * Build account tuple from address and subaccount
 */
function buildAccount(main, subaccountId = 0) {
    return { main, subaccountId };
}
/**
 * Hook to get token balance in vault
 */
export function useLXVaultBalance(token, subaccountId = 0) {
    const { address } = useAccount();
    const { data, isLoading, error, refetch } = useReadContract({
        address: LX.LX_VAULT,
        abi: LX_VAULT_ABI,
        functionName: 'getBalance',
        args: address ? [buildAccount(address, subaccountId), token] : undefined,
        query: { enabled: !!address },
    });
    return {
        balance: data,
        isLoading,
        error,
        refetch,
    };
}
/**
 * Hook to get position for a market
 */
export function useLXVaultPosition(marketId, subaccountId = 0) {
    const { address } = useAccount();
    const { data, isLoading, error, refetch } = useReadContract({
        address: LX.LX_VAULT,
        abi: LX_VAULT_ABI,
        functionName: 'getPosition',
        args: address ? [buildAccount(address, subaccountId), marketId] : undefined,
        query: { enabled: !!address },
    });
    return {
        position: data,
        isLoading,
        error,
        refetch,
    };
}
/**
 * Hook to get margin info (free margin, used margin, etc.)
 */
export function useLXVaultMargin(subaccountId = 0) {
    const { address } = useAccount();
    const { data, isLoading, error, refetch } = useReadContract({
        address: LX.LX_VAULT,
        abi: LX_VAULT_ABI,
        functionName: 'getMargin',
        args: address ? [buildAccount(address, subaccountId)] : undefined,
        query: { enabled: !!address },
    });
    return {
        margin: data,
        isLoading,
        error,
        refetch,
    };
}
/**
 * Hook to check if account is liquidatable
 */
export function useLXVaultLiquidatable(account, subaccountId = 0) {
    const { address: connectedAddress } = useAccount();
    const targetAddress = account ?? connectedAddress;
    const { data, isLoading, error, refetch } = useReadContract({
        address: LX.LX_VAULT,
        abi: LX_VAULT_ABI,
        functionName: 'isLiquidatable',
        args: targetAddress ? [buildAccount(targetAddress, subaccountId)] : undefined,
        query: { enabled: !!targetAddress },
    });
    const result = data;
    return {
        liquidatable: result?.[0],
        shortfall: result?.[1],
        isLoading,
        error,
        refetch,
    };
}
/**
 * Hook to get funding rate for a market
 */
export function useLXVaultFundingRate(marketId) {
    const { data, isLoading, error, refetch } = useReadContract({
        address: LX.LX_VAULT,
        abi: LX_VAULT_ABI,
        functionName: 'getFundingRate',
        args: [marketId],
    });
    const result = data;
    return {
        rateX18: result?.[0],
        nextFundingTime: result?.[1],
        isLoading,
        error,
        refetch,
    };
}
/**
 * Hook for depositing tokens into vault
 */
export function useLXVaultDeposit() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
    const deposit = useCallback((token, amount, subaccountId = 0) => {
        writeContract({
            address: LX.LX_VAULT,
            abi: LX_VAULT_ABI,
            functionName: 'deposit',
            args: [token, amount, subaccountId],
        });
    }, [writeContract]);
    return {
        deposit,
        hash,
        isPending,
        isConfirming,
        isSuccess,
        error,
    };
}
/**
 * Hook for withdrawing tokens from vault
 */
export function useLXVaultWithdraw() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
    const withdraw = useCallback((token, amount, subaccountId = 0) => {
        writeContract({
            address: LX.LX_VAULT,
            abi: LX_VAULT_ABI,
            functionName: 'withdraw',
            args: [token, amount, subaccountId],
        });
    }, [writeContract]);
    return {
        withdraw,
        hash,
        isPending,
        isConfirming,
        isSuccess,
        error,
    };
}
/**
 * Hook for transferring between subaccounts
 */
export function useLXVaultTransfer() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
    const transfer = useCallback((token, amount, fromSubaccount, toSubaccount) => {
        writeContract({
            address: LX.LX_VAULT,
            abi: LX_VAULT_ABI,
            functionName: 'transfer',
            args: [token, amount, fromSubaccount, toSubaccount],
        });
    }, [writeContract]);
    return {
        transfer,
        hash,
        isPending,
        isConfirming,
        isSuccess,
        error,
    };
}
/**
 * Hook for liquidating underwater positions
 */
export function useLXVaultLiquidate() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
    const liquidate = useCallback((targetAccount, targetSubaccount, marketId, sizeX18) => {
        writeContract({
            address: LX.LX_VAULT,
            abi: LX_VAULT_ABI,
            functionName: 'liquidate',
            args: [buildAccount(targetAccount, targetSubaccount), marketId, sizeX18],
        });
    }, [writeContract]);
    return {
        liquidate,
        hash,
        isPending,
        isConfirming,
        isSuccess,
        error,
    };
}
/**
 * Combined hook for common vault operations
 */
export function useLXVault(subaccountId = 0) {
    const { address } = useAccount();
    const margin = useLXVaultMargin(subaccountId);
    const { deposit, isPending: isDepositing } = useLXVaultDeposit();
    const { withdraw, isPending: isWithdrawing } = useLXVaultWithdraw();
    const { transfer, isPending: isTransferring } = useLXVaultTransfer();
    return {
        address,
        subaccountId,
        margin: margin.margin,
        isLoadingMargin: margin.isLoading,
        deposit,
        withdraw,
        transfer,
        isDepositing,
        isWithdrawing,
        isTransferring,
        refetchMargin: margin.refetch,
    };
}
