'use client'

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { maxUint256 } from 'viem'
import { ERC20_ABI } from '../contracts/abis'
import type { Token } from '../tokens'
import { isNativeToken } from '../tokens'
import type { Address } from 'viem'

/**
 * Hook to check and manage token allowance
 */
export function useTokenAllowance(
  token: Token | null,
  owner: Address | undefined,
  spender: Address | undefined,
  chainId: number
) {
  const allowance = useReadContract({
    address: token?.address,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: owner && spender ? [owner, spender] : undefined,
    chainId,
    query: {
      enabled: !!token && !isNativeToken(token) && !!owner && !!spender,
    },
  })

  const { writeContractAsync, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const approve = async (amount: bigint = maxUint256) => {
    if (!token || !spender || isNativeToken(token)) return

    return writeContractAsync({
      address: token.address,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [spender, amount],
    })
  }

  // Native tokens don't need approval
  if (token && isNativeToken(token)) {
    return {
      allowance: maxUint256,
      isApproved: true,
      approve,
      isPending: false,
      isConfirming: false,
      isSuccess: true,
    }
  }

  const currentAllowance = (allowance.data as bigint) ?? 0n

  return {
    allowance: currentAllowance,
    isApproved: currentAllowance > 0n,
    approve,
    isPending,
    isConfirming,
    isSuccess,
    refetch: allowance.refetch,
  }
}

/**
 * Check if approval is needed for a specific amount
 */
export function needsApproval(allowance: bigint, amount: bigint): boolean {
  return allowance < amount
}
