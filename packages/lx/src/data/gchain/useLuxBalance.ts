/**
 * Lux Chain Balance Hook using G-Chain GraphQL
 *
 * Uses the native G-Chain GraphQL interface to fetch account balances
 * directly from the Lux blockchain, bypassing external APIs.
 *
 * This is the foundation for native DEX functionality powered by
 * decentralized blockchain nodes.
 */

import { useQuery } from '@tanstack/react-query'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { type GChainAccount, getAccount, getBalance } from './client'

const GCHAIN_BALANCE_STALE_TIME = 10_000 // 10 seconds
const GCHAIN_BALANCE_CACHE_TIME = 60_000 // 1 minute

/**
 * Check if a chain should use G-Chain for balance data
 */
export function isGChainSupported(chainId: number): boolean {
  return (
    chainId === UniverseChainId.Lux ||
    chainId === UniverseChainId.LuxTestnet ||
    chainId === UniverseChainId.Zoo ||
    chainId === UniverseChainId.ZooTestnet
  )
}

/**
 * Hook to get native balance from G-Chain for Lux/Zoo chains
 * Returns balance in wei as a string
 */
export function useLuxNativeBalance(address: string | undefined, chainId?: number) {
  const isSupported = chainId ? isGChainSupported(chainId) : true

  return useQuery<string>({
    queryKey: ['gchain', 'native-balance', address, chainId],
    queryFn: () => getBalance(address!),
    enabled: !!address && isSupported,
    staleTime: GCHAIN_BALANCE_STALE_TIME,
    gcTime: GCHAIN_BALANCE_CACHE_TIME,
    refetchInterval: 15_000, // Refetch every 15 seconds for live updates
  })
}

/**
 * Hook to get full account info from G-Chain for Lux/Zoo chains
 * Returns address, balance, and nonce
 */
export function useLuxAccount(address: string | undefined, chainId?: number) {
  const isSupported = chainId ? isGChainSupported(chainId) : true

  return useQuery<GChainAccount>({
    queryKey: ['gchain', 'account', address, chainId],
    queryFn: () => getAccount(address!),
    enabled: !!address && isSupported,
    staleTime: GCHAIN_BALANCE_STALE_TIME,
    gcTime: GCHAIN_BALANCE_CACHE_TIME,
  })
}

/**
 * Format wei balance to display string with decimals
 */
export function formatLuxBalance(weiBalance: string, decimals = 18): string {
  if (!weiBalance || weiBalance === '0') return '0'

  const balance = BigInt(weiBalance)
  const divisor = BigInt(10 ** decimals)
  const wholePart = balance / divisor
  const fractionalPart = balance % divisor

  if (fractionalPart === BigInt(0)) {
    return wholePart.toString()
  }

  // Format fractional part with leading zeros
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0')
  // Trim trailing zeros
  const trimmed = fractionalStr.replace(/0+$/, '')

  return `${wholePart}.${trimmed}`
}

/**
 * Hook that returns formatted balance for display
 */
export function useFormattedLuxBalance(
  address: string | undefined,
  chainId?: number,
  decimals = 18
): { balance: string | undefined; isLoading: boolean; error: Error | null } {
  const { data: rawBalance, isLoading, error } = useLuxNativeBalance(address, chainId)

  return {
    balance: rawBalance ? formatLuxBalance(rawBalance, decimals) : undefined,
    isLoading,
    error,
  }
}
