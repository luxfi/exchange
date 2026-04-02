/**
 * Lux Mainnet Chain Definition
 */
export declare const luxMainnet: {
    blockExplorers: {
        readonly default: {
            readonly name: "Lux Explorer";
            readonly url: "https://explore.lux.network";
        };
    };
    contracts: {
        readonly multicall3: {
            readonly address: "0xd25F88CBdAe3c2CCA3Bb75FC4E723b44C0Ea362F";
        };
    };
    ensTlds?: readonly string[] | undefined;
    id: 96369;
    name: "Lux Mainnet";
    nativeCurrency: {
        readonly name: "LUX";
        readonly symbol: "LUX";
        readonly decimals: 18;
    };
    rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://api.lux.network/rpc"];
        };
        readonly public: {
            readonly http: readonly ["https://api.lux.network/rpc"];
        };
    };
    sourceId?: number | undefined | undefined;
    testnet?: boolean | undefined | undefined;
    custom?: Record<string, unknown> | undefined;
    fees?: import("viem").ChainFees<undefined> | undefined;
    formatters?: undefined;
    serializers?: import("viem").ChainSerializers<undefined, import("viem").TransactionSerializable> | undefined;
};
/**
 * Lux Testnet Chain Definition
 */
export declare const luxTestnet: {
    blockExplorers: {
        readonly default: {
            readonly name: "Lux Testnet Explorer";
            readonly url: "https://explore.lux-test.network";
        };
    };
    contracts: {
        readonly multicall3: {
            readonly address: "0xd25F88CBdAe3c2CCA3Bb75FC4E723b44C0Ea362F";
        };
    };
    ensTlds?: readonly string[] | undefined;
    id: 96368;
    name: "Lux Testnet";
    nativeCurrency: {
        readonly name: "LUX";
        readonly symbol: "LUX";
        readonly decimals: 18;
    };
    rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://api.lux-test.network/rpc"];
        };
        readonly public: {
            readonly http: readonly ["https://api.lux-test.network/rpc"];
        };
    };
    sourceId?: number | undefined | undefined;
    testnet: true;
    custom?: Record<string, unknown> | undefined;
    fees?: import("viem").ChainFees<undefined> | undefined;
    formatters?: undefined;
    serializers?: import("viem").ChainSerializers<undefined, import("viem").TransactionSerializable> | undefined;
};
/**
 * Zoo Mainnet Chain Definition
 */
export declare const zooMainnet: {
    blockExplorers: {
        readonly default: {
            readonly name: "Zoo Explorer";
            readonly url: "https://explore.zoo.network";
        };
    };
    contracts?: {
        [x: string]: import("viem").ChainContract | {
            [sourceId: number]: import("viem").ChainContract | undefined;
        } | undefined;
        ensRegistry?: import("viem").ChainContract | undefined;
        ensUniversalResolver?: import("viem").ChainContract | undefined;
        multicall3?: import("viem").ChainContract | undefined;
        universalSignatureVerifier?: import("viem").ChainContract | undefined;
    } | undefined;
    ensTlds?: readonly string[] | undefined;
    id: 200200;
    name: "Zoo Network";
    nativeCurrency: {
        readonly name: "ZOO";
        readonly symbol: "ZOO";
        readonly decimals: 18;
    };
    rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://api.zoo.network/rpc"];
        };
        readonly public: {
            readonly http: readonly ["https://api.zoo.network/rpc"];
        };
    };
    sourceId?: number | undefined | undefined;
    testnet?: boolean | undefined | undefined;
    custom?: Record<string, unknown> | undefined;
    fees?: import("viem").ChainFees<undefined> | undefined;
    formatters?: undefined;
    serializers?: import("viem").ChainSerializers<undefined, import("viem").TransactionSerializable> | undefined;
};
/**
 * Zoo Testnet Chain Definition
 */
