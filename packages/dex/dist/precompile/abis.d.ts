/**
 * DEX Precompile ABIs (LP-Aligned)
 * Native Go implementation at LP-9010 to LP-9040
 * Address format: 0x0000000000000000000000000000000000LPNUM
 */
/**
 * PoolManager ABI (0x0400)
 * Singleton contract managing all pools
 */
export declare const POOL_MANAGER_ABI: readonly [{
    readonly type: "function";
    readonly name: "initialize";
    readonly inputs: readonly [{
        readonly name: "key";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "currency0";
            readonly type: "address";
        }, {
            readonly name: "currency1";
            readonly type: "address";
        }, {
            readonly name: "fee";
            readonly type: "uint24";
        }, {
            readonly name: "tickSpacing";
            readonly type: "int24";
        }, {
            readonly name: "hooks";
            readonly type: "address";
        }];
    }, {
        readonly name: "sqrtPriceX96";
        readonly type: "uint160";
    }];
    readonly outputs: readonly [{
        readonly name: "tick";
        readonly type: "int24";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "swap";
    readonly inputs: readonly [{
        readonly name: "key";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "currency0";
            readonly type: "address";
        }, {
            readonly name: "currency1";
            readonly type: "address";
        }, {
            readonly name: "fee";
            readonly type: "uint24";
        }, {
            readonly name: "tickSpacing";
            readonly type: "int24";
        }, {
            readonly name: "hooks";
            readonly type: "address";
        }];
    }, {
        readonly name: "params";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "zeroForOne";
            readonly type: "bool";
        }, {
            readonly name: "amountSpecified";
            readonly type: "int256";
        }, {
            readonly name: "sqrtPriceLimitX96";
            readonly type: "uint160";
        }];
    }, {
        readonly name: "hookData";
        readonly type: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "delta";
        readonly type: "int256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "modifyLiquidity";
    readonly inputs: readonly [{
        readonly name: "key";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "currency0";
            readonly type: "address";
        }, {
            readonly name: "currency1";
            readonly type: "address";
        }, {
            readonly name: "fee";
            readonly type: "uint24";
        }, {
            readonly name: "tickSpacing";
            readonly type: "int24";
        }, {
            readonly name: "hooks";
            readonly type: "address";
        }];
    }, {
        readonly name: "params";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "tickLower";
            readonly type: "int24";
        }, {
            readonly name: "tickUpper";
            readonly type: "int24";
        }, {
            readonly name: "liquidityDelta";
            readonly type: "int256";
        }, {
            readonly name: "salt";
            readonly type: "bytes32";
        }];
    }, {
        readonly name: "hookData";
        readonly type: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "callerDelta";
        readonly type: "int256";
    }, {
        readonly name: "feesAccrued";
        readonly type: "int256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "settle";
    readonly inputs: readonly [{
        readonly name: "currency";
        readonly type: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "amount";
        readonly type: "uint256";
    }];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "take";
    readonly inputs: readonly [{
        readonly name: "currency";
        readonly type: "address";
    }, {
        readonly name: "to";
        readonly type: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "getSlot0";
    readonly inputs: readonly [{
        readonly name: "key";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "currency0";
            readonly type: "address";
        }, {
            readonly name: "currency1";
            readonly type: "address";
        }, {
            readonly name: "fee";
            readonly type: "uint24";
        }, {
            readonly name: "tickSpacing";
            readonly type: "int24";
        }, {
            readonly name: "hooks";
            readonly type: "address";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "sqrtPriceX96";
        readonly type: "uint160";
    }, {
        readonly name: "tick";
        readonly type: "int24";
    }, {
        readonly name: "protocolFee";
        readonly type: "uint24";
    }, {
        readonly name: "lpFee";
        readonly type: "uint24";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getLiquidity";
    readonly inputs: readonly [{
        readonly name: "key";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "currency0";
            readonly type: "address";
        }, {
            readonly name: "currency1";
            readonly type: "address";
        }, {
            readonly name: "fee";
            readonly type: "uint24";
        }, {
            readonly name: "tickSpacing";
            readonly type: "int24";
        }, {
            readonly name: "hooks";
            readonly type: "address";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "liquidity";
        readonly type: "uint128";
    }];
    readonly stateMutability: "view";
}];
/**
 * SwapRouter ABI (0x0401)
 * Optimized swap routing
 */
export declare const SWAP_ROUTER_ABI: readonly [{
    readonly type: "function";
    readonly name: "exactInputSingle";
    readonly inputs: readonly [{
        readonly name: "params";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "poolKey";
            readonly type: "tuple";
            readonly components: readonly [{
                readonly name: "currency0";
                readonly type: "address";
            }, {
                readonly name: "currency1";
                readonly type: "address";
            }, {
                readonly name: "fee";
                readonly type: "uint24";
            }, {
                readonly name: "tickSpacing";
                readonly type: "int24";
            }, {
                readonly name: "hooks";
                readonly type: "address";
            }];
        }, {
            readonly name: "zeroForOne";
            readonly type: "bool";
        }, {
            readonly name: "amountIn";
            readonly type: "uint256";
        }, {
            readonly name: "amountOutMinimum";
            readonly type: "uint256";
        }, {
            readonly name: "sqrtPriceLimitX96";
            readonly type: "uint160";
        }, {
            readonly name: "hookData";
            readonly type: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "amountOut";
        readonly type: "uint256";
    }];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "exactOutputSingle";
    readonly inputs: readonly [{
        readonly name: "params";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "poolKey";
            readonly type: "tuple";
            readonly components: readonly [{
                readonly name: "currency0";
                readonly type: "address";
            }, {
                readonly name: "currency1";
                readonly type: "address";
            }, {
                readonly name: "fee";
                readonly type: "uint24";
            }, {
                readonly name: "tickSpacing";
                readonly type: "int24";
            }, {
                readonly name: "hooks";
                readonly type: "address";
            }];
        }, {
            readonly name: "zeroForOne";
            readonly type: "bool";
        }, {
            readonly name: "amountOut";
            readonly type: "uint256";
        }, {
            readonly name: "amountInMaximum";
            readonly type: "uint256";
        }, {
            readonly name: "sqrtPriceLimitX96";
            readonly type: "uint160";
        }, {
            readonly name: "hookData";
            readonly type: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "amountIn";
        readonly type: "uint256";
    }];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "exactInput";
    readonly inputs: readonly [{
        readonly name: "params";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "path";
            readonly type: "bytes";
        }, {
            readonly name: "amountIn";
            readonly type: "uint256";
        }, {
            readonly name: "amountOutMinimum";
            readonly type: "uint256";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "amountOut";
        readonly type: "uint256";
    }];
    readonly stateMutability: "payable";
}];
/**
 * HooksRegistry ABI (0x0402)
 * Registry for hook contracts
 */
export declare const HOOKS_REGISTRY_ABI: readonly [{
    readonly type: "function";
    readonly name: "registerHook";
    readonly inputs: readonly [{
        readonly name: "hook";
        readonly type: "address";
    }, {
        readonly name: "permissions";
        readonly type: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "getHookPermissions";
    readonly inputs: readonly [{
        readonly name: "hook";
        readonly type: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "permissions";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
}];
/**
 * FlashLoan ABI (0x0403)
 * Flash loan facility
 */
export declare const FLASH_LOAN_ABI: readonly [{
    readonly type: "function";
    readonly name: "flash";
    readonly inputs: readonly [{
        readonly name: "recipient";
        readonly type: "address";
    }, {
        readonly name: "currency";
        readonly type: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint256";
    }, {
        readonly name: "data";
        readonly type: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}];
/**
 * LXBook ABI (LP-9020)
 * Permissionless orderbooks with Hyperliquid-style execute() endpoint
 */
export declare const LX_BOOK_ABI: readonly [{
    readonly type: "function";
    readonly name: "execute";
    readonly inputs: readonly [{
        readonly name: "action";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "actionType";
            readonly type: "uint8";
        }, {
            readonly name: "nonce";
            readonly type: "uint64";
        }, {
            readonly name: "expiresAfter";
            readonly type: "uint64";
        }, {
            readonly name: "data";
            readonly type: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "result";
        readonly type: "bytes";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "executeBatch";
    readonly inputs: readonly [{
        readonly name: "actions";
        readonly type: "tuple[]";
        readonly components: readonly [{
            readonly name: "actionType";
            readonly type: "uint8";
        }, {
            readonly name: "nonce";
            readonly type: "uint64";
        }, {
            readonly name: "expiresAfter";
            readonly type: "uint64";
        }, {
            readonly name: "data";
            readonly type: "bytes";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "results";
        readonly type: "bytes[]";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "createMarket";
    readonly inputs: readonly [{
        readonly name: "cfg";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "baseAsset";
            readonly type: "bytes32";
        }, {
            readonly name: "quoteAsset";
            readonly type: "bytes32";
        }, {
            readonly name: "tickSizeX18";
            readonly type: "uint128";
        }, {
            readonly name: "lotSizeX18";
            readonly type: "uint128";
        }, {
            readonly name: "makerFeePpm";
            readonly type: "uint32";
        }, {
            readonly name: "takerFeePpm";
            readonly type: "uint32";
        }, {
            readonly name: "feedId";
            readonly type: "bytes32";
        }, {
            readonly name: "initialStatus";
            readonly type: "uint8";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "marketId";
        readonly type: "uint32";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "getL1";
    readonly inputs: readonly [{
        readonly name: "marketId";
        readonly type: "uint32";
    }];
    readonly outputs: readonly [{
        readonly name: "l1";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "bestBidPxX18";
            readonly type: "uint128";
        }, {
            readonly name: "bestBidSzX18";
            readonly type: "uint128";
        }, {
            readonly name: "bestAskPxX18";
            readonly type: "uint128";
        }, {
            readonly name: "bestAskSzX18";
            readonly type: "uint128";
        }, {
            readonly name: "lastTradePxX18";
            readonly type: "uint128";
        }];
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getMarketConfig";
    readonly inputs: readonly [{
        readonly name: "marketId";
        readonly type: "uint32";
    }];
    readonly outputs: readonly [{
        readonly name: "cfg";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "baseAsset";
            readonly type: "bytes32";
        }, {
            readonly name: "quoteAsset";
            readonly type: "bytes32";
        }, {
            readonly name: "tickSizeX18";
            readonly type: "uint128";
        }, {
            readonly name: "lotSizeX18";
            readonly type: "uint128";
        }, {
            readonly name: "makerFeePpm";
            readonly type: "uint32";
        }, {
            readonly name: "takerFeePpm";
            readonly type: "uint32";
        }, {
            readonly name: "feedId";
            readonly type: "bytes32";
        }, {
            readonly name: "initialStatus";
            readonly type: "uint8";
        }];
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getMarketStatus";
    readonly inputs: readonly [{
        readonly name: "marketId";
        readonly type: "uint32";
    }];
    readonly outputs: readonly [{
        readonly name: "status";
        readonly type: "uint8";
    }];
    readonly stateMutability: "view";
}];
/**
 * LXVault ABI (LP-9030)
 * Balances, margin, collateral, liquidations
 */
export declare const LX_VAULT_ABI: readonly [{
    readonly type: "function";
    readonly name: "deposit";
    readonly inputs: readonly [{
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint128";
    }, {
        readonly name: "subaccountId";
        readonly type: "uint8";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "withdraw";
    readonly inputs: readonly [{
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint128";
    }, {
        readonly name: "subaccountId";
        readonly type: "uint8";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "transfer";
    readonly inputs: readonly [{
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly name: "amount";
        readonly type: "uint128";
    }, {
        readonly name: "fromSubaccount";
        readonly type: "uint8";
    }, {
        readonly name: "toSubaccount";
        readonly type: "uint8";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "getBalance";
    readonly inputs: readonly [{
        readonly name: "account";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "main";
            readonly type: "address";
        }, {
            readonly name: "subaccountId";
            readonly type: "uint8";
        }];
    }, {
        readonly name: "token";
        readonly type: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "balance";
        readonly type: "uint128";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getPosition";
    readonly inputs: readonly [{
        readonly name: "account";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "main";
            readonly type: "address";
        }, {
            readonly name: "subaccountId";
            readonly type: "uint8";
        }];
    }, {
        readonly name: "marketId";
        readonly type: "uint32";
    }];
    readonly outputs: readonly [{
        readonly name: "position";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "marketId";
            readonly type: "uint32";
        }, {
            readonly name: "side";
            readonly type: "uint8";
        }, {
            readonly name: "sizeX18";
            readonly type: "uint128";
        }, {
            readonly name: "entryPxX18";
            readonly type: "uint128";
        }, {
            readonly name: "unrealizedPnlX18";
            readonly type: "uint128";
        }, {
            readonly name: "accumulatedFundingX18";
            readonly type: "int128";
        }, {
            readonly name: "lastFundingTime";
            readonly type: "uint64";
        }];
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getMargin";
    readonly inputs: readonly [{
        readonly name: "account";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "main";
            readonly type: "address";
        }, {
            readonly name: "subaccountId";
            readonly type: "uint8";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "info";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "totalCollateralX18";
            readonly type: "uint128";
        }, {
            readonly name: "usedMarginX18";
            readonly type: "uint128";
        }, {
            readonly name: "freeMarginX18";
            readonly type: "uint128";
        }, {
            readonly name: "marginRatioX18";
            readonly type: "uint128";
        }, {
            readonly name: "maintenanceMarginX18";
            readonly type: "uint128";
        }, {
            readonly name: "liquidatable";
            readonly type: "bool";
        }];
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "isLiquidatable";
    readonly inputs: readonly [{
        readonly name: "account";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "main";
            readonly type: "address";
        }, {
            readonly name: "subaccountId";
            readonly type: "uint8";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "liquidatable";
        readonly type: "bool";
    }, {
        readonly name: "shortfall";
        readonly type: "uint128";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "liquidate";
    readonly inputs: readonly [{
        readonly name: "account";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "main";
            readonly type: "address";
        }, {
            readonly name: "subaccountId";
            readonly type: "uint8";
        }];
    }, {
        readonly name: "marketId";
        readonly type: "uint32";
    }, {
        readonly name: "sizeX18";
        readonly type: "uint128";
    }];
    readonly outputs: readonly [{
        readonly name: "result";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "liquidated";
            readonly type: "tuple";
            readonly components: readonly [{
                readonly name: "main";
                readonly type: "address";
            }, {
                readonly name: "subaccountId";
                readonly type: "uint8";
            }];
        }, {
            readonly name: "liquidator";
            readonly type: "tuple";
            readonly components: readonly [{
                readonly name: "main";
                readonly type: "address";
            }, {
                readonly name: "subaccountId";
                readonly type: "uint8";
            }];
        }, {
            readonly name: "marketId";
            readonly type: "uint32";
        }, {
            readonly name: "sizeX18";
            readonly type: "uint128";
        }, {
            readonly name: "priceX18";
            readonly type: "uint128";
        }, {
            readonly name: "penaltyX18";
            readonly type: "uint128";
        }, {
            readonly name: "adlTriggered";
            readonly type: "bool";
        }];
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "getFundingRate";
    readonly inputs: readonly [{
        readonly name: "marketId";
        readonly type: "uint32";
    }];
    readonly outputs: readonly [{
        readonly name: "rateX18";
        readonly type: "int128";
    }, {
        readonly name: "nextFundingTime";
        readonly type: "uint64";
    }];
    readonly stateMutability: "view";
}];
/**
 * LXFeed ABI (LP-9040)
 * Mark price, index price, funding calculations
 */
export declare const LX_FEED_ABI: readonly [{
    readonly type: "function";
    readonly name: "getMarkPrice";
    readonly inputs: readonly [{
        readonly name: "marketId";
        readonly type: "uint32";
    }];
    readonly outputs: readonly [{
        readonly name: "mark";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "indexPxX18";
            readonly type: "uint128";
        }, {
            readonly name: "markPxX18";
            readonly type: "uint128";
        }, {
            readonly name: "premiumX18";
            readonly type: "int128";
        }, {
            readonly name: "timestamp";
            readonly type: "uint64";
        }];
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getIndexPrice";
    readonly inputs: readonly [{
        readonly name: "marketId";
        readonly type: "uint32";
    }];
    readonly outputs: readonly [{
        readonly name: "priceX18";
        readonly type: "uint128";
    }, {
        readonly name: "timestamp";
        readonly type: "uint64";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getFundingRate";
    readonly inputs: readonly [{
        readonly name: "marketId";
        readonly type: "uint32";
    }];
    readonly outputs: readonly [{
        readonly name: "rateX18";
        readonly type: "int128";
    }, {
        readonly name: "nextFundingTime";
        readonly type: "uint64";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getTriggerPrice";
    readonly inputs: readonly [{
        readonly name: "marketId";
        readonly type: "uint32";
    }, {
        readonly name: "isBuy";
        readonly type: "bool";
    }];
    readonly outputs: readonly [{
        readonly name: "priceX18";
        readonly type: "uint128";
    }];
    readonly stateMutability: "view";
}];
/**
 * LXOracle ABI (LP-9011)
 * Multi-source price aggregation
 */
export declare const LX_ORACLE_ABI: readonly [{
    readonly type: "function";
    readonly name: "getPrice";
    readonly inputs: readonly [{
        readonly name: "baseToken";
        readonly type: "address";
    }, {
        readonly name: "quoteToken";
        readonly type: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "price";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "price";
            readonly type: "uint256";
        }, {
            readonly name: "confidence";
            readonly type: "uint256";
        }, {
            readonly name: "timestamp";
            readonly type: "uint256";
        }, {
            readonly name: "source";
            readonly type: "uint8";
        }, {
            readonly name: "expo";
            readonly type: "int32";
        }];
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "getAggregatedPrice";
    readonly inputs: readonly [{
        readonly name: "baseToken";
        readonly type: "address";
    }, {
        readonly name: "quoteToken";
        readonly type: "address";
    }, {
        readonly name: "maxStaleness";
        readonly type: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "aggregated";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "price";
            readonly type: "uint256";
        }, {
            readonly name: "minPrice";
            readonly type: "uint256";
        }, {
            readonly name: "maxPrice";
            readonly type: "uint256";
        }, {
            readonly name: "deviation";
            readonly type: "uint256";
        }, {
            readonly name: "numSources";
            readonly type: "uint256";
        }, {
            readonly name: "timestamp";
            readonly type: "uint256";
        }];
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "isPriceFresh";
    readonly inputs: readonly [{
        readonly name: "baseToken";
        readonly type: "address";
    }, {
        readonly name: "quoteToken";
        readonly type: "address";
    }, {
        readonly name: "maxStaleness";
        readonly type: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "fresh";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
}];
//# sourceMappingURL=abis.d.ts.map