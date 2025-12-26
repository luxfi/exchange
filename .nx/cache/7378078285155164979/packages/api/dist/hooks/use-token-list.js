'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchWithTimeout, API_URLS } from '../client';
/**
 * Fetch and cache token list
 */
export function useTokenList(chainId) {
    return useQuery({
        queryKey: ['tokenList', chainId],
        queryFn: async () => {
            try {
                const response = await fetchWithTimeout(`${API_URLS.TOKEN_LIST}/lux-default.json`);
                if (!response.ok) {
                    throw new Error('Failed to fetch token list');
                }
                const data = await response.json();
                // Filter tokens for the specified chain
                return data.tokens.filter((token) => token.chainId === chainId);
            }
            catch (error) {
                console.error('Failed to fetch token list:', error);
                return [];
            }
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
