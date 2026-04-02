/**
 * AMM V2 Factory ABI
 * Compatible with Uniswap V2 Factory interface
 */
export declare const AMM_V2_FACTORY_ABI: readonly [{
    readonly type: "function";
    readonly name: "getPair";
    readonly inputs: readonly [{
        readonly name: "tokenA";
        readonly type: "address";
    }, {
        readonly name: "tokenB";
        readonly type: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "pair";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "allPairs";
    readonly inputs: readonly [{
        readonly name: "index";
        readonly type: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "pair";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "allPairsLength";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "createPair";
    readonly inputs: readonly [{
        readonly name: "tokenA";
        readonly type: "address";
    }, {
        readonly name: "tokenB";
        readonly type: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "pair";
        readonly type: "address";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "event";
    readonly name: "PairCreated";
    readonly inputs: readonly [{
        readonly name: "token0";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "token1";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "pair";
        readonly type: "address";
        readonly indexed: false;
    }, {
        readonly name: "index";
        readonly type: "uint256";
        readonly indexed: false;
    }];
}];
/** @deprecated Use AMM_V2_FACTORY_ABI instead */
export declare const UNISWAP_V2_FACTORY_ABI: readonly [{
    readonly type: "function";
    readonly name: "getPair";
    readonly inputs: readonly [{
        readonly name: "tokenA";
        readonly type: "address";
    }, {
        readonly name: "tokenB";
        readonly type: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "pair";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "allPairs";
    readonly inputs: readonly [{
        readonly name: "index";
        readonly type: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "pair";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "allPairsLength";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "createPair";
    readonly inputs: readonly [{
        readonly name: "tokenA";
        readonly type: "address";
    }, {
        readonly name: "tokenB";
        readonly type: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "pair";
        readonly type: "address";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "event";
    readonly name: "PairCreated";
    readonly inputs: readonly [{
        readonly name: "token0";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "token1";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "pair";
        readonly type: "address";
        readonly indexed: false;
    }, {
        readonly name: "index";
        readonly type: "uint256";
        readonly indexed: false;
    }];
}];
//# sourceMappingURL=amm-v2-factory.d.ts.map