export declare const zooTestnet: {
    blockExplorers: {
        readonly default: {
            readonly name: "Zoo Testnet Explorer";
            readonly url: "https://explore.zoo-test.network";
        };
    };
    contracts?: {
        [x: string]: import("viem").ChainContract | {
            [sourceId: number]: import("viem").ChainContract | undefined;
        } | undefined;
        ensRegistry?: import("viem").ChainContract | undefined;
        ensUniversalResolver?: import("viem").ChainContract | undefined;
        multicall3?: import("viem").ChainContract | undefined;
        universalSignatureVerifier?: import("viem").ChainContract | undefined;
    } | undefined;
    ensTlds?: readonly string[] | undefined;
    id: 200201;
    name: "Zoo Testnet";
    nativeCurrency: {
        readonly name: "ZOO";
        readonly symbol: "ZOO";
        readonly decimals: 18;
    };
    rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://api.zoo-test.network/rpc"];
        };
        readonly public: {
            readonly http: readonly ["https://api.zoo-test.network/rpc"];
        };
    };
    sourceId?: number | undefined | undefined;
    testnet: true;
    custom?: Record<string, unknown> | undefined;
    fees?: import("viem").ChainFees<undefined> | undefined;
    formatters?: undefined;
    serializers?: import("viem").ChainSerializers<undefined, import("viem").TransactionSerializable> | undefined;
};
/**
 * Dev Chain Definition (for running local node with --dev)
 */
export declare const luxDev: {
    blockExplorers: {
        readonly default: {
            readonly name: "Dev";
            readonly url: "http://localhost:8545";
        };
    };
    contracts?: {
        [x: string]: import("viem").ChainContract | {
            [sourceId: number]: import("viem").ChainContract | undefined;
        } | undefined;
        ensRegistry?: import("viem").ChainContract | undefined;
        ensUniversalResolver?: import("viem").ChainContract | undefined;
        multicall3?: import("viem").ChainContract | undefined;
        universalSignatureVerifier?: import("viem").ChainContract | undefined;
    } | undefined;
    ensTlds?: readonly string[] | undefined;
    id: 1337;
    name: "Lux Dev";
    nativeCurrency: {
        readonly name: "LUX";
        readonly symbol: "LUX";
        readonly decimals: 18;
    };
    rpcUrls: {
        readonly default: {
            readonly http: readonly ["http://localhost:8545/ext/bc/C/rpc"];
        };
        readonly public: {
            readonly http: readonly ["http://localhost:8545/ext/bc/C/rpc"];
        };
    };
    sourceId?: number | undefined | undefined;
    testnet: false;
    custom?: Record<string, unknown> | undefined;
    fees?: import("viem").ChainFees<undefined> | undefined;
    formatters?: undefined;
    serializers?: import("viem").ChainSerializers<undefined, import("viem").TransactionSerializable> | undefined;
};
/**
 * Liquidity Mainnet Chain Definition (Lux L2 subnet, chain ID 0)
 */
export declare const liquidityMainnet: {
    blockExplorers: {
        readonly default: {
            readonly name: "Liquidity Explorer";
            readonly url: "https://explore.main.lux.network";
        };
    };
    contracts?: {
        [x: string]: import("viem").ChainContract | {
            [sourceId: number]: import("viem").ChainContract | undefined;
        } | undefined;
        ensRegistry?: import("viem").ChainContract | undefined;
        ensUniversalResolver?: import("viem").ChainContract | undefined;
        multicall3?: import("viem").ChainContract | undefined;
        universalSignatureVerifier?: import("viem").ChainContract | undefined;
    } | undefined;
    ensTlds?: readonly string[] | undefined;
    id: 0;
    name: "Liquidity";
    nativeCurrency: {
        readonly name: "LUX";
        readonly symbol: "LUX";
        readonly decimals: 18;
    };
    rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://rpc.main.lux.network/rpc"];
        };
        readonly public: {
            readonly http: readonly ["https://rpc.main.lux.network/rpc"];
        };
    };
    sourceId?: number | undefined | undefined;
    testnet?: boolean | undefined | undefined;
    custom?: Record<string, unknown> | undefined;
    fees?: import("viem").ChainFees<undefined> | undefined;
    formatters?: undefined;
    serializers?: import("viem").ChainSerializers<undefined, import("viem").TransactionSerializable> | undefined;
};
/**
 * Liquidity Testnet Chain Definition
 */
