/**
 * AMM V2 Pair ABI
 * Compatible with Uniswap V2 Pair interface
 */
export declare const AMM_V2_PAIR_ABI: readonly [{
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
    readonly name: "getReserves";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "reserve0";
        readonly type: "uint112";
    }, {
        readonly name: "reserve1";
        readonly type: "uint112";
    }, {
        readonly name: "blockTimestampLast";
        readonly type: "uint32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "totalSupply";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
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
    readonly name: "price0CumulativeLast";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "price1CumulativeLast";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "kLast";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly type: "uint256";
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
        readonly name: "amount0In";
        readonly type: "uint256";
        readonly indexed: false;
    }, {
        readonly name: "amount1In";
        readonly type: "uint256";
        readonly indexed: false;
    }, {
        readonly name: "amount0Out";
        readonly type: "uint256";
        readonly indexed: false;
    }, {
        readonly name: "amount1Out";
        readonly type: "uint256";
        readonly indexed: false;
    }, {
        readonly name: "to";
        readonly type: "address";
        readonly indexed: true;
    }];
}, {
    readonly type: "event";
    readonly name: "Sync";
    readonly inputs: readonly [{
        readonly name: "reserve0";
        readonly type: "uint112";
        readonly indexed: false;
    }, {
        readonly name: "reserve1";
        readonly type: "uint112";
        readonly indexed: false;
    }];
}];
/** @deprecated Use AMM_V2_PAIR_ABI instead */
export declare const UNISWAP_V2_PAIR_ABI: readonly [{
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
    readonly name: "getReserves";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "reserve0";
        readonly type: "uint112";
    }, {
        readonly name: "reserve1";
        readonly type: "uint112";
    }, {
        readonly name: "blockTimestampLast";
        readonly type: "uint32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "totalSupply";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
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
    readonly name: "price0CumulativeLast";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "price1CumulativeLast";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "kLast";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly type: "uint256";
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
        readonly name: "amount0In";
        readonly type: "uint256";
        readonly indexed: false;
    }, {
        readonly name: "amount1In";
        readonly type: "uint256";
        readonly indexed: false;
    }, {
        readonly name: "amount0Out";
        readonly type: "uint256";
        readonly indexed: false;
    }, {
        readonly name: "amount1Out";
        readonly type: "uint256";
        readonly indexed: false;
    }, {
        readonly name: "to";
        readonly type: "address";
        readonly indexed: true;
    }];
}, {
    readonly type: "event";
    readonly name: "Sync";
    readonly inputs: readonly [{
        readonly name: "reserve0";
        readonly type: "uint112";
        readonly indexed: false;
    }, {
        readonly name: "reserve1";
        readonly type: "uint112";
        readonly indexed: false;
    }];
}];
//# sourceMappingURL=amm-v2-pair.d.ts.map