/**
 * DEX SwapRouter Precompile ABI (0x0401)
 * Optimized swap routing via native precompile
 */
export declare const DEX_SWAP_ROUTER_ABI: readonly [{
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
            readonly name: "recipient";
            readonly type: "address";
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
    readonly name: "lockAcquired";
    readonly inputs: readonly [{
        readonly name: "data";
        readonly type: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "result";
        readonly type: "bytes";
    }];
    readonly stateMutability: "nonpayable";
}];
//# sourceMappingURL=dex-swap-router.d.ts.map