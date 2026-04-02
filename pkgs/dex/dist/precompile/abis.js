/**
 * DEX Precompile ABIs (LP-Aligned)
 * Native Go implementation at LP-9010 to LP-9040
 * Address format: 0x0000000000000000000000000000000000LPNUM
 */
/**
 * PoolManager ABI (0x0400)
 * Singleton contract managing all pools
 */
export const POOL_MANAGER_ABI = [
    // Initialize a new pool
    {
        type: 'function',
        name: 'initialize',
        inputs: [
            {
                name: 'key',
                type: 'tuple',
                components: [
                    { name: 'currency0', type: 'address' },
                    { name: 'currency1', type: 'address' },
                    { name: 'fee', type: 'uint24' },
                    { name: 'tickSpacing', type: 'int24' },
                    { name: 'hooks', type: 'address' },
                ],
            },
            { name: 'sqrtPriceX96', type: 'uint160' },
        ],
        outputs: [{ name: 'tick', type: 'int24' }],
        stateMutability: 'nonpayable',
    },
    // Execute a swap
    {
        type: 'function',
        name: 'swap',
        inputs: [
            {
                name: 'key',
                type: 'tuple',
                components: [
                    { name: 'currency0', type: 'address' },
                    { name: 'currency1', type: 'address' },
                    { name: 'fee', type: 'uint24' },
                    { name: 'tickSpacing', type: 'int24' },
                    { name: 'hooks', type: 'address' },
                ],
            },
            {
                name: 'params',
                type: 'tuple',
                components: [
                    { name: 'zeroForOne', type: 'bool' },
                    { name: 'amountSpecified', type: 'int256' },
                    { name: 'sqrtPriceLimitX96', type: 'uint160' },
                ],
            },
            { name: 'hookData', type: 'bytes' },
        ],
        outputs: [{ name: 'delta', type: 'int256' }],
        stateMutability: 'nonpayable',
    },
    // Modify liquidity
    {
        type: 'function',
        name: 'modifyLiquidity',
        inputs: [
            {
                name: 'key',
                type: 'tuple',
                components: [
                    { name: 'currency0', type: 'address' },
                    { name: 'currency1', type: 'address' },
                    { name: 'fee', type: 'uint24' },
                    { name: 'tickSpacing', type: 'int24' },
                    { name: 'hooks', type: 'address' },
                ],
            },
            {
                name: 'params',
                type: 'tuple',
                components: [
                    { name: 'tickLower', type: 'int24' },
                    { name: 'tickUpper', type: 'int24' },
                    { name: 'liquidityDelta', type: 'int256' },
                    { name: 'salt', type: 'bytes32' },
                ],
            },
            { name: 'hookData', type: 'bytes' },
        ],
        outputs: [
            { name: 'callerDelta', type: 'int256' },
            { name: 'feesAccrued', type: 'int256' },
        ],
        stateMutability: 'nonpayable',
    },
    // Settle outstanding balance
    {
        type: 'function',
        name: 'settle',
        inputs: [{ name: 'currency', type: 'address' }],
        outputs: [{ name: 'amount', type: 'uint256' }],
        stateMutability: 'payable',
    },
    // Take tokens from pool
    {
        type: 'function',
        name: 'take',
        inputs: [
            { name: 'currency', type: 'address' },
            { name: 'to', type: 'address' },
            { name: 'amount', type: 'uint256' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    // Get pool state
    {
        type: 'function',
        name: 'getSlot0',
        inputs: [
            {
                name: 'key',
                type: 'tuple',
                components: [
                    { name: 'currency0', type: 'address' },
                    { name: 'currency1', type: 'address' },
                    { name: 'fee', type: 'uint24' },
                    { name: 'tickSpacing', type: 'int24' },
                    { name: 'hooks', type: 'address' },
                ],
            },
        ],
        outputs: [
            { name: 'sqrtPriceX96', type: 'uint160' },
            { name: 'tick', type: 'int24' },
            { name: 'protocolFee', type: 'uint24' },
            { name: 'lpFee', type: 'uint24' },
        ],
        stateMutability: 'view',
    },
    // Get liquidity
    {
        type: 'function',
        name: 'getLiquidity',
        inputs: [
            {
                name: 'key',
                type: 'tuple',
                components: [
                    { name: 'currency0', type: 'address' },
                    { name: 'currency1', type: 'address' },
                    { name: 'fee', type: 'uint24' },
                    { name: 'tickSpacing', type: 'int24' },
                    { name: 'hooks', type: 'address' },
                ],
            },
        ],
        outputs: [{ name: 'liquidity', type: 'uint128' }],
        stateMutability: 'view',
    },
];
/**
 * SwapRouter ABI (0x0401)
 * Optimized swap routing
 */
export const SWAP_ROUTER_ABI = [
    // Single swap (exact input)
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
    // Single swap (exact output)
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
    // Multi-hop swap
    {
        type: 'function',
        name: 'exactInput',
        inputs: [
            {
                name: 'params',
                type: 'tuple',
                components: [
                    { name: 'path', type: 'bytes' },
                    { name: 'amountIn', type: 'uint256' },
                    { name: 'amountOutMinimum', type: 'uint256' },
                ],
            },
        ],
        outputs: [{ name: 'amountOut', type: 'uint256' }],
        stateMutability: 'payable',
    },
];
/**
 * HooksRegistry ABI (0x0402)
 * Registry for hook contracts
 */
export const HOOKS_REGISTRY_ABI = [
    {
        type: 'function',
        name: 'registerHook',
        inputs: [
            { name: 'hook', type: 'address' },
            { name: 'permissions', type: 'uint256' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'getHookPermissions',
        inputs: [{ name: 'hook', type: 'address' }],
        outputs: [{ name: 'permissions', type: 'uint256' }],
        stateMutability: 'view',
    },
];
/**
 * FlashLoan ABI (0x0403)
 * Flash loan facility
 */
export const FLASH_LOAN_ABI = [
    {
        type: 'function',
        name: 'flash',
        inputs: [
            { name: 'recipient', type: 'address' },
            { name: 'currency', type: 'address' },
            { name: 'amount', type: 'uint256' },
            { name: 'data', type: 'bytes' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
];
// ============================================================================
// LXBook ABI (LP-9020) - CLOB Matching Engine
// ============================================================================
/**
 * LXBook ABI (LP-9020)
 * Permissionless orderbooks with Hyperliquid-style execute() endpoint
 */
export const LX_BOOK_ABI = [
    // Hyperliquid-style execute endpoint
    {
        type: 'function',
        name: 'execute',
        inputs: [
            {
                name: 'action',
                type: 'tuple',
                components: [
                    { name: 'actionType', type: 'uint8' },
                    { name: 'nonce', type: 'uint64' },
                    { name: 'expiresAfter', type: 'uint64' },
                    { name: 'data', type: 'bytes' },
                ],
            },
        ],
        outputs: [{ name: 'result', type: 'bytes' }],
        stateMutability: 'nonpayable',
    },
    // Batch execute
    {
        type: 'function',
        name: 'executeBatch',
        inputs: [
            {
                name: 'actions',
                type: 'tuple[]',
                components: [
                    { name: 'actionType', type: 'uint8' },
                    { name: 'nonce', type: 'uint64' },
                    { name: 'expiresAfter', type: 'uint64' },
                    { name: 'data', type: 'bytes' },
                ],
            },
        ],
        outputs: [{ name: 'results', type: 'bytes[]' }],
        stateMutability: 'nonpayable',
    },
    // Create market
    {
        type: 'function',
        name: 'createMarket',
        inputs: [
            {
                name: 'cfg',
                type: 'tuple',
                components: [
                    { name: 'baseAsset', type: 'bytes32' },
                    { name: 'quoteAsset', type: 'bytes32' },
                    { name: 'tickSizeX18', type: 'uint128' },
                    { name: 'lotSizeX18', type: 'uint128' },
                    { name: 'makerFeePpm', type: 'uint32' },
                    { name: 'takerFeePpm', type: 'uint32' },
                    { name: 'feedId', type: 'bytes32' },
                    { name: 'initialStatus', type: 'uint8' },
                ],
            },
        ],
        outputs: [{ name: 'marketId', type: 'uint32' }],
        stateMutability: 'nonpayable',
    },
    // Get L1 (best bid/ask)
    {
        type: 'function',
        name: 'getL1',
        inputs: [{ name: 'marketId', type: 'uint32' }],
        outputs: [
            {
                name: 'l1',
                type: 'tuple',
                components: [
                    { name: 'bestBidPxX18', type: 'uint128' },
                    { name: 'bestBidSzX18', type: 'uint128' },
                    { name: 'bestAskPxX18', type: 'uint128' },
                    { name: 'bestAskSzX18', type: 'uint128' },
                    { name: 'lastTradePxX18', type: 'uint128' },
                ],
            },
        ],
        stateMutability: 'view',
    },
    // Get market config
    {
        type: 'function',
        name: 'getMarketConfig',
        inputs: [{ name: 'marketId', type: 'uint32' }],
        outputs: [
            {
                name: 'cfg',
                type: 'tuple',
                components: [
                    { name: 'baseAsset', type: 'bytes32' },
                    { name: 'quoteAsset', type: 'bytes32' },
                    { name: 'tickSizeX18', type: 'uint128' },
                    { name: 'lotSizeX18', type: 'uint128' },
                    { name: 'makerFeePpm', type: 'uint32' },
                    { name: 'takerFeePpm', type: 'uint32' },
                    { name: 'feedId', type: 'bytes32' },
                    { name: 'initialStatus', type: 'uint8' },
                ],
            },
        ],
        stateMutability: 'view',
    },
    // Get market status
    {
        type: 'function',
        name: 'getMarketStatus',
        inputs: [{ name: 'marketId', type: 'uint32' }],
        outputs: [{ name: 'status', type: 'uint8' }],
        stateMutability: 'view',
    },
];
// ============================================================================
// LXVault ABI (LP-9030) - Custody and Risk Engine
// ============================================================================
/**
 * LXVault ABI (LP-9030)
 * Balances, margin, collateral, liquidations
 */
export const LX_VAULT_ABI = [
    // Deposit
    {
        type: 'function',
        name: 'deposit',
        inputs: [
            { name: 'token', type: 'address' },
            { name: 'amount', type: 'uint128' },
            { name: 'subaccountId', type: 'uint8' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    // Withdraw
    {
        type: 'function',
        name: 'withdraw',
        inputs: [
            { name: 'token', type: 'address' },
            { name: 'amount', type: 'uint128' },
            { name: 'subaccountId', type: 'uint8' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    // Transfer between subaccounts
    {
        type: 'function',
        name: 'transfer',
        inputs: [
            { name: 'token', type: 'address' },
            { name: 'amount', type: 'uint128' },
            { name: 'fromSubaccount', type: 'uint8' },
            { name: 'toSubaccount', type: 'uint8' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    // Get balance
    {
        type: 'function',
        name: 'getBalance',
        inputs: [
            {
                name: 'account',
                type: 'tuple',
                components: [
                    { name: 'main', type: 'address' },
                    { name: 'subaccountId', type: 'uint8' },
                ],
            },
            { name: 'token', type: 'address' },
        ],
        outputs: [{ name: 'balance', type: 'uint128' }],
        stateMutability: 'view',
    },
    // Get position
    {
        type: 'function',
        name: 'getPosition',
        inputs: [
            {
                name: 'account',
                type: 'tuple',
                components: [
                    { name: 'main', type: 'address' },
                    { name: 'subaccountId', type: 'uint8' },
                ],
            },
            { name: 'marketId', type: 'uint32' },
        ],
        outputs: [
            {
                name: 'position',
                type: 'tuple',
                components: [
                    { name: 'marketId', type: 'uint32' },
                    { name: 'side', type: 'uint8' },
                    { name: 'sizeX18', type: 'uint128' },
                    { name: 'entryPxX18', type: 'uint128' },
                    { name: 'unrealizedPnlX18', type: 'uint128' },
                    { name: 'accumulatedFundingX18', type: 'int128' },
                    { name: 'lastFundingTime', type: 'uint64' },
                ],
            },
        ],
        stateMutability: 'view',
    },
    // Get margin info
    {
        type: 'function',
        name: 'getMargin',
        inputs: [
            {
                name: 'account',
                type: 'tuple',
                components: [
                    { name: 'main', type: 'address' },
                    { name: 'subaccountId', type: 'uint8' },
                ],
            },
        ],
        outputs: [
            {
                name: 'info',
                type: 'tuple',
                components: [
                    { name: 'totalCollateralX18', type: 'uint128' },
                    { name: 'usedMarginX18', type: 'uint128' },
                    { name: 'freeMarginX18', type: 'uint128' },
                    { name: 'marginRatioX18', type: 'uint128' },
                    { name: 'maintenanceMarginX18', type: 'uint128' },
                    { name: 'liquidatable', type: 'bool' },
                ],
            },
        ],
        stateMutability: 'view',
    },
    // Check if liquidatable
    {
        type: 'function',
        name: 'isLiquidatable',
        inputs: [
            {
                name: 'account',
                type: 'tuple',
                components: [
                    { name: 'main', type: 'address' },
                    { name: 'subaccountId', type: 'uint8' },
                ],
            },
        ],
        outputs: [
            { name: 'liquidatable', type: 'bool' },
            { name: 'shortfall', type: 'uint128' },
        ],
        stateMutability: 'view',
    },
    // Liquidate
    {
        type: 'function',
        name: 'liquidate',
        inputs: [
            {
                name: 'account',
                type: 'tuple',
                components: [
                    { name: 'main', type: 'address' },
                    { name: 'subaccountId', type: 'uint8' },
                ],
            },
            { name: 'marketId', type: 'uint32' },
            { name: 'sizeX18', type: 'uint128' },
        ],
        outputs: [
            {
                name: 'result',
                type: 'tuple',
                components: [
                    {
                        name: 'liquidated',
                        type: 'tuple',
                        components: [
                            { name: 'main', type: 'address' },
                            { name: 'subaccountId', type: 'uint8' },
                        ],
                    },
                    {
                        name: 'liquidator',
                        type: 'tuple',
                        components: [
                            { name: 'main', type: 'address' },
                            { name: 'subaccountId', type: 'uint8' },
                        ],
                    },
                    { name: 'marketId', type: 'uint32' },
                    { name: 'sizeX18', type: 'uint128' },
                    { name: 'priceX18', type: 'uint128' },
                    { name: 'penaltyX18', type: 'uint128' },
                    { name: 'adlTriggered', type: 'bool' },
                ],
            },
        ],
        stateMutability: 'nonpayable',
    },
    // Get funding rate
    {
        type: 'function',
        name: 'getFundingRate',
        inputs: [{ name: 'marketId', type: 'uint32' }],
        outputs: [
            { name: 'rateX18', type: 'int128' },
            { name: 'nextFundingTime', type: 'uint64' },
        ],
        stateMutability: 'view',
    },
];
// ============================================================================
// LXFeed ABI (LP-9040) - Price Feeds
// ============================================================================
/**
 * LXFeed ABI (LP-9040)
 * Mark price, index price, funding calculations
 */
export const LX_FEED_ABI = [
    // Get mark price
    {
        type: 'function',
        name: 'getMarkPrice',
        inputs: [{ name: 'marketId', type: 'uint32' }],
        outputs: [
            {
                name: 'mark',
                type: 'tuple',
                components: [
                    { name: 'indexPxX18', type: 'uint128' },
                    { name: 'markPxX18', type: 'uint128' },
                    { name: 'premiumX18', type: 'int128' },
                    { name: 'timestamp', type: 'uint64' },
                ],
            },
        ],
        stateMutability: 'view',
    },
    // Get index price
    {
        type: 'function',
        name: 'getIndexPrice',
        inputs: [{ name: 'marketId', type: 'uint32' }],
        outputs: [
            { name: 'priceX18', type: 'uint128' },
            { name: 'timestamp', type: 'uint64' },
        ],
        stateMutability: 'view',
    },
    // Get funding rate
    {
        type: 'function',
        name: 'getFundingRate',
        inputs: [{ name: 'marketId', type: 'uint32' }],
        outputs: [
            { name: 'rateX18', type: 'int128' },
            { name: 'nextFundingTime', type: 'uint64' },
        ],
        stateMutability: 'view',
    },
    // Get trigger price for order
    {
        type: 'function',
        name: 'getTriggerPrice',
        inputs: [
            { name: 'marketId', type: 'uint32' },
            { name: 'isBuy', type: 'bool' },
        ],
        outputs: [{ name: 'priceX18', type: 'uint128' }],
        stateMutability: 'view',
    },
];
// ============================================================================
// LXOracle ABI (LP-9011) - Price Oracle
// ============================================================================
/**
 * LXOracle ABI (LP-9011)
 * Multi-source price aggregation
 */
export const LX_ORACLE_ABI = [
    // Get price
    {
        type: 'function',
        name: 'getPrice',
        inputs: [
            { name: 'baseToken', type: 'address' },
            { name: 'quoteToken', type: 'address' },
        ],
        outputs: [
            {
                name: 'price',
                type: 'tuple',
                components: [
                    { name: 'price', type: 'uint256' },
                    { name: 'confidence', type: 'uint256' },
                    { name: 'timestamp', type: 'uint256' },
                    { name: 'source', type: 'uint8' },
                    { name: 'expo', type: 'int32' },
                ],
            },
        ],
        stateMutability: 'view',
    },
    // Get aggregated price
    {
        type: 'function',
        name: 'getAggregatedPrice',
        inputs: [
            { name: 'baseToken', type: 'address' },
            { name: 'quoteToken', type: 'address' },
            { name: 'maxStaleness', type: 'uint256' },
        ],
        outputs: [
            {
                name: 'aggregated',
                type: 'tuple',
                components: [
                    { name: 'price', type: 'uint256' },
                    { name: 'minPrice', type: 'uint256' },
                    { name: 'maxPrice', type: 'uint256' },
                    { name: 'deviation', type: 'uint256' },
                    { name: 'numSources', type: 'uint256' },
                    { name: 'timestamp', type: 'uint256' },
                ],
            },
        ],
        stateMutability: 'view',
    },
    // Check if price is fresh
    {
        type: 'function',
        name: 'isPriceFresh',
        inputs: [
            { name: 'baseToken', type: 'address' },
            { name: 'quoteToken', type: 'address' },
            { name: 'maxStaleness', type: 'uint256' },
        ],
        outputs: [{ name: 'fresh', type: 'bool' }],
        stateMutability: 'view',
    },
];
