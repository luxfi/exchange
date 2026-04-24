'use client'

import { useMutation } from '@tanstack/react-query'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits } from 'viem'
import { getContracts } from '../contracts'
import { SWAP_ROUTER_ABI } from '../contracts/abis'
import type { Token } from '../tokens'
import { isNativeToken } from '../tokens'

export interface SwapRequest {
  tokenIn: Token
  tokenOut: Token
  amountIn: bigint
  amountOutMinimum: bigint
  recipient: `0x${string}`
  deadline: bigint
  chainId: number
}

/**
 * Hook to execute a swap transaction
 */
export function useSwap() {
  const { writeContractAsync, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const swap = useMutation({
    mutationFn: async (params: SwapRequest) => {
      const contracts = getContracts(params.chainId) as Record<string, `0x${string}` | undefined>
      const isNativeIn = isNativeToken(params.tokenIn)
      const router = contracts.V3_SWAP_ROUTER_02 ?? contracts.V2_ROUTER
      const wrappedNative = contracts.WLUX ?? contracts.WZOO
      if (!router) throw new Error(`No DEX router deployed on chain ${params.chainId}`)
      if (isNativeIn && !wrappedNative) throw new Error(`No wrapped native on chain ${params.chainId}`)

      const txHash = await writeContractAsync({
        address: router,
        abi: SWAP_ROUTER_ABI,
        functionName: 'exactInputSingle',
        args: [
          {
            tokenIn: isNativeIn ? wrappedNative! : params.tokenIn.address,
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
      })

      return txHash
    },
  })

  return {
    swap: swap.mutateAsync,
    hash,
    isPending: isPending || swap.isPending,
    isConfirming,
    isSuccess,
    error: swap.error,
  }
}
