/**
 * Lux Chain Definitions
 * Native chain definitions for Lux Exchange
 */
import { defineChain } from 'viem';
/**
 * Lux Mainnet Chain Definition
 */
export const luxMainnet = defineChain({
    id: 96369,
    name: 'Lux Mainnet',
    nativeCurrency: {
        name: 'LUX',
        symbol: 'LUX',
        decimals: 18,
    },
    rpcUrls: {
        default: { http: ['https://api.lux.network/rpc'] },
        public: { http: ['https://api.lux.network/rpc'] },
    },
    blockExplorers: {
        default: { name: 'Lux Explorer', url: 'https://explore.lux.network' },
    },
    contracts: {
        multicall3: {
            address: '0xd25F88CBdAe3c2CCA3Bb75FC4E723b44C0Ea362F',
        },
    },
});
/**
 * Lux Testnet Chain Definition
 */
export const luxTestnet = defineChain({
    id: 96368,
    name: 'Lux Testnet',
    nativeCurrency: {
        name: 'LUX',
        symbol: 'LUX',
        decimals: 18,
    },
    rpcUrls: {
        default: { http: ['https://api.lux-test.network/rpc'] },
        public: { http: ['https://api.lux-test.network/rpc'] },
    },
    blockExplorers: {
        default: { name: 'Lux Testnet Explorer', url: 'https://explore.lux-test.network' },
    },
    contracts: {
        multicall3: {
            address: '0xd25F88CBdAe3c2CCA3Bb75FC4E723b44C0Ea362F',
        },
    },
    testnet: true,
});
/**
 * Zoo Mainnet Chain Definition
 */
export const zooMainnet = defineChain({
    id: 200200,
    name: 'Zoo Network',
    nativeCurrency: {
        name: 'ZOO',
        symbol: 'ZOO',
        decimals: 18,
    },
    rpcUrls: {
        default: { http: ['https://api.zoo.network/rpc'] },
        public: { http: ['https://api.zoo.network/rpc'] },
    },
    blockExplorers: {
        default: { name: 'Zoo Explorer', url: 'https://explore.zoo.network' },
    },
});
/**
 * Zoo Testnet Chain Definition
 */
export const zooTestnet = defineChain({
    id: 200201,
    name: 'Zoo Testnet',
    nativeCurrency: {
        name: 'ZOO',
        symbol: 'ZOO',
        decimals: 18,
    },
    rpcUrls: {
        default: { http: ['https://api.zoo-test.network/rpc'] },
        public: { http: ['https://api.zoo-test.network/rpc'] },
    },
    blockExplorers: {
        default: { name: 'Zoo Testnet Explorer', url: 'https://explore.zoo-test.network' },
    },
    testnet: true,
});
/**
 * Dev Chain Definition (for running local node with --dev)
 */
export const luxDev = defineChain({
    id: 1337,
    name: 'Lux Dev',
    nativeCurrency: {
        name: 'LUX',
        symbol: 'LUX',
        decimals: 18,
    },
    rpcUrls: {
        default: { http: ['http://localhost:8545/ext/bc/C/rpc'] },
        public: { http: ['http://localhost:8545/ext/bc/C/rpc'] },
    },
    blockExplorers: {
        default: { name: 'Dev', url: 'http://localhost:8545' },
    },
    testnet: false,
});
/**
 * Chain IDs
 */
export const LUX_MAINNET_ID = 96369;
export const LUX_TESTNET_ID = 96368;
export const ZOO_MAINNET_ID = 200200;
export const ZOO_TESTNET_ID = 200201;
export const LUX_DEV_ID = 1337;
/**
 * All supported chains
 */
export const supportedChains = [
    luxMainnet,
    luxTestnet,
    zooMainnet,
    zooTestnet,
    luxDev,
];
