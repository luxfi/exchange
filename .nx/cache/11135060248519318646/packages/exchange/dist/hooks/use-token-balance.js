'use client';
import { useBalance, useReadContract } from 'wagmi';
import { ERC20_ABI } from '../contracts/abis';
import { isNativeToken } from '../tokens';
/**
 * Hook to get token balance for an address
 */
export function useTokenBalance(token, address, chainId) {
    // For native token
    const nativeBalance = useBalance({
        address,
        chainId,
        query: {
            enabled: !!token && isNativeToken(token) && !!address,
        },
    });
    // For ERC20 token
    const erc20Balance = useReadContract({
        address: token?.address,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        chainId,
        query: {
            enabled: !!token && !isNativeToken(token) && !!address,
        },
    });
    if (!token || !address) {
        return {
            balance: 0n,
            formatted: '0',
            isLoading: false,
            error: null,
        };
    }
    if (isNativeToken(token)) {
        const value = nativeBalance.data?.value ?? 0n;
        return {
            balance: value,
            formatted: formatBalance(value, token.decimals),
            isLoading: nativeBalance.isLoading,
            error: nativeBalance.error,
        };
    }
    return {
        balance: erc20Balance.data ?? 0n,
        formatted: formatBalance(erc20Balance.data ?? 0n, token.decimals),
        isLoading: erc20Balance.isLoading,
        error: erc20Balance.error,
    };
}
function formatBalance(value, decimals) {
    const divisor = 10n ** BigInt(decimals);
    const whole = value / divisor;
    const fraction = value % divisor;
    const fractionStr = fraction.toString().padStart(decimals, '0').slice(0, 6);
    return `${whole}.${fractionStr}`.replace(/\.?0+$/, '');
}
