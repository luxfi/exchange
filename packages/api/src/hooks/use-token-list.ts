'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchWithTimeout, API_URLS } from '../client'

export interface TokenListToken {
  address: string
  chainId: number
  decimals: number
  symbol: string
  name: string
  logoURI?: string
}

export interface TokenList {
  name: string
  tokens: TokenListToken[]
  version: {
    major: number
    minor: number
    patch: number
  }
}

/**
 * Fetch and cache token list
 */
export function useTokenList(chainId: number) {
  return useQuery({
    queryKey: ['tokenList', chainId],
    queryFn: async (): Promise<TokenListToken[]> => {
      try {
        const response = await fetchWithTimeout(
          `${API_URLS.TOKEN_LIST}/lux-default.json`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch token list')
        }

        const data: TokenList = await response.json()

        // Filter tokens for the specified chain
        return data.tokens.filter((token) => token.chainId === chainId)
      } catch (error) {
        console.error('Failed to fetch token list:', error)
        return []
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