export declare const liquidityTestnet: {
    blockExplorers: {
        readonly default: {
            readonly name: "Liquidity Testnet Explorer";
            readonly url: "https://explore.test.lux.network";
        };
    };
    contracts?: {
        [x: string]: import("viem").ChainContract | {
            [sourceId: number]: import("viem").ChainContract | undefined;
        } | undefined;
        ensRegistry?: import("viem").ChainContract | undefined;
        ensUniversalResolver?: import("viem").ChainContract | undefined;
        multicall3?: import("viem").ChainContract | undefined;
        universalSignatureVerifier?: import("viem").ChainContract | undefined;
    } | undefined;
    ensTlds?: readonly string[] | undefined;
    id: 0;
    name: "Liquidity Testnet";
    nativeCurrency: {
        readonly name: "LUX";
        readonly symbol: "LUX";
        readonly decimals: 18;
    };
    rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://rpc.test.lux.network/rpc"];
        };
        readonly public: {
            readonly http: readonly ["https://rpc.test.lux.network/rpc"];
        };
    };
    sourceId?: number | undefined | undefined;
    testnet: true;
    custom?: Record<string, unknown> | undefined;
    fees?: import("viem").ChainFees<undefined> | undefined;
    formatters?: undefined;
    serializers?: import("viem").ChainSerializers<undefined, import("viem").TransactionSerializable> | undefined;
};
/**
 * Liquidity Devnet Chain Definition
 */
export declare const liquidityDevnet: {
    blockExplorers: {
        readonly default: {
            readonly name: "Liquidity Devnet Explorer";
            readonly url: "https://explore.dev.lux.network";
        };
    };
    contracts?: {
        [x: string]: import("viem").ChainContract | {
            [sourceId: number]: import("viem").ChainContract | undefined;
        } | undefined;
        ensRegistry?: import("viem").ChainContract | undefined;
        ensUniversalResolver?: import("viem").ChainContract | undefined;
        multicall3?: import("viem").ChainContract | undefined;
        universalSignatureVerifier?: import("viem").ChainContract | undefined;
    } | undefined;
    ensTlds?: readonly string[] | undefined;
    id: 0;
    name: "Liquidity Devnet";
    nativeCurrency: {
        readonly name: "LUX";
        readonly symbol: "LUX";
        readonly decimals: 18;
    };
    rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://rpc.dev.lux.network/rpc"];
        };
        readonly public: {
            readonly http: readonly ["https://rpc.dev.lux.network/rpc"];
        };
    };
    sourceId?: number | undefined | undefined;
    testnet: true;
    custom?: Record<string, unknown> | undefined;
    fees?: import("viem").ChainFees<undefined> | undefined;
    formatters?: undefined;
    serializers?: import("viem").ChainSerializers<undefined, import("viem").TransactionSerializable> | undefined;
};
/**
 * Chain IDs
 */
export declare const LUX_MAINNET_ID = 96369;
export declare const LUX_TESTNET_ID = 96368;
export declare const ZOO_MAINNET_ID = 200200;
export declare const ZOO_TESTNET_ID = 200201;
export declare const LUX_DEV_ID = 1337;
export declare const LIQUIDITY_MAINNET_ID = 0;
export declare const LIQUIDITY_TESTNET_ID = 0;
export declare const LIQUIDITY_DEVNET_ID = 0;
/**
 * All supported chains
 */
