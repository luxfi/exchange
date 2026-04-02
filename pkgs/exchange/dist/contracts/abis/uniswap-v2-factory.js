/**
 * UniswapV2Factory ABI
 */
export const UNISWAP_V2_FACTORY_ABI = [
    {
        type: 'function',
        name: 'getPair',
        inputs: [
            { name: 'tokenA', type: 'address' },
            { name: 'tokenB', type: 'address' },
        ],
        outputs: [{ name: 'pair', type: 'address' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'allPairs',
        inputs: [{ name: 'index', type: 'uint256' }],
        outputs: [{ name: 'pair', type: 'address' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'allPairsLength',
        inputs: [],
        outputs: [{ type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'createPair',
        inputs: [
            { name: 'tokenA', type: 'address' },
            { name: 'tokenB', type: 'address' },
        ],
        outputs: [{ name: 'pair', type: 'address' }],
        stateMutability: 'nonpayable',
    },
    {
        type: 'event',
        name: 'PairCreated',
        inputs: [
            { name: 'token0', type: 'address', indexed: true },
            { name: 'token1', type: 'address', indexed: true },
            { name: 'pair', type: 'address', indexed: false },
            { name: 'index', type: 'uint256', indexed: false },
        ],
    },
];
