/**
 * NonfungiblePositionManager ABI
 */
export declare const NFT_POSITION_MANAGER_ABI: readonly [{
    readonly type: "function";
    readonly name: "positions";
    readonly inputs: readonly [{
        readonly name: "tokenId";
        readonly type: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "nonce";
        readonly type: "uint96";
    }, {
        readonly name: "operator";
        readonly type: "address";
    }, {
        readonly name: "token0";
        readonly type: "address";
    }, {
        readonly name: "token1";
        readonly type: "address";
    }, {
        readonly name: "fee";
        readonly type: "uint24";
    }, {
        readonly name: "tickLower";
        readonly type: "int24";
    }, {
        readonly name: "tickUpper";
        readonly type: "int24";
    }, {
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
    readonly type: "function";
    readonly name: "mint";
    readonly inputs: readonly [{
        readonly name: "params";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "token0";
            readonly type: "address";
        }, {
            readonly name: "token1";
            readonly type: "address";
        }, {
            readonly name: "fee";
            readonly type: "uint24";
        }, {
            readonly name: "tickLower";
            readonly type: "int24";
        }, {
            readonly name: "tickUpper";
            readonly type: "int24";
        }, {
            readonly name: "amount0Desired";
            readonly type: "uint256";
        }, {
            readonly name: "amount1Desired";
            readonly type: "uint256";
        }, {
            readonly name: "amount0Min";
            readonly type: "uint256";
        }, {
            readonly name: "amount1Min";
            readonly type: "uint256";
        }, {
            readonly name: "recipient";
            readonly type: "address";
        }, {
            readonly name: "deadline";
            readonly type: "uint256";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "tokenId";
        readonly type: "uint256";
    }, {
        readonly name: "liquidity";
        readonly type: "uint128";
    }, {
        readonly name: "amount0";
        readonly type: "uint256";
    }, {
        readonly name: "amount1";
        readonly type: "uint256";
    }];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "increaseLiquidity";
    readonly inputs: readonly [{
        readonly name: "params";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "tokenId";
            readonly type: "uint256";
        }, {
            readonly name: "amount0Desired";
            readonly type: "uint256";
        }, {
            readonly name: "amount1Desired";
            readonly type: "uint256";
        }, {
            readonly name: "amount0Min";
            readonly type: "uint256";
        }, {
            readonly name: "amount1Min";
            readonly type: "uint256";
        }, {
            readonly name: "deadline";
            readonly type: "uint256";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "liquidity";
        readonly type: "uint128";
    }, {
        readonly name: "amount0";
        readonly type: "uint256";
    }, {
        readonly name: "amount1";
        readonly type: "uint256";
    }];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "decreaseLiquidity";
    readonly inputs: readonly [{
        readonly name: "params";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "tokenId";
            readonly type: "uint256";
        }, {
            readonly name: "liquidity";
            readonly type: "uint128";
        }, {
            readonly name: "amount0Min";
            readonly type: "uint256";
        }, {
            readonly name: "amount1Min";
            readonly type: "uint256";
        }, {
            readonly name: "deadline";
            readonly type: "uint256";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "amount0";
        readonly type: "uint256";
    }, {
        readonly name: "amount1";
        readonly type: "uint256";
    }];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "collect";
    readonly inputs: readonly [{
        readonly name: "params";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "tokenId";
            readonly type: "uint256";
        }, {
            readonly name: "recipient";
            readonly type: "address";
        }, {
            readonly name: "amount0Max";
            readonly type: "uint128";
        }, {
            readonly name: "amount1Max";
            readonly type: "uint128";
        }];
    }];
    readonly outputs: readonly [{
        readonly name: "amount0";
        readonly type: "uint256";
    }, {
        readonly name: "amount1";
        readonly type: "uint256";
    }];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "burn";
    readonly inputs: readonly [{
        readonly name: "tokenId";
        readonly type: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
}, {
    readonly type: "function";
    readonly name: "balanceOf";
    readonly inputs: readonly [{
        readonly name: "owner";
        readonly type: "address";
    }];
    readonly outputs: readonly [{
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "tokenOfOwnerByIndex";
    readonly inputs: readonly [{
        readonly name: "owner";
        readonly type: "address";
    }, {
        readonly name: "index";
        readonly type: "uint256";
    }];
    readonly outputs: readonly [{
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
}];
//# sourceMappingURL=nft-position-manager.d.ts.map