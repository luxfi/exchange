'use client';
import { useState, useCallback } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { DEX_PRECOMPILES } from '../precompile/addresses';
import { SWAP_ROUTER_ABI } from '../precompile/abis';
import { createPoolKey } from '../precompile/types';
/**
 * Hook to execute swaps via the DEX precompiles
 */
export function useSwap() {
    const [error, setError] = useState(null);
    const { data: txHash, writeContractAsync, isPending, reset: resetWrite, } = useWriteContract();
    const { isLoading: isConfirming, isSuccess, } = useWaitForTransactionReceipt({
        hash: txHash,
    });
    const swap = useCallback(async (quote, recipient) => {
        setError(null);
        if (!quote || quote.route.length === 0) {
            setError(new Error('Invalid quote'));
            return;
        }
        const step = quote.route[0];
        if (step.source === 'amm') {
            try {
                // Execute AMM swap via precompile
                const poolKey = createPoolKey(quote.tokenIn, quote.tokenOut);
                const zeroForOne = quote.tokenIn.toLowerCase() < quote.tokenOut.toLowerCase();
                await writeContractAsync({
                    address: DEX_PRECOMPILES.SWAP_ROUTER,
                    abi: SWAP_ROUTER_ABI,
                    functionName: 'exactInputSingle',
                    args: [{
                            poolKey,
                            zeroForOne,
                            amountIn: quote.amountIn,
                            amountOutMinimum: quote.minimumAmountOut,
                            sqrtPriceLimitX96: 0n,
                            hookData: '0x',
                        }],
                    // Include native value if swapping from native LUX
                    value: quote.tokenIn === '0x0000000000000000000000000000000000000000'
                        ? quote.amountIn
                        : 0n,
                });
            }
            catch (err) {
                setError(err instanceof Error ? err : new Error('Swap failed'));
                throw err;
            }
        }
        else if (step.source === 'clob') {
            // CLOB swaps are handled off-chain
            // The frontend should use the CLOB client directly
            setError(new Error('CLOB swaps should be executed via CLOB client'));
            throw new Error('CLOB swaps not supported in this hook');
        }
        else {
            setError(new Error(`Unknown route source: ${step.source}`));
            throw new Error(`Unknown route source: ${step.source}`);
        }
    }, [writeContractAsync]);
    const reset = useCallback(() => {
        setError(null);
        resetWrite();
    }, [resetWrite]);
    return {
        swap,
        isPending,
        isConfirming,
        isSuccess,
        error,
        txHash,
        reset,
    };
}
