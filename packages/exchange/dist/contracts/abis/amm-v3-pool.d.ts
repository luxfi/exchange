/**
 * AMM V3 Pool ABI
 * Compatible with Uniswap V3 Pool interface
 */
export declare const AMM_V3_POOL_ABI: readonly [{
    readonly type: "function";
    readonly name: "token0";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly type: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "token1";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly type: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "fee";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly type: "uint24";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "tickSpacing";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly type: "int24";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "liquidity";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly type: "uint128";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "slot0";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "sqrtPriceX96";
        readonly type: "uint160";
    }, {
        readonly name: "tick";
        readonly type: "int24";
    }, {
        readonly name: "observationIndex";
        readonly type: "uint16";
    }, {
        readonly name: "observationCardinality";
        readonly type: "uint16";
    }, {
        readonly name: "observationCardinalityNext";
        readonly type: "uint16";
    }, {
        readonly name: "feeProtocol";
        readonly type: "uint8";
    }, {
        readonly name: "unlocked";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "positions";
    readonly inputs: readonly [{
        readonly name: "key";
        readonly type: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "liquidity";
        readonly type: "uint128";
    }, {
        readonly name: "feeGrowthInside0LastX128";
        readonly type: "uint256";
    }, {
        readonly name: "feeGrowthInside1LastX128";
        readonly type: "uint256";
    }, {
        readonly name: "tokensOwed0";
        readonly type: "uint128";
    }, {
        readonly name: "tokensOwed1";
        readonly type: "uint128";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "event";
    readonly name: "Swap";
    readonly inputs: readonly [{
        readonly name: "sender";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "recipient";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "amount0";
        readonly type: "int256";
        readonly indexed: false;
    }, {
        readonly name: "amount1";
        readonly type: "int256";
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
    }];
}];
/** @deprecated Use AMM_V3_POOL_ABI instead */
export declare const UNISWAP_V3_POOL_ABI: readonly [{
    readonly type: "function";
    readonly name: "token0";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly type: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "token1";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly type: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "fee";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly type: "uint24";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "tickSpacing";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly type: "int24";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "liquidity";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly type: "uint128";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "slot0";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "sqrtPriceX96";
        readonly type: "uint160";
    }, {
        readonly name: "tick";
        readonly type: "int24";
    }, {
        readonly name: "observationIndex";
        readonly type: "uint16";
    }, {
        readonly name: "observationCardinality";
        readonly type: "uint16";
    }, {
        readonly name: "observationCardinalityNext";
        readonly type: "uint16";
    }, {
        readonly name: "feeProtocol";
        readonly type: "uint8";
    }, {
        readonly name: "unlocked";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "positions";
    readonly inputs: readonly [{
        readonly name: "key";
        readonly type: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "liquidity";
        readonly type: "uint128";
    }, {
        readonly name: "feeGrowthInside0LastX128";
        readonly type: "uint256";
    }, {
        readonly name: "feeGrowthInside1LastX128";
        readonly type: "uint256";
    }, {
        readonly name: "tokensOwed0";
        readonly type: "uint128";
    }, {
        readonly name: "tokensOwed1";
        readonly type: "uint128";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "event";
    readonly name: "Swap";
    readonly inputs: readonly [{
        readonly name: "sender";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "recipient";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "amount0";
        readonly type: "int256";
        readonly indexed: false;
    }, {
        readonly name: "amount1";
        readonly type: "int256";
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
    }];
}];
//# sourceMappingURL=amm-v3-pool.d.ts.map