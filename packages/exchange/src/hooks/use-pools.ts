'use client'

import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { getContracts } from '../contracts'
import { UNISWAP_V3_FACTORY_ABI, UNISWAP_V3_POOL_ABI } from '../contracts/abis'
import type { Address } from 'viem'

export interface Pool {
  address: Address
  token0: Address
  token1: Address
  fee: number
  tickSpacing: number
  liquidity: bigint
  sqrtPriceX96: bigint
  tick: number
}

/**
 * Hook to get pool information
 */
export function usePool(
  token0: Address | undefined,
  token1: Address | undefined,
  fee: number,
  chainId: number
) {
  const publicClient = usePublicClient({ chainId })
  const contracts = getContracts(chainId)

  return useQuery({
    queryKey: ['pool', token0, token1, fee, chainId],
    queryFn: async (): Promise<Pool | null> => {
      if (!token0 || !token1 || !publicClient) return null

      try {
        // Get pool address from factory
        const poolAddress = await publicClient.readContract({
          address: contracts.V3_FACTORY,
          abi: UNISWAP_V3_FACTORY_ABI,
          functionName: 'getPool',
          args: [token0, token1, fee],
        })

        if (poolAddress === '0x0000000000000000000000000000000000000000') {
          return null
        }

        // Get pool state
        const [slot0, liquidity, tickSpacing] = await Promise.all([
          publicClient.readContract({
            address: poolAddress,
            abi: UNISWAP_V3_POOL_ABI,
            functionName: 'slot0',
          }),
          publicClient.readContract({
            address: poolAddress,
            abi: UNISWAP_V3_POOL_ABI,
            functionName: 'liquidity',
          }),
          publicClient.readContract({
            address: poolAddress,
            abi: UNISWAP_V3_POOL_ABI,
            functionName: 'tickSpacing',
          }),
        ])

        return {
          address: poolAddress,
          token0,
          token1,
          fee,
          tickSpacing,
          liquidity,
          sqrtPriceX96: slot0[0],
          tick: slot0[1],
        }
      } catch (error) {
        console.error('Failed to fetch pool:', error)
        return null
      }
    },
    enabled: !!token0 && !!token1 && !!publicClient,
    staleTime: 30_000,
  })
}

/**
 * Hook to get all pools for a token pair
 */
export function usePools(
  token0: Address | undefined,
  token1: Address | undefined,
  chainId: number
) {
  const pool100 = usePool(token0, token1, 100, chainId)
  const pool500 = usePool(token0, token1, 500, chainId)
  const pool3000 = usePool(token0, token1, 3000, chainId)
  const pool10000 = usePool(token0, token1, 10000, chainId)

  const pools = [
    pool100.data,
    pool500.data,
    pool3000.data,
    pool10000.data,
  ].filter((p): p is Pool => p !== null)

  return {
    pools,
    isLoading: pool100.isLoading || pool500.isLoading || pool3000.isLoading || pool10000.isLoading,
    bestPool: pools.length > 0 ? pools.reduce((best, pool) =>
      pool.liquidity > best.liquidity ? pool : best
    ) : null,
  }
}
