'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchWithTimeout, API_URLS } from '../client'
import type { Address } from 'viem'

export interface TokenPrice {
  address: Address
  priceUSD: number
  change24h: number
}

/**
 * Fetch token price in USD
 */
export function useTokenPrice(address: Address | undefined, chainId: number) {
  return useQuery({
    queryKey: ['tokenPrice', address, chainId],
    queryFn: async (): Promise<TokenPrice | null> => {
      if (!address) return null

      try {
        const response = await fetchWithTimeout(
          `${API_URLS.PRICE_API}/${chainId}/${address}`
        )

        if (!response.ok) {
          return null
        }

        return response.json()
      } catch (error) {
        console.error('Failed to fetch token price:', error)
        return null
      }
    },
    enabled: !!address,
    staleTime: 30_000, // 30 seconds
    refetchInterval: 60_000, // Refetch every minute
  })
}

/**
 * Fetch multiple token prices
 */
export function useTokenPrices(addresses: Address[], chainId: number) {
  return useQuery({
    queryKey: ['tokenPrices', addresses, chainId],
    queryFn: async (): Promise<Map<Address, TokenPrice>> => {
      const priceMap = new Map<Address, TokenPrice>()

      if (addresses.length === 0) return priceMap

      try {
        const response = await fetchWithTimeout(
          `${API_URLS.PRICE_API}/${chainId}/batch`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ addresses }),
          }
        )

        if (!response.ok) {
          return priceMap
        }

        const prices: TokenPrice[] = await response.json()
        prices.forEach((price) => {
          priceMap.set(price.address, price)
        })

        return priceMap
      } catch (error) {
        console.error('Failed to fetch token prices:', error)
        return priceMap
      }
    },
    enabled: addresses.length > 0,
    staleTime: 30_000,
  })
}
