'use client';
import { useQuery } from '@tanstack/react-query';
import { usePublicClient } from 'wagmi';
import { getContracts } from '../contracts';
import { NFT_POSITION_MANAGER_ABI } from '../contracts/abis';
/**
 * Hook to get user's liquidity positions
 */
export function usePositions(owner, chainId) {
    const publicClient = usePublicClient({ chainId });
    const contracts = getContracts(chainId);
    return useQuery({
        queryKey: ['positions', owner, chainId],
        queryFn: async () => {
            if (!owner || !publicClient)
                return [];
            try {
                // Get number of positions
                const balance = await publicClient.readContract({
                    address: contracts.V3_NFT_POSITION_MANAGER,
                    abi: NFT_POSITION_MANAGER_ABI,
                    functionName: 'balanceOf',
                    args: [owner],
                });
                if (balance === 0n)
                    return [];
                // Get all token IDs
                const tokenIds = await Promise.all(Array.from({ length: Number(balance) }, (_, i) => publicClient.readContract({
                    address: contracts.V3_NFT_POSITION_MANAGER,
                    abi: NFT_POSITION_MANAGER_ABI,
                    functionName: 'tokenOfOwnerByIndex',
                    args: [owner, BigInt(i)],
                })));
                // Get position details for each token ID
                const positions = await Promise.all(tokenIds.map(async (tokenId) => {
                    const position = await publicClient.readContract({
                        address: contracts.V3_NFT_POSITION_MANAGER,
                        abi: NFT_POSITION_MANAGER_ABI,
                        functionName: 'positions',
                        args: [tokenId],
                    });
                    return {
                        tokenId,
                        token0: position[2],
                        token1: position[3],
                        fee: position[4],
                        tickLower: position[5],
                        tickUpper: position[6],
                        liquidity: position[7],
                        tokensOwed0: position[10],
                        tokensOwed1: position[11],
                    };
                }));
                // Filter out closed positions (zero liquidity)
                return positions.filter((p) => p.liquidity > 0n);
            }
            catch (error) {
                console.error('Failed to fetch positions:', error);
                return [];
            }
        },
        enabled: !!owner && !!publicClient,
        staleTime: 60_000,
    });
}
