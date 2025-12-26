'use client'

import { useBalance, useReadContracts } from 'wagmi'
import { erc20Abi, formatUnits } from 'viem'
import type { Address } from 'viem'
import { LUX_MAINNET_CONTRACTS, LUX_MAINNET_ID } from '@luxfi/config'

/**
 * Format balance to human-readable string
 */
function formatBalance(value: bigint, decimals: number): string {
  return formatUnits(value, decimals)
}

/**
 * Hook to get native token balance
 */
export function useNativeBalance(address: Address | undefined, chainId: number = LUX_MAINNET_ID) {
  const { data, isLoading, error, refetch } = useBalance({
    address,
    chainId,
    query: {
      enabled: !!address,
    },
  })

  return {
    balance: data?.value ?? 0n,
    formatted: data ? formatBalance(data.value, data.decimals) : '0',
    symbol: data?.symbol ?? 'LUX',
    decimals: data?.decimals ?? 18,
    isLoading,
    error,
    refetch,
  }
}

export interface TokenBalance {
  token: Address
  balance: bigint
}

export interface TokenBalancesResult {
  balances: TokenBalance[]
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

/**
 * Hook to get multiple token balances
 */
export function useTokenBalances(
  address: Address | undefined,
  tokens: Address[],
  chainId: number = LUX_MAINNET_ID
): TokenBalancesResult {
  const contracts = tokens.map((token) => ({
    address: token,
    abi: erc20Abi,
    functionName: 'balanceOf' as const,
    args: [address!] as const,
    chainId,
  }))

  const { data, isLoading, error, refetch } = useReadContracts({
    contracts,
    query: {
      enabled: !!address && tokens.length > 0,
    },
  })

  const balances: TokenBalance[] = tokens.map((token, i) => ({
    token,
    balance: (data?.[i]?.result as bigint) ?? 0n,
  }))

  return {
    balances,
    isLoading,
    error: error ?? null,
    refetch,
  }
}

/**
 * Hook to get core token balances (WLUX, LETH, LBTC, LUSD)
 * Only available on mainnet - testnet uses different tokens
 */
export function useCoreTokenBalances(address: Address | undefined, chainId: number = LUX_MAINNET_ID): TokenBalancesResult {
  // Bridge tokens only exist on mainnet
  const tokens: Address[] = chainId === LUX_MAINNET_ID
    ? [
        LUX_MAINNET_CONTRACTS.WLUX,
        LUX_MAINNET_CONTRACTS.LETH,
        LUX_MAINNET_CONTRACTS.LBTC,
        LUX_MAINNET_CONTRACTS.LUSD,
      ]
    : [LUX_MAINNET_CONTRACTS.WLUX] // Fallback to mainnet WLUX for testnet

  return useTokenBalances(address, tokens, chainId)
}
