'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import { usePublicClient } from 'wagmi';
import { OmnichainRouter } from '../router';
/**
 * Hook to get swap quotes from the omnichain router
 */
export function useQuote(tokenIn, tokenOut, amountIn, options = {}) {
    const { refreshInterval = 10000, enabled = true } = options;
    const publicClient = usePublicClient();
    const routerRef = useRef(null);
    const [quote, setQuote] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    // Initialize router
    useEffect(() => {
        if (!routerRef.current) {
            routerRef.current = new OmnichainRouter();
        }
        if (publicClient) {
            routerRef.current.setPublicClient(publicClient);
        }
    }, [publicClient]);
    const fetchQuote = useCallback(async () => {
        if (!tokenIn || !tokenOut || !amountIn || amountIn === 0n || !enabled) {
            setQuote(null);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const request = {
                tokenIn,
                tokenOut,
                amountIn,
            };
            const newQuote = await routerRef.current.getQuote(request);
            setQuote(newQuote);
        }
        catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to get quote'));
            setQuote(null);
        }
        finally {
            setIsLoading(false);
        }
    }, [tokenIn, tokenOut, amountIn, enabled]);
    // Fetch on mount and when inputs change
    useEffect(() => {
        fetchQuote();
    }, [fetchQuote]);
    // Auto-refresh
    useEffect(() => {
        if (!enabled || refreshInterval <= 0)
            return;
        const interval = setInterval(fetchQuote, refreshInterval);
        return () => clearInterval(interval);
    }, [fetchQuote, enabled, refreshInterval]);
    return {
        quote,
        isLoading,
        error,
        refetch: fetchQuote,
    };
}
