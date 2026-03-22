import { defineChain } from 'viem'

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
    default: { http: ['https://api.lux.network/mainnet/ext/bc/C/rpc'] },
    public: { http: ['https://api.lux.network/mainnet/ext/bc/C/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Lux Explorer', url: 'https://explore.lux.network' },
  },
  contracts: {
    multicall3: {
      address: '0xd25F88CBdAe3c2CCA3Bb75FC4E723b44C0Ea362F',
    },
  },
})

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
    default: { http: ['https://api.lux.network/testnet/ext/bc/C/rpc'] },
    public: { http: ['https://api.lux.network/testnet/ext/bc/C/rpc'] },
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
})

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
})

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
})

/**
 * Hanzo Network (AI Coin) Chain Definition
 */
export const hanzoMainnet = defineChain({
  id: 36963,
  name: 'Hanzo Network',
  nativeCurrency: {
    name: 'HANZO',
    symbol: 'HANZO',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://api.lux.network/mainnet/ext/bc/2GiQb73CeJESjc4omFv2YtQHZrRgJf25NXPzAr5J6UNHRcDV2F/rpc'] },
    public: { http: ['https://api.lux.network/mainnet/ext/bc/2GiQb73CeJESjc4omFv2YtQHZrRgJf25NXPzAr5J6UNHRcDV2F/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Hanzo Explorer', url: 'https://explore-hanzo.lux.network' },
  },
})

/**
 * SPC Network Chain Definition
 */
export const spcMainnet = defineChain({
  id: 36911,
  name: 'SPC Network',
  nativeCurrency: {
    name: 'SPC',
    symbol: 'SPC',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://api.lux.network/mainnet/ext/bc/rtjwvtE1tEvrokmpeYdTq7b2zqZgmybKwR5MLjKMGAR1W78dQ/rpc'] },
    public: { http: ['https://api.lux.network/mainnet/ext/bc/rtjwvtE1tEvrokmpeYdTq7b2zqZgmybKwR5MLjKMGAR1W78dQ/rpc'] },
  },
  blockExplorers: {
    default: { name: 'SPC Explorer', url: 'https://explore-spc.lux.network' },
  },
})

/**
 * Pars Network Chain Definition
 */
export const parsMainnet = defineChain({
  id: 494949,
  name: 'Pars Network',
  nativeCurrency: {
    name: 'PARS',
    symbol: 'PARS',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://api.lux.network/mainnet/ext/bc/2pUskxqaL5Bpx7uRUGG1fDjPckjxQ4UKX4sLKeaS1NdSVBJd3F/rpc'] },
    public: { http: ['https://api.lux.network/mainnet/ext/bc/2pUskxqaL5Bpx7uRUGG1fDjPckjxQ4UKX4sLKeaS1NdSVBJd3F/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Pars Explorer', url: 'https://explore-pars.lux.network' },
  },
})

/**
 * Liquid EVM (Liquidity Network) Chain Definition
 */
export const liquidEvm = defineChain({
  id: 8675311,
  name: 'Liquid Network',
  nativeCurrency: {
    name: 'LQDTY',
    symbol: 'LQDTY',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://rpc.next.satschel.com'] },
    public: { http: ['https://rpc.next.satschel.com'] },
  },
  blockExplorers: {
    default: { name: 'Liquid Explorer', url: 'https://explore.next.satschel.com' },
  },
})

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
})

/**
 * Chain IDs
 */
export const LUX_MAINNET_ID = 96369
export const LUX_TESTNET_ID = 96368
export const ZOO_MAINNET_ID = 200200
export const ZOO_TESTNET_ID = 200201
export const HANZO_MAINNET_ID = 36963
export const SPC_MAINNET_ID = 36911
export const PARS_MAINNET_ID = 494949
export const LIQUID_EVM_ID = 8675311
export const LUX_DEV_ID = 1337

/**
 * All supported chains
 */
export const supportedChains = [
  luxMainnet,
  luxTestnet,
  zooMainnet,
  zooTestnet,
  hanzoMainnet,
  spcMainnet,
  parsMainnet,
  liquidEvm,
  luxDev,
] as const

export type SupportedChainId = typeof supportedChains[number]['id']
