/**
 * PoolManager Precompile ABI (0x0400)
 * Native Uniswap v4-style AMM implementation
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
    }, {
        readonly name: "hookData";
        readonly type: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "tick";
        readonly type: "int24";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "lock";
    readonly inputs: readonly [{
        readonly name: "data";
        readonly type: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "result";
        readonly type: "bytes";
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
        readonly name: "delta";
        readonly type: "int256";
    }, {
        readonly name: "feeDelta";
        readonly type: "int256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "donate";
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
        readonly name: "amount0";
        readonly type: "uint256";
    }, {
        readonly name: "amount1";
        readonly type: "uint256";
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
    readonly name: "settle";
    readonly inputs: readonly [{
        readonly name: "currency";
        readonly type: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "paid";
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
        readonly name: "poolId";
        readonly type: "bytes32";
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
        readonly name: "poolId";
        readonly type: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "liquidity";
        readonly type: "uint128";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "event";
    readonly name: "Initialize";
    readonly inputs: readonly [{
        readonly name: "id";
        readonly type: "bytes32";
        readonly indexed: true;
    }, {
        readonly name: "currency0";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "currency1";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "fee";
        readonly type: "uint24";
        readonly indexed: false;
    }, {
        readonly name: "tickSpacing";
        readonly type: "int24";
        readonly indexed: false;
    }, {
        readonly name: "hooks";
        readonly type: "address";
        readonly indexed: false;
    }, {
        readonly name: "sqrtPriceX96";
        readonly type: "uint160";
        readonly indexed: false;
    }, {
        readonly name: "tick";
        readonly type: "int24";
        readonly indexed: false;
    }];
}, {
    readonly type: "event";
    readonly name: "Swap";
    readonly inputs: readonly [{
        readonly name: "id";
        readonly type: "bytes32";
        readonly indexed: true;
    }, {
        readonly name: "sender";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "amount0";
        readonly type: "int128";
        readonly indexed: false;
    }, {
        readonly name: "amount1";
        readonly type: "int128";
        readonly indexed: false;
    }, {
        readonly name: "sqrtPriceX96";
        readonly type: "uint160";
        readonly indexed: false;
    }, {
        readonly name: "liquidity";
        readonly type: "uint128";
        readonly indexed: false;
    }, {
        readonly name: "tick";
        readonly type: "int24";
        readonly indexed: false;
    }, {
        readonly name: "fee";
        readonly type: "uint24";
        readonly indexed: false;
    }];
}];
//# sourceMappingURL=pool-manager.d.ts.map