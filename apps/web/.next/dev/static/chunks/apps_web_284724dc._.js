(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/web/lib/chains.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Lux Exchange - Chain Definitions
 *
 * Defines all supported chains with Lux/Zoo as primary networks.
 * Chain order matters - Lux chains appear first in all selectors.
 */ __turbopack_context__.s([
    "CHAIN_BY_ID",
    ()=>CHAIN_BY_ID,
    "LUX_ECOSYSTEM_CHAINS",
    ()=>LUX_ECOSYSTEM_CHAINS,
    "MAINNET_CHAINS",
    ()=>MAINNET_CHAINS,
    "SUPPORTED_CHAINS",
    ()=>SUPPORTED_CHAINS,
    "TESTNET_CHAINS",
    ()=>TESTNET_CHAINS,
    "ethereum",
    ()=>ethereum,
    "getChainById",
    ()=>getChainById,
    "getChainIcon",
    ()=>getChainIcon,
    "getDefaultChain",
    ()=>getDefaultChain,
    "isLuxChain",
    ()=>isLuxChain,
    "isLuxEcosystem",
    ()=>isLuxEcosystem,
    "isTestnet",
    ()=>isTestnet,
    "isZooChain",
    ()=>isZooChain,
    "luxMainnet",
    ()=>luxMainnet,
    "luxTestnet",
    ()=>luxTestnet,
    "sepolia",
    ()=>sepolia,
    "zooMainnet",
    ()=>zooMainnet,
    "zooTestnet",
    ()=>zooTestnet
]);
const luxMainnet = {
    id: 96369,
    name: "Lux Mainnet",
    nativeCurrency: {
        decimals: 18,
        name: "LUX",
        symbol: "LUX"
    },
    rpcUrls: {
        default: {
            http: [
                "https://api.lux.network/rpc"
            ]
        },
        public: {
            http: [
                "https://api.lux.network/rpc"
            ]
        }
    },
    blockExplorers: {
        default: {
            name: "Lux Explorer",
            url: "https://explore.lux.network"
        }
    }
};
const luxTestnet = {
    id: 96368,
    name: "Lux Testnet",
    nativeCurrency: {
        decimals: 18,
        name: "LUX",
        symbol: "LUX"
    },
    rpcUrls: {
        default: {
            http: [
                "https://api.lux-test.network/rpc"
            ]
        },
        public: {
            http: [
                "https://api.lux-test.network/rpc"
            ]
        }
    },
    blockExplorers: {
        default: {
            name: "Lux Explorer",
            url: "https://explore.lux-test.network"
        }
    },
    testnet: true
};
const zooMainnet = {
    id: 200200,
    name: "Zoo Network",
    nativeCurrency: {
        decimals: 18,
        name: "ZOO",
        symbol: "ZOO"
    },
    rpcUrls: {
        default: {
            http: [
                "https://api.zoo.network/rpc"
            ]
        },
        public: {
            http: [
                "https://api.zoo.network/rpc"
            ]
        }
    },
    blockExplorers: {
        default: {
            name: "Zoo Explorer",
            url: "https://explore.zoo.network"
        }
    }
};
const zooTestnet = {
    id: 200201,
    name: "Zoo Testnet",
    nativeCurrency: {
        decimals: 18,
        name: "ZOO",
        symbol: "ZOO"
    },
    rpcUrls: {
        default: {
            http: [
                "https://api.zoo-test.network/rpc"
            ]
        },
        public: {
            http: [
                "https://api.zoo-test.network/rpc"
            ]
        }
    },
    blockExplorers: {
        default: {
            name: "Zoo Explorer",
            url: "https://explore.zoo-test.network"
        }
    },
    testnet: true
};
const ethereum = {
    id: 1,
    name: "Ethereum",
    nativeCurrency: {
        decimals: 18,
        name: "Ether",
        symbol: "ETH"
    },
    rpcUrls: {
        default: {
            http: [
                "https://eth.llamarpc.com"
            ]
        },
        public: {
            http: [
                "https://eth.llamarpc.com"
            ]
        }
    },
    blockExplorers: {
        default: {
            name: "Etherscan",
            url: "https://etherscan.io"
        }
    }
};
const sepolia = {
    id: 11155111,
    name: "Sepolia",
    nativeCurrency: {
        decimals: 18,
        name: "Sepolia Ether",
        symbol: "ETH"
    },
    rpcUrls: {
        default: {
            http: [
                "https://rpc.sepolia.org"
            ]
        },
        public: {
            http: [
                "https://rpc.sepolia.org"
            ]
        }
    },
    blockExplorers: {
        default: {
            name: "Etherscan",
            url: "https://sepolia.etherscan.io"
        }
    },
    testnet: true
};
const SUPPORTED_CHAINS = [
    luxMainnet,
    zooMainnet,
    luxTestnet,
    zooTestnet,
    ethereum,
    sepolia
];
const MAINNET_CHAINS = [
    luxMainnet,
    zooMainnet,
    ethereum
];
const TESTNET_CHAINS = [
    luxTestnet,
    zooTestnet,
    sepolia
];
const LUX_ECOSYSTEM_CHAINS = [
    luxMainnet,
    zooMainnet,
    luxTestnet,
    zooTestnet
];
const CHAIN_BY_ID = {
    [luxMainnet.id]: luxMainnet,
    [luxTestnet.id]: luxTestnet,
    [zooMainnet.id]: zooMainnet,
    [zooTestnet.id]: zooTestnet,
    [ethereum.id]: ethereum,
    [sepolia.id]: sepolia
};
function getChainById(chainId) {
    return CHAIN_BY_ID[chainId];
}
function isLuxEcosystem(chainId) {
    const luxEcosystemIds = [
        luxMainnet.id,
        luxTestnet.id,
        zooMainnet.id,
        zooTestnet.id
    ];
    return luxEcosystemIds.includes(chainId);
}
function isLuxChain(chainId) {
    const luxChainIds = [
        luxMainnet.id,
        luxTestnet.id
    ];
    return luxChainIds.includes(chainId);
}
function isZooChain(chainId) {
    const zooChainIds = [
        zooMainnet.id,
        zooTestnet.id
    ];
    return zooChainIds.includes(chainId);
}
function isTestnet(chainId) {
    const testnetIds = [
        luxTestnet.id,
        zooTestnet.id,
        sepolia.id
    ];
    return testnetIds.includes(chainId);
}
function getDefaultChain() {
    return luxMainnet;
}
function getChainIcon(chainId) {
    switch(chainId){
        case luxMainnet.id:
        case luxTestnet.id:
            return "/tokens/lux.svg";
        case zooMainnet.id:
        case zooTestnet.id:
            return "/tokens/zoo.svg";
        case ethereum.id:
        case sepolia.id:
            return "/tokens/eth.svg";
        default:
            return "/tokens/default.svg";
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/components/providers/web3-provider.tsx [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Web3Provider",
    ()=>Web3Provider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_$40$playwright$2b$test$40$1$2e$57$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.28.5_@playwright+test@1.57.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_$40$playwright$2b$test$40$1$2e$57$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.28.5_@playwright+test@1.57.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_$40$playwright$2b$test$40$1$2e$57$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.28.5_@playwright+test@1.57.0_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$12$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tanstack+query-core@5.90.12/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$12_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tanstack+react-query@5.90.12_react@19.2.3/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$wagmi$40$3$2e$1$2e$3_$40$tanstack$2b$query$2d$core$40$5$2e$90$2e$12_$40$tanstack$2b$react$2d$query$40$5$2e$90$2e$12_react$40$19$2e$2$2e$3_$5f40$types$2b$r_awtrvpg4swukurnvkk5neb2awm$2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$context$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/wagmi@3.1.3_@tanstack+query-core@5.90.12_@tanstack+react-query@5.90.12_react@19.2.3__@types+r_awtrvpg4swukurnvkk5neb2awm/node_modules/wagmi/dist/esm/context.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$wagmi$2b$core$40$3$2e$0$2e$1_$40$tanstack$2b$query$2d$core$40$5$2e$90$2e$12_$40$types$2b$react$40$19$2e$2$2e$7_immer$40$11$2e$1$2e$0_react$40$19$2e$2$2e$3_$5f$36km6jw4ebyi53khkosupvebc4$2f$node_modules$2f40$wagmi$2f$core$2f$dist$2f$esm$2f$createConfig$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@wagmi+core@3.0.1_@tanstack+query-core@5.90.12_@types+react@19.2.7_immer@11.1.0_react@19.2.3__36km6jw4ebyi53khkosupvebc4/node_modules/@wagmi/core/dist/esm/createConfig.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$43$2e$3_typescript$40$5$2e$9$2e$3_zod$40$4$2e$2$2e$1$2f$node_modules$2f$viem$2f$_esm$2f$clients$2f$transports$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/viem@2.43.3_typescript@5.9.3_zod@4.2.1/node_modules/viem/_esm/clients/transports/http.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$wagmi$2b$core$40$3$2e$0$2e$1_$40$tanstack$2b$query$2d$core$40$5$2e$90$2e$12_$40$types$2b$react$40$19$2e$2$2e$7_immer$40$11$2e$1$2e$0_react$40$19$2e$2$2e$3_$5f$36km6jw4ebyi53khkosupvebc4$2f$node_modules$2f40$wagmi$2f$core$2f$dist$2f$esm$2f$connectors$2f$injected$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@wagmi+core@3.0.1_@tanstack+query-core@5.90.12_@types+react@19.2.7_immer@11.1.0_react@19.2.3__36km6jw4ebyi53khkosupvebc4/node_modules/@wagmi/core/dist/esm/connectors/injected.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$wagmi$2b$connectors$40$7$2e$0$2e$5_$40$wagmi$2b$core$40$3$2e$0$2e$1_$40$tanstack$2b$query$2d$core$40$5$2e$90$2e$12_immer$40$11$2e$1$2e$0_react$40$19$2e$_jnvcek53g4rhvkfzqsljndsmiq$2f$node_modules$2f40$wagmi$2f$connectors$2f$dist$2f$esm$2f$walletConnect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@wagmi+connectors@7.0.5_@wagmi+core@3.0.1_@tanstack+query-core@5.90.12_immer@11.1.0_react@19._jnvcek53g4rhvkfzqsljndsmiq/node_modules/@wagmi/connectors/dist/esm/walletConnect.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$chains$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/lib/chains.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
// Wagmi config - created outside component to prevent recreation
function createWagmiConfig() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$wagmi$2b$core$40$3$2e$0$2e$1_$40$tanstack$2b$query$2d$core$40$5$2e$90$2e$12_$40$types$2b$react$40$19$2e$2$2e$7_immer$40$11$2e$1$2e$0_react$40$19$2e$2$2e$3_$5f$36km6jw4ebyi53khkosupvebc4$2f$node_modules$2f40$wagmi$2f$core$2f$dist$2f$esm$2f$createConfig$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createConfig"])({
        chains: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$chains$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SUPPORTED_CHAINS"],
        connectors: [
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$wagmi$2b$core$40$3$2e$0$2e$1_$40$tanstack$2b$query$2d$core$40$5$2e$90$2e$12_$40$types$2b$react$40$19$2e$2$2e$7_immer$40$11$2e$1$2e$0_react$40$19$2e$2$2e$3_$5f$36km6jw4ebyi53khkosupvebc4$2f$node_modules$2f40$wagmi$2f$core$2f$dist$2f$esm$2f$connectors$2f$injected$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["injected"])(),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$wagmi$2b$connectors$40$7$2e$0$2e$5_$40$wagmi$2b$core$40$3$2e$0$2e$1_$40$tanstack$2b$query$2d$core$40$5$2e$90$2e$12_immer$40$11$2e$1$2e$0_react$40$19$2e$_jnvcek53g4rhvkfzqsljndsmiq$2f$node_modules$2f40$wagmi$2f$connectors$2f$dist$2f$esm$2f$walletConnect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["walletConnect"])({
                projectId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_$40$playwright$2b$test$40$1$2e$57$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo"
            })
        ],
        transports: {
            [__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$chains$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["luxMainnet"].id]: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$43$2e$3_typescript$40$5$2e$9$2e$3_zod$40$4$2e$2$2e$1$2f$node_modules$2f$viem$2f$_esm$2f$clients$2f$transports$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["http"])(),
            [__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$chains$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["luxTestnet"].id]: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$43$2e$3_typescript$40$5$2e$9$2e$3_zod$40$4$2e$2$2e$1$2f$node_modules$2f$viem$2f$_esm$2f$clients$2f$transports$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["http"])(),
            [__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$chains$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zooMainnet"].id]: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$43$2e$3_typescript$40$5$2e$9$2e$3_zod$40$4$2e$2$2e$1$2f$node_modules$2f$viem$2f$_esm$2f$clients$2f$transports$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["http"])(),
            [__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$chains$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zooTestnet"].id]: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$43$2e$3_typescript$40$5$2e$9$2e$3_zod$40$4$2e$2$2e$1$2f$node_modules$2f$viem$2f$_esm$2f$clients$2f$transports$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["http"])(),
            [__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$chains$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ethereum"].id]: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$43$2e$3_typescript$40$5$2e$9$2e$3_zod$40$4$2e$2$2e$1$2f$node_modules$2f$viem$2f$_esm$2f$clients$2f$transports$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["http"])(),
            [__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$chains$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sepolia"].id]: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$viem$40$2$2e$43$2e$3_typescript$40$5$2e$9$2e$3_zod$40$4$2e$2$2e$1$2f$node_modules$2f$viem$2f$_esm$2f$clients$2f$transports$2f$http$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["http"])()
        },
        ssr: true
    });
}
// Create query client with SSR-safe defaults
function createQueryClientInstance() {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$12$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClient"]({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 5,
                gcTime: 1000 * 60 * 60,
                refetchOnWindowFocus: false
            }
        }
    });
}
function Web3Provider({ children }) {
    _s();
    // Use state to ensure stable instances across renders
    const [config] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_$40$playwright$2b$test$40$1$2e$57$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({
        "Web3Provider.useState": ()=>createWagmiConfig()
    }["Web3Provider.useState"]);
    const [queryClient] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_$40$playwright$2b$test$40$1$2e$57$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({
        "Web3Provider.useState": ()=>createQueryClientInstance()
    }["Web3Provider.useState"]);
    // Always wrap children in providers - wagmi has ssr: true for hydration safety
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_$40$playwright$2b$test$40$1$2e$57$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$wagmi$40$3$2e$1$2e$3_$40$tanstack$2b$query$2d$core$40$5$2e$90$2e$12_$40$tanstack$2b$react$2d$query$40$5$2e$90$2e$12_react$40$19$2e$2$2e$3_$5f40$types$2b$r_awtrvpg4swukurnvkk5neb2awm$2f$node_modules$2f$wagmi$2f$dist$2f$esm$2f$context$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WagmiProvider"], {
        config: config,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_$40$playwright$2b$test$40$1$2e$57$2e$0_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$12_react$40$19$2e$2$2e$3$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
            client: queryClient,
            children: children
        }, void 0, false, {
            fileName: "[project]/apps/web/components/providers/web3-provider.tsx",
            lineNumber: 64,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/components/providers/web3-provider.tsx",
        lineNumber: 63,
        columnNumber: 5
    }, this);
}
_s(Web3Provider, "hy1Uvpbi9TZh72dWMmW2LGS3OPY=");
_c = Web3Provider;
;
var _c;
__turbopack_context__.k.register(_c, "Web3Provider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/components/providers/web3-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Web3Provider",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$providers$2f$web3$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Web3Provider"],
    "ethereum",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$chains$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ethereum"],
    "luxMainnet",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$chains$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["luxMainnet"],
    "luxTestnet",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$chains$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["luxTestnet"],
    "sepolia",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$chains$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sepolia"],
    "zooMainnet",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$chains$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zooMainnet"],
    "zooTestnet",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$chains$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zooTestnet"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$components$2f$providers$2f$web3$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/components/providers/web3-provider.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$chains$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/lib/chains.ts [app-client] (ecmascript)");
}),
"[project]/apps/web/components/providers/web3-provider.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/apps/web/components/providers/web3-provider.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=apps_web_284724dc._.js.map