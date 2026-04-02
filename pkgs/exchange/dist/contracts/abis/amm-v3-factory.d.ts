/**
 * AMM V3 Factory ABI
 * Compatible with Uniswap V3 Factory interface
 */
export declare const AMM_V3_FACTORY_ABI: readonly [{
    readonly type: "function";
    readonly name: "getPool";
    readonly inputs: readonly [{
        readonly name: "tokenA";
        readonly type: "address";
    }, {
        readonly name: "tokenB";
        readonly type: "address";
    }, {
        readonly name: "fee";
        readonly type: "uint24";
    }];
    readonly outputs: readonly [{
        readonly name: "pool";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "createPool";
    readonly inputs: readonly [{
        readonly name: "tokenA";
        readonly type: "address";
    }, {
        readonly name: "tokenB";
        readonly type: "address";
    }, {
        readonly name: "fee";
        readonly type: "uint24";
    }];
    readonly outputs: readonly [{
        readonly name: "pool";
        readonly type: "address";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "feeAmountTickSpacing";
    readonly inputs: readonly [{
        readonly name: "fee";
        readonly type: "uint24";
    }];
    readonly outputs: readonly [{
        readonly name: "tickSpacing";
        readonly type: "int24";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "event";
    readonly name: "PoolCreated";
    readonly inputs: readonly [{
        readonly name: "token0";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "token1";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "fee";
        readonly type: "uint24";
        readonly indexed: true;
    }, {
        readonly name: "tickSpacing";
        readonly type: "int24";
        readonly indexed: false;
    }, {
        readonly name: "pool";
        readonly type: "address";
        readonly indexed: false;
    }];
}];
/** @deprecated Use AMM_V3_FACTORY_ABI instead */
export declare const UNISWAP_V3_FACTORY_ABI: readonly [{
    readonly type: "function";
    readonly name: "getPool";
    readonly inputs: readonly [{
        readonly name: "tokenA";
        readonly type: "address";
    }, {
        readonly name: "tokenB";
        readonly type: "address";
    }, {
        readonly name: "fee";
        readonly type: "uint24";
    }];
    readonly outputs: readonly [{
        readonly name: "pool";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "createPool";
    readonly inputs: readonly [{
        readonly name: "tokenA";
        readonly type: "address";
    }, {
        readonly name: "tokenB";
        readonly type: "address";
    }, {
        readonly name: "fee";
        readonly type: "uint24";
    }];
    readonly outputs: readonly [{
        readonly name: "pool";
        readonly type: "address";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "feeAmountTickSpacing";
    readonly inputs: readonly [{
        readonly name: "fee";
        readonly type: "uint24";
    }];
    readonly outputs: readonly [{
        readonly name: "tickSpacing";
        readonly type: "int24";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "event";
    readonly name: "PoolCreated";
    readonly inputs: readonly [{
        readonly name: "token0";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "token1";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "fee";
        readonly type: "uint24";
        readonly indexed: true;
    }, {
        readonly name: "tickSpacing";
        readonly type: "int24";
        readonly indexed: false;
    }, {
        readonly name: "pool";
        readonly type: "address";
        readonly indexed: false;
    }];
}];
//# sourceMappingURL=amm-v3-factory.d.ts.map