/**
 * DEX SwapRouter Precompile ABI (0x0401)
 * Optimized swap routing via native precompile
 */
export const DEX_SWAP_ROUTER_ABI = [
  // Exact input single swap
  {
    type: 'function',
    name: 'exactInputSingle',
    inputs: [
      {
        name: 'params',
        type: 'tuple',
        components: [
          {
            name: 'poolKey',
            type: 'tuple',
            components: [
              { name: 'currency0', type: 'address' },
              { name: 'currency1', type: 'address' },
              { name: 'fee', type: 'uint24' },
              { name: 'tickSpacing', type: 'int24' },
              { name: 'hooks', type: 'address' },
            ],
          },
          { name: 'zeroForOne', type: 'bool' },
          { name: 'amountIn', type: 'uint256' },
          { name: 'amountOutMinimum', type: 'uint256' },
          { name: 'sqrtPriceLimitX96', type: 'uint160' },
          { name: 'hookData', type: 'bytes' },
        ],
      },
    ],
    outputs: [{ name: 'amountOut', type: 'uint256' }],
    stateMutability: 'payable',
  },

  // Exact output single swap
  {
    type: 'function',
    name: 'exactOutputSingle',
    inputs: [
      {
        name: 'params',
        type: 'tuple',
        components: [
          {
            name: 'poolKey',
            type: 'tuple',
            components: [
              { name: 'currency0', type: 'address' },
              { name: 'currency1', type: 'address' },
              { name: 'fee', type: 'uint24' },
              { name: 'tickSpacing', type: 'int24' },
              { name: 'hooks', type: 'address' },
            ],
          },
          { name: 'zeroForOne', type: 'bool' },
          { name: 'amountOut', type: 'uint256' },
          { name: 'amountInMaximum', type: 'uint256' },
          { name: 'sqrtPriceLimitX96', type: 'uint160' },
          { name: 'hookData', type: 'bytes' },
        ],
      },
    ],
    outputs: [{ name: 'amountIn', type: 'uint256' }],
    stateMutability: 'payable',
  },

  // Multi-hop exact input
  {
    type: 'function',
    name: 'exactInput',
    inputs: [
      {
        name: 'params',
        type: 'tuple',
        components: [
          { name: 'path', type: 'bytes' },
          { name: 'recipient', type: 'address' },
          { name: 'amountIn', type: 'uint256' },
          { name: 'amountOutMinimum', type: 'uint256' },
        ],
      },
    ],
    outputs: [{ name: 'amountOut', type: 'uint256' }],
    stateMutability: 'payable',
  },

  // Swap callback (called by PoolManager)
  {
    type: 'function',
    name: 'lockAcquired',
    inputs: [{ name: 'data', type: 'bytes' }],
    outputs: [{ name: 'result', type: 'bytes' }],
    stateMutability: 'nonpayable',
  },
] as const
