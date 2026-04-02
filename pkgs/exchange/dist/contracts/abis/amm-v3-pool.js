/**
 * AMM V3 Pool ABI
 * Compatible with Uniswap V3 Pool interface
 */
export const AMM_V3_POOL_ABI = [
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
        name: 'fee',
        inputs: [],
        outputs: [{ type: 'uint24' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'tickSpacing',
        inputs: [],
        outputs: [{ type: 'int24' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'liquidity',
        inputs: [],
        outputs: [{ type: 'uint128' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'slot0',
        inputs: [],
        outputs: [
            { name: 'sqrtPriceX96', type: 'uint160' },
            { name: 'tick', type: 'int24' },
            { name: 'observationIndex', type: 'uint16' },
            { name: 'observationCardinality', type: 'uint16' },
            { name: 'observationCardinalityNext', type: 'uint16' },
            { name: 'feeProtocol', type: 'uint8' },
            { name: 'unlocked', type: 'bool' },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'positions',
        inputs: [{ name: 'key', type: 'bytes32' }],
        outputs: [
            { name: 'liquidity', type: 'uint128' },
            { name: 'feeGrowthInside0LastX128', type: 'uint256' },
            { name: 'feeGrowthInside1LastX128', type: 'uint256' },
            { name: 'tokensOwed0', type: 'uint128' },
            { name: 'tokensOwed1', type: 'uint128' },
        ],
        stateMutability: 'view',
    },
    {
        type: 'event',
        name: 'Swap',
        inputs: [
            { name: 'sender', type: 'address', indexed: true },
            { name: 'recipient', type: 'address', indexed: true },
            { name: 'amount0', type: 'int256', indexed: false },
            { name: 'amount1', type: 'int256', indexed: false },
            { name: 'sqrtPriceX96', type: 'uint160', indexed: false },
            { name: 'liquidity', type: 'uint128', indexed: false },
            { name: 'tick', type: 'int24', indexed: false },
        ],
    },
];
/** @deprecated Use AMM_V3_POOL_ABI instead */
export const UNISWAP_V3_POOL_ABI = AMM_V3_POOL_ABI;
