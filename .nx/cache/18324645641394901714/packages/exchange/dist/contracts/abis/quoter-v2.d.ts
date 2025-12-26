/**
 * QuoterV2 ABI
 */
export declare const QUOTER_V2_ABI: readonly [{
    readonly type: "function";
    readonly name: "quoteExactInputSingle";
    readonly inputs: readonly [{
        readonly name: "params";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "tokenIn";
            readonly type: "address";
        }, {
            readonly name: "tokenOut";
            readonly type: "address";
        }, {
            readonly name: "amountIn";
            readonly type: "uint256";
        }, {
            readonly name: "fee";
            readonly type: "uint24";
        }, {
            readonly name: "sqrtPriceLimitX96";
            readonly type: "uint160";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "amountOut";
        readonly type: "uint256";
    }, {
        readonly name: "sqrtPriceX96After";
        readonly type: "uint160";
    }, {
        readonly name: "initializedTicksCrossed";
        readonly type: "uint32";
    }, {
        readonly name: "gasEstimate";
        readonly type: "uint256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "quoteExactOutputSingle";
    readonly inputs: readonly [{
        readonly name: "params";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "tokenIn";
            readonly type: "address";
        }, {
            readonly name: "tokenOut";
            readonly type: "address";
        }, {
            readonly name: "amount";
            readonly type: "uint256";
        }, {
            readonly name: "fee";
            readonly type: "uint24";
        }, {
            readonly name: "sqrtPriceLimitX96";
            readonly type: "uint160";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "amountIn";
        readonly type: "uint256";
    }, {
        readonly name: "sqrtPriceX96After";
        readonly type: "uint160";
    }, {
        readonly name: "initializedTicksCrossed";
        readonly type: "uint32";
    }, {
        readonly name: "gasEstimate";
        readonly type: "uint256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "quoteExactInput";
    readonly inputs: readonly [{
        readonly name: "path";
        readonly type: "bytes";
    }, {
        readonly name: "amountIn";
        readonly type: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "amountOut";
        readonly type: "uint256";
    }, {
        readonly name: "sqrtPriceX96AfterList";
        readonly type: "uint160[]";
    }, {
        readonly name: "initializedTicksCrossedList";
        readonly type: "uint32[]";
    }, {
        readonly name: "gasEstimate";
        readonly type: "uint256";
    }];
    readonly stateMutability: "nonpayable";
}];
//# sourceMappingURL=quoter-v2.d.ts.map