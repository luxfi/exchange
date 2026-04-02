'use client';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { maxUint256 } from 'viem';
import { ERC20_ABI } from '../contracts/abis';
import { isNativeToken } from '../tokens';
/**
 * Hook to check and manage token allowance
 */
export function useTokenAllowance(token, owner, spender, chainId) {
    const allowance = useReadContract({
        address: token?.address,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: owner && spender ? [owner, spender] : undefined,
        chainId,
        query: {
            enabled: !!token && !isNativeToken(token) && !!owner && !!spender,
        },
    });
    const { writeContractAsync, data: hash, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
    const approve = async (amount = maxUint256) => {
        if (!token || !spender || isNativeToken(token))
            return;
        return writeContractAsync({
            address: token.address,
            abi: ERC20_ABI,
            functionName: 'approve',
            args: [spender, amount],
        });
    };
    // Native tokens don't need approval
    if (token && isNativeToken(token)) {
        return {
            allowance: maxUint256,
            isApproved: true,
            approve,
            isPending: false,
            isConfirming: false,
            isSuccess: true,
        };
    }
    const currentAllowance = allowance.data ?? 0n;
    return {
        allowance: currentAllowance,
        isApproved: currentAllowance > 0n,
        approve,
        isPending,
        isConfirming,
        isSuccess,
        refetch: allowance.refetch,
    };
}
/**
 * Check if approval is needed for a specific amount
 */
export function needsApproval(allowance, amount) {
    return allowance < amount;
}
