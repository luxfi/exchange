/**
 * AMM V2 Pair ABI
 * Compatible with Uniswap V2 Pair interface
 */
export const AMM_V2_PAIR_ABI = [
    {
        type: 'function',
        name: 'token0',
        inputs: [],
        outputs: [{ type: 'address' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'token1',
        inputs: [],
        outputs: [{ type: 'address' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'getReserves',
        inputs: [],
        outputs: [
            { name: 'reserve0', type: 'uint112' },
            { name: 'reserve1', type: 'uint112' },
            { name: 'blockTimestampLast', type: 'uint32' },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'totalSupply',
        inputs: [],
        outputs: [{ type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'balanceOf',
        inputs: [{ name: 'owner', type: 'address' }],
        outputs: [{ type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'price0CumulativeLast',
        inputs: [],
        outputs: [{ type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'price1CumulativeLast',
        inputs: [],
        outputs: [{ type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'kLast',
        inputs: [],
        outputs: [{ type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'event',
        name: 'Swap',
        inputs: [
            { name: 'sender', type: 'address', indexed: true },
            { name: 'amount0In', type: 'uint256', indexed: false },
            { name: 'amount1In', type: 'uint256', indexed: false },
            { name: 'amount0Out', type: 'uint256', indexed: false },
            { name: 'amount1Out', type: 'uint256', indexed: false },
            { name: 'to', type: 'address', indexed: true },
        ],
    },
    {
        type: 'event',
        name: 'Sync',
        inputs: [
            { name: 'reserve0', type: 'uint112', indexed: false },
            { name: 'reserve1', type: 'uint112', indexed: false },
        ],
    },
];
/** @deprecated Use AMM_V2_PAIR_ABI instead */
export const UNISWAP_V2_PAIR_ABI = AMM_V2_PAIR_ABI;