export declare const supportedChains: readonly [{
    blockExplorers: {
        readonly default: {
            readonly name: "Lux Explorer";
            readonly url: "https://explore.lux.network";
        };
    };
    contracts: {
        readonly multicall3: {
            readonly address: "0xd25F88CBdAe3c2CCA3Bb75FC4E723b44C0Ea362F";
        };
    };
    ensTlds?: readonly string[] | undefined;
    id: 96369;
    name: "Lux Mainnet";
    nativeCurrency: {
        readonly name: "LUX";
        readonly symbol: "LUX";
        readonly decimals: 18;
    };
    rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://api.lux.network/rpc"];
        };
        readonly public: {
            readonly http: readonly ["https://api.lux.network/rpc"];
        };
    };
    sourceId?: number | undefined | undefined;
    testnet?: boolean | undefined | undefined;
    custom?: Record<string, unknown> | undefined;
    fees?: import("viem").ChainFees<undefined> | undefined;
    formatters?: undefined;
    serializers?: import("viem").ChainSerializers<undefined, import("viem").TransactionSerializable> | undefined;
}, {
    blockExplorers: {
        readonly default: {
            readonly name: "Lux Testnet Explorer";
            readonly url: "https://explore.lux-test.network";
        };
    };
    contracts: {
        readonly multicall3: {
            readonly address: "0xd25F88CBdAe3c2CCA3Bb75FC4E723b44C0Ea362F";
        };
    };
    ensTlds?: readonly string[] | undefined;
    id: 96368;
    name: "Lux Testnet";
    nativeCurrency: {
        readonly name: "LUX";
        readonly symbol: "LUX";
        readonly decimals: 18;
    };
    rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://api.lux-test.network/rpc"];
        };
        readonly public: {
            readonly http: readonly ["https://api.lux-test.network/rpc"];
        };
    };
    sourceId?: number | undefined | undefined;
    testnet: true;
    custom?: Record<string, unknown> | undefined;
    fees?: import("viem").ChainFees<undefined> | undefined;
    formatters?: undefined;
    serializers?: import("viem").ChainSerializers<undefined, import("viem").TransactionSerializable> | undefined;
}, {
    blockExplorers: {
        readonly default: {
            readonly name: "Zoo Explorer";
            readonly url: "https://explore.zoo.network";
        };
    };
    contracts?: {
        [x: string]: import("viem").ChainContract | {
            [sourceId: number]: import("viem").ChainContract | undefined;
        } | undefined;
        ensRegistry?: import("viem").ChainContract | undefined;
        ensUniversalResolver?: import("viem").ChainContract | undefined;
        multicall3?: import("viem").ChainContract | undefined;
        universalSignatureVerifier?: import("viem").ChainContract | undefined;
    } | undefined;
    ensTlds?: readonly string[] | undefined;
    id: 200200;
    name: "Zoo Network";
    nativeCurrency: {
        readonly name: "ZOO";
        readonly symbol: "ZOO";
        readonly decimals: 18;
    };
    rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://api.zoo.network/rpc"];
        };
        readonly public: {
            readonly http: readonly ["https://api.zoo.network/rpc"];
        };
    };
    sourceId?: number | undefined | undefined;
    testnet?: boolean | undefined | undefined;
    custom?: Record<string, unknown> | undefined;
    fees?: import("viem").ChainFees<undefined> | undefined;
    formatters?: undefined;
    serializers?: import("viem").ChainSerializers<undefined, import("viem").TransactionSerializable> | undefined;
}, {
    blockExplorers: {
        readonly default: {
            readonly name: "Zoo Testnet Explorer";
            readonly url: "https://explore.zoo-test.network";
        };
    };
    contracts?: {
        [x: string]: import("viem").ChainContract | {
            [sourceId: number]: import("viem").ChainContract | undefined;
        } | undefined;
        ensRegistry?: import("viem").ChainContract | undefined;
        ensUniversalResolver?: import("viem").ChainContract | undefined;
        multicall3?: import("viem").ChainContract | undefined;
        universalSignatureVerifier?: import("viem").ChainContract | undefined;
    } | undefined;
    ensTlds?: readonly string[] | undefined;
    id: 200201;
    name: "Zoo Testnet";
    nativeCurrency: {
        readonly name: "ZOO";
        readonly symbol: "ZOO";
        readonly decimals: 18;
    };
    rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://api.zoo-test.network/rpc"];
        };
        readonly public: {
            readonly http: readonly ["https://api.zoo-test.network/rpc"];
        };
    };
    sourceId?: number | undefined | undefined;
    testnet: true;
    custom?: Record<string, unknown> | undefined;
    fees?: import("viem").ChainFees<undefined> | undefined;
    formatters?: undefined;
    serializers?: import("viem").ChainSerializers<undefined, import("viem").TransactionSerializable> | undefined;
}, {
    blockExplorers: {
        readonly default: {
            readonly name: "Dev";
            readonly url: "http://localhost:8545";
        };
    };
    contracts?: {
        [x: string]: import("viem").ChainContract | {
            [sourceId: number]: import("viem").ChainContract | undefined;
        } | undefined;
        ensRegistry?: import("viem").ChainContract | undefined;
        ensUniversalResolver?: import("viem").ChainContract | undefined;
        multicall3?: import("viem").ChainContract | undefined;
        universalSignatureVerifier?: import("viem").ChainContract | undefined;
    } | undefined;
    ensTlds?: readonly string[] | undefined;
    id: 1337;
    name: "Lux Dev";
    nativeCurrency: {
        readonly name: "LUX";
        readonly symbol: "LUX";
        readonly decimals: 18;
    };
    rpcUrls: {
        readonly default: {
            readonly http: readonly ["http://localhost:8545/ext/bc/C/rpc"];
        };
        readonly public: {
            readonly http: readonly ["http://localhost:8545/ext/bc/C/rpc"];
        };
    };
    sourceId?: number | undefined | undefined;
    testnet: false;
    custom?: Record<string, unknown> | undefined;
    fees?: import("viem").ChainFees<undefined> | undefined;
    formatters?: undefined;
    serializers?: import("viem").ChainSerializers<undefined, import("viem").TransactionSerializable> | undefined;
}, {
    blockExplorers: {
        readonly default: {
            readonly name: "Liquidity Explorer";
            readonly url: "https://explore.main.lux.network";
        };
    };
    contracts?: {
        [x: string]: import("viem").ChainContract | {
            [sourceId: number]: import("viem").ChainContract | undefined;
        } | undefined;
        ensRegistry?: import("viem").ChainContract | undefined;
        ensUniversalResolver?: import("viem").ChainContract | undefined;
        multicall3?: import("viem").ChainContract | undefined;
        universalSignatureVerifier?: import("viem").ChainContract | undefined;
    } | undefined;
    ensTlds?: readonly string[] | undefined;
    id: 0;
    name: "Liquidity";
    nativeCurrency: {
        readonly name: "LUX";
        readonly symbol: "LUX";
        readonly decimals: 18;
    };
    rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://rpc.main.lux.network/rpc"];
        };
        readonly public: {
            readonly http: readonly ["https://rpc.main.lux.network/rpc"];
        };
    };
    sourceId?: number | undefined | undefined;
    testnet?: boolean | undefined | undefined;
    custom?: Record<string, unknown> | undefined;
    fees?: import("viem").ChainFees<undefined> | undefined;
    formatters?: undefined;
    serializers?: import("viem").ChainSerializers<undefined, import("viem").TransactionSerializable> | undefined;
}, {
    blockExplorers: {
        readonly default: {
            readonly name: "Liquidity Testnet Explorer";
            readonly url: "https://explore.test.lux.network";
        };
    };
    contracts?: {
        [x: string]: import("viem").ChainContract | {
            [sourceId: number]: import("viem").ChainContract | undefined;
        } | undefined;
        ensRegistry?: import("viem").ChainContract | undefined;
        ensUniversalResolver?: import("viem").ChainContract | undefined;
        multicall3?: import("viem").ChainContract | undefined;
        universalSignatureVerifier?: import("viem").ChainContract | undefined;
    } | undefined;
    ensTlds?: readonly string[] | undefined;
    id: 0;
    name: "Liquidity Testnet";
    nativeCurrency: {
        readonly name: "LUX";
        readonly symbol: "LUX";
        readonly decimals: 18;
    };
    rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://rpc.test.lux.network/rpc"];
        };
        readonly public: {
            readonly http: readonly ["https://rpc.test.lux.network/rpc"];
        };
    };
    sourceId?: number | undefined | undefined;
    testnet: true;
    custom?: Record<string, unknown> | undefined;
    fees?: import("viem").ChainFees<undefined> | undefined;
    formatters?: undefined;
    serializers?: import("viem").ChainSerializers<undefined, import("viem").TransactionSerializable> | undefined;
}, {
    blockExplorers: {
        readonly default: {
            readonly name: "Liquidity Devnet Explorer";
            readonly url: "https://explore.dev.lux.network";
        };
    };
    contracts?: {
        [x: string]: import("viem").ChainContract | {
            [sourceId: number]: import("viem").ChainContract | undefined;
        } | undefined;
        ensRegistry?: import("viem").ChainContract | undefined;
        ensUniversalResolver?: import("viem").ChainContract | undefined;
        multicall3?: import("viem").ChainContract | undefined;
        universalSignatureVerifier?: import("viem").ChainContract | undefined;
    } | undefined;
    ensTlds?: readonly string[] | undefined;
    id: 0;
    name: "Liquidity Devnet";
    nativeCurrency: {
        readonly name: "LUX";
        readonly symbol: "LUX";
        readonly decimals: 18;
    };
    rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://rpc.dev.lux.network/rpc"];
        };
        readonly public: {
            readonly http: readonly ["https://rpc.dev.lux.network/rpc"];
        };
    };
    sourceId?: number | undefined | undefined;
    testnet: true;
    custom?: Record<string, unknown> | undefined;
    fees?: import("viem").ChainFees<undefined> | undefined;
    formatters?: undefined;
    serializers?: import("viem").ChainSerializers<undefined, import("viem").TransactionSerializable> | undefined;
}];
export type SupportedChainId = typeof supportedChains[number]['id'];
//# sourceMappingURL=lux.d.ts.map