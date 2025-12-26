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
 * All supported chains
 */
export const supportedChains = [
    luxMainnet,
    luxTestnet,
    zooMainnet,
    zooTestnet,
];
