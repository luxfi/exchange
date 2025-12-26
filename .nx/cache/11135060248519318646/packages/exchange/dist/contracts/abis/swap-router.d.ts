/**
 * SwapRouter ABI (V3)
 */
export declare const SWAP_ROUTER_ABI: readonly [{
    readonly type: "function";
    readonly name: "exactInputSingle";
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
            readonly name: "fee";
            readonly type: "uint24";
        }, {
            readonly name: "recipient";
            readonly type: "address";
        }, {
            readonly name: "deadline";
            readonly type: "uint256";
        }, {
            readonly name: "amountIn";
            readonly type: "uint256";
        }, {
            readonly name: "amountOutMinimum";
            readonly type: "uint256";
        }, {
            readonly name: "sqrtPriceLimitX96";
            readonly type: "uint160";
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
            readonly name: "tokenIn";
            readonly type: "address";
        }, {
            readonly name: "tokenOut";
            readonly type: "address";
        }, {
            readonly name: "fee";
            readonly type: "uint24";
        }, {
            readonly name: "recipient";
            readonly type: "address";
        }, {
            readonly name: "deadline";
            readonly type: "uint256";
        }, {
            readonly name: "amountOut";
            readonly type: "uint256";
        }, {
            readonly name: "amountInMaximum";
            readonly type: "uint256";
        }, {
            readonly name: "sqrtPriceLimitX96";
            readonly type: "uint160";
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
            readonly name: "recipient";
            readonly type: "address";
        }, {
            readonly name: "deadline";
            readonly type: "uint256";
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
}, {
    readonly type: "function";
    readonly name: "multicall";
    readonly inputs: readonly [{
        readonly name: "data";
        readonly type: "bytes[]";
    }];
    readonly outputs: readonly [{
        readonly name: "results";
        readonly type: "bytes[]";
    }];
    readonly stateMutability: "payable";
}];
//# sourceMappingURL=swap-router.d.ts.map