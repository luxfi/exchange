import { QueryClient } from '@tanstack/react-query'

/**
 * Create a React Query client with Lux Exchange defaults
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // 30 seconds stale time by default
        staleTime: 30_000,
        // 5 minutes cache time
        gcTime: 5 * 60 * 1000,
        // Retry failed queries once
        retry: 1,
        // Don't refetch on window focus by default
        refetchOnWindowFocus: false,
      },
      mutations: {
        // Retry mutations once
        retry: 1,
      },
    },
  })
}

/**
 * API base URLs
 */
export const API_URLS = {
  // Token list API
  TOKEN_LIST: 'https://tokens.lux.network',

  // Price API
  PRICE_API: 'https://api.lux.network/prices',

  // Analytics API
  ANALYTICS_API: 'https://api.lux.network/analytics',

  // Subgraph endpoints
  V2_SUBGRAPH: 'https://api.lux.network/subgraphs/exchange-v2',
  V3_SUBGRAPH: 'https://api.lux.network/subgraphs/exchange-v3',
} as const

/**
 * Fetch with timeout
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit & { timeout?: number } = {}
): Promise<Response> {
  const { timeout = 10_000, ...fetchOptions } = options

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    })
    return response
  } finally {
    clearTimeout(timeoutId)
  }
}
