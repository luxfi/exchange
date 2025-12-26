'use client';
import { useQuery } from '@tanstack/react-query';
import { usePublicClient } from 'wagmi';
import { getContracts } from '@luxfi/config';
import { QUOTER_V2_ABI } from '../contracts/abis';
/**
 * Hook to get swap quote from V3 Quoter
 */
export function useSwapQuote({ tokenIn, tokenOut, amountIn, chainId, }) {
    const publicClient = usePublicClient({ chainId });
    const contracts = getContracts(chainId);
    return useQuery({
        queryKey: ['swapQuote', tokenIn?.address, tokenOut?.address, amountIn.toString(), chainId],
        queryFn: async () => {
            if (!tokenIn || !tokenOut || amountIn === 0n || !publicClient) {
                return null;
            }
            try {
                // Call QuoterV2 for quote
                const result = await publicClient.simulateContract({
                    address: contracts.V3_QUOTER_V2,
                    abi: QUOTER_V2_ABI,
                    functionName: 'quoteExactInputSingle',
                    args: [
                        {
                            tokenIn: tokenIn.address,
                            tokenOut: tokenOut.address,
                            amountIn,
                            fee: 3000, // 0.30% fee tier
                            sqrtPriceLimitX96: 0n,
                        },
                    ],
                });
                const [amountOut, , , gasEstimate] = result.result;
                // Calculate price impact (simplified)
                const priceImpact = 0.003; // 0.3% placeholder
                return {
                    amountIn,
                    amountOut,
                    priceImpact,
                    route: [tokenIn, tokenOut],
                    gasEstimate,
                };
            }
            catch (error) {
                console.error('Failed to get swap quote:', error);
                return null;
            }
        },
        enabled: !!tokenIn && !!tokenOut && amountIn > 0n && !!publicClient,
        staleTime: 10_000, // 10 seconds
        refetchInterval: 15_000, // Refetch every 15 seconds
    });
}
