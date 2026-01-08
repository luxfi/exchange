/**
 * AMM V3 Factory ABI
 * Compatible with Uniswap V3 Factory interface
 */
export const AMM_V3_FACTORY_ABI = [
    {
        type: 'function',
        name: 'getPool',
        inputs: [
            { name: 'tokenA', type: 'address' },
            { name: 'tokenB', type: 'address' },
            { name: 'fee', type: 'uint24' },
        ],
        outputs: [{ name: 'pool', type: 'address' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'createPool',
        inputs: [
            { name: 'tokenA', type: 'address' },
            { name: 'tokenB', type: 'address' },
            { name: 'fee', type: 'uint24' },
        ],
        outputs: [{ name: 'pool', type: 'address' }],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'feeAmountTickSpacing',
        inputs: [{ name: 'fee', type: 'uint24' }],
        outputs: [{ name: 'tickSpacing', type: 'int24' }],
        stateMutability: 'view',
    },
    {
        type: 'event',
        name: 'PoolCreated',
        inputs: [
            { name: 'token0', type: 'address', indexed: true },
            { name: 'token1', type: 'address', indexed: true },
            { name: 'fee', type: 'uint24', indexed: true },
            { name: 'tickSpacing', type: 'int24', indexed: false },
            { name: 'pool', type: 'address', indexed: false },
        ],
    },
];
/** @deprecated Use AMM_V3_FACTORY_ABI instead */
export const UNISWAP_V3_FACTORY_ABI = AMM_V3_FACTORY_ABI;
