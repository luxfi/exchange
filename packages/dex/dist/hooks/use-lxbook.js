/**
 * LXBook Hooks (LP-9020)
 * React hooks for CLOB trading via LXBook precompile
 */
import { useCallback } from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { encodeFunctionData } from 'viem';
import { LX } from '../precompile/addresses';
import { LX_BOOK_ABI } from '../precompile/abis';
import { ActionType, TIF, OrderKind, } from '../precompile/types';
/**
 * Hook to get L1 (best bid/ask) for a market
 */
export function useLXBookL1(marketId) {
    const { data, isLoading, error, refetch } = useReadContract({
        address: LX.LX_BOOK,
        abi: LX_BOOK_ABI,
        functionName: 'getL1',
        args: [marketId],
    });
    return {
        l1: data,
        isLoading,
        error,
        refetch,
    };
}
/**
 * Hook to get market config
 */
export function useLXBookMarket(marketId) {
    const { data, isLoading, error } = useReadContract({
        address: LX.LX_BOOK,
        abi: LX_BOOK_ABI,
        functionName: 'getMarketConfig',
        args: [marketId],
    });
    return {
        config: data,
        isLoading,
        error,
    };
}
/**
 * Hook to get market status
 */
export function useLXBookMarketStatus(marketId) {
    const { data, isLoading, error } = useReadContract({
        address: LX.LX_BOOK,
        abi: LX_BOOK_ABI,
        functionName: 'getMarketStatus',
        args: [marketId],
    });
    return {
        status: data,
        isLoading,
        error,
    };
}
/**
 * Build action payload for execute()
 */
function buildAction(actionType, nonce, expiresAfter, data) {
    return {
        actionType,
        nonce,
        expiresAfter,
        data,
    };
}
/**
 * Encode order data for placement
 */
function encodeOrderData(order) {
    // Pack order into bytes - this matches the Go/Solidity struct layout
    const encoded = encodeFunctionData({
        abi: [{
                type: 'function',
                name: 'encodeOrder',
                inputs: [{
                        name: 'order',
                        type: 'tuple',
                        components: [
                            { name: 'marketId', type: 'uint32' },
                            { name: 'isBuy', type: 'bool' },
                            { name: 'kind', type: 'uint8' },
                            { name: 'sizeX18', type: 'uint128' },
                            { name: 'limitPxX18', type: 'uint128' },
                            { name: 'triggerPxX18', type: 'uint128' },
                            { name: 'reduceOnly', type: 'bool' },
                            { name: 'tif', type: 'uint8' },
                            { name: 'cloid', type: 'bytes16' },
                            { name: 'groupId', type: 'bytes16' },
                            { name: 'groupType', type: 'uint8' },
                        ],
                    }],
                outputs: [],
                stateMutability: 'pure',
            }],
        functionName: 'encodeOrder',
        args: [order],
    });
    // Strip function selector (first 4 bytes)
    return `0x${encoded.slice(10)}`;
}
/**
 * Hook for placing orders via LXBook execute()
 */
export function useLXBookExecute() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
    const execute = useCallback((action) => {
        writeContract({
            address: LX.LX_BOOK,
            abi: LX_BOOK_ABI,
            functionName: 'execute',
            args: [action],
        });
    }, [writeContract]);
    const executeBatch = useCallback((actions) => {
        writeContract({
            address: LX.LX_BOOK,
            abi: LX_BOOK_ABI,
            functionName: 'executeBatch',
            args: [actions],
        });
    }, [writeContract]);
    return {
        execute,
        executeBatch,
        hash,
        isPending,
        isConfirming,
        isSuccess,
        error,
    };
}
/**
 * Hook for placing limit orders
 */
export function useLXBookPlaceOrder() {
    const { execute, hash, isPending, isConfirming, isSuccess, error } = useLXBookExecute();
    const placeOrder = useCallback(async (params) => {
        const order = {
            marketId: params.marketId,
            isBuy: params.isBuy,
            kind: OrderKind.LIMIT,
            sizeX18: params.size,
            limitPxX18: params.price,
            triggerPxX18: 0n,
            reduceOnly: params.reduceOnly ?? false,
            tif: params.tif ?? TIF.GTC,
            cloid: params.cloid ?? '0x00000000000000000000000000000000',
            groupId: '0x00000000000000000000000000000000',
            groupType: 0,
        };
        const action = buildAction(ActionType.PLACE, BigInt(Date.now()), BigInt(Math.floor(Date.now() / 1000) + 300), // 5 min expiry
        encodeOrderData(order));
        return execute(action);
    }, [execute]);
    const placeMarketOrder = useCallback(async (params) => {
        const order = {
            marketId: params.marketId,
            isBuy: params.isBuy,
            kind: OrderKind.MARKET,
            sizeX18: params.size,
            limitPxX18: 0n, // Market order - no limit
            triggerPxX18: 0n,
            reduceOnly: params.reduceOnly ?? false,
            tif: TIF.IOC,
            cloid: '0x00000000000000000000000000000000',
            groupId: '0x00000000000000000000000000000000',
            groupType: 0,
        };
        const action = buildAction(ActionType.PLACE, BigInt(Date.now()), BigInt(Math.floor(Date.now() / 1000) + 60), // 1 min expiry for market
        encodeOrderData(order));
        return execute(action);
    }, [execute]);
    return {
        placeOrder,
        placeMarketOrder,
        hash,
        isPending,
        isConfirming,
        isSuccess,
        error,
    };
}
/**
 * Hook for canceling orders
 */
export function useLXBookCancelOrder() {
    const { execute, hash, isPending, isConfirming, isSuccess, error } = useLXBookExecute();
    const cancelByOid = useCallback(async (oid) => {
        // Encode oid as bytes
        const data = `0x${oid.toString(16).padStart(64, '0')}`;
        const action = buildAction(ActionType.CANCEL, BigInt(Date.now()), BigInt(Math.floor(Date.now() / 1000) + 60), data);
        return execute(action);
    }, [execute]);
    const cancelByCloid = useCallback(async (cloid) => {
        const action = buildAction(ActionType.CANCEL_BY_CLOID, BigInt(Date.now()), BigInt(Math.floor(Date.now() / 1000) + 60), cloid);
        return execute(action);
    }, [execute]);
    return {
        cancelByOid,
        cancelByCloid,
        hash,
        isPending,
        isConfirming,
        isSuccess,
        error,
    };
}
