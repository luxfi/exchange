'use client';
import { useMutation } from '@tanstack/react-query';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { getContracts } from '@luxfi/config';
import { SWAP_ROUTER_ABI } from '../contracts/abis';
import { isNativeToken } from '../tokens';
/**
 * Hook to execute a swap transaction
 */
export function useSwap() {
    const { writeContractAsync, data: hash, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
    const swap = useMutation({
        mutationFn: async (params) => {
            const contracts = getContracts(params.chainId);
            const isNativeIn = isNativeToken(params.tokenIn);
            const txHash = await writeContractAsync({
                address: contracts.V3_SWAP_ROUTER_02,
                abi: SWAP_ROUTER_ABI,
                functionName: 'exactInputSingle',
                args: [
                    {
                        tokenIn: isNativeIn ? contracts.WLUX : params.tokenIn.address,
                        tokenOut: params.tokenOut.address,
                        fee: 3000, // 0.30% fee tier
                        recipient: params.recipient,
                        deadline: params.deadline,
                        amountIn: params.amountIn,
                        amountOutMinimum: params.amountOutMinimum,
                        sqrtPriceLimitX96: 0n,
                    },
                ],
                value: isNativeIn ? params.amountIn : 0n,
            });
            return txHash;
        },
    });
    return {
        swap: swap.mutateAsync,
        hash,
        isPending: isPending || swap.isPending,
        isConfirming,
        isSuccess,
        error: swap.error,
    };
}
