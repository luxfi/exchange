/**
 * Lux Chain Definitions
 * Native chain definitions for Lux Exchange
 */
import { defineChain } from 'viem'
import type { Chain } from 'viem'

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
 * Zoo Devnet Chain Definition
 */
export const zooDevnet = defineChain({
  id: 200202,
  name: 'Zoo Devnet',
  nativeCurrency: { name: 'ZOO', symbol: 'ZOO', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api.zoo-dev.network/rpc'] },
    public:  { http: ['https://api.zoo-dev.network/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Zoo Devnet Explorer', url: 'https://explore.zoo-dev.network' },
  },
  testnet: true,
})

/**
 * Hanzo Mainnet Chain Definition (AI chain — $AI token)
 */
export const hanzoMainnet = defineChain({
  id: 36963,
  name: 'Hanzo Mainnet',
  nativeCurrency: { name: 'AI', symbol: 'AI', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api.hanzo.network/rpc'] },
    public:  { http: ['https://api.hanzo.network/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Hanzo Explorer', url: 'https://explore.hanzo.network' },
  },
})

/**
 * Hanzo Testnet Chain Definition
 */
export const hanzoTestnet = defineChain({
  id: 36964,
  name: 'Hanzo Testnet',
  nativeCurrency: { name: 'AI', symbol: 'AI', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api.hanzo-test.network/rpc'] },
    public:  { http: ['https://api.hanzo-test.network/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Hanzo Testnet Explorer', url: 'https://explore.hanzo-test.network' },
  },
  testnet: true,
})

/**
 * Hanzo Devnet Chain Definition
 */
export const hanzoDevnet = defineChain({
  id: 36965,
  name: 'Hanzo Devnet',
  nativeCurrency: { name: 'AI', symbol: 'AI', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api.hanzo-dev.network/rpc'] },
    public:  { http: ['https://api.hanzo-dev.network/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Hanzo Devnet Explorer', url: 'https://explore.hanzo-dev.network' },
  },
  testnet: true,
})

/**
 * Pars Mainnet / Testnet / Devnet Chain Definitions
 */
export const parsMainnet = defineChain({
  id: 494949,
  name: 'Pars Mainnet',
  nativeCurrency: { name: 'PARS', symbol: 'PARS', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api.pars.network/rpc'] },
    public:  { http: ['https://api.pars.network/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Pars Explorer', url: 'https://explore.pars.network' },
  },
})

export const parsTestnet = defineChain({
  id: 7071,
  name: 'Pars Testnet',
  nativeCurrency: { name: 'PARS', symbol: 'PARS', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api.pars-test.network/rpc'] },
    public:  { http: ['https://api.pars-test.network/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Pars Testnet Explorer', url: 'https://explore.pars-test.network' },
  },
  testnet: true,
})

export const parsDevnet = defineChain({
  id: 7072,
  name: 'Pars Devnet',
  nativeCurrency: { name: 'PARS', symbol: 'PARS', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api.pars-dev.network/rpc'] },
    public:  { http: ['https://api.pars-dev.network/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Pars Devnet Explorer', url: 'https://explore.pars-dev.network' },
  },
  testnet: true,
})

/**
 * SPC Mainnet / Testnet / Devnet Chain Definitions
 */
export const spcMainnet = defineChain({
  id: 36911,
  name: 'SPC Mainnet',
  nativeCurrency: { name: 'SPC', symbol: 'SPC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api.spc.network/rpc'] },
    public:  { http: ['https://api.spc.network/rpc'] },
  },
  blockExplorers: {
    default: { name: 'SPC Explorer', url: 'https://explore.spc.network' },
  },
})

export const spcTestnet = defineChain({
  id: 36910,
  name: 'SPC Testnet',
  nativeCurrency: { name: 'SPC', symbol: 'SPC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api.spc-test.network/rpc'] },
    public:  { http: ['https://api.spc-test.network/rpc'] },
  },
  blockExplorers: {
    default: { name: 'SPC Testnet Explorer', url: 'https://explore.spc-test.network' },
  },
  testnet: true,
})

export const spcDevnet = defineChain({
  id: 36912,
  name: 'SPC Devnet',
  nativeCurrency: { name: 'SPC', symbol: 'SPC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api.spc-dev.network/rpc'] },
    public:  { http: ['https://api.spc-dev.network/rpc'] },
  },
  blockExplorers: {
    default: { name: 'SPC Devnet Explorer', url: 'https://explore.spc-dev.network' },
  },
  testnet: true,
})

/**
 * Liquid EVM — regulated digital securities (Liquidity.io ATS)
 */
export const liquidMainnet = defineChain({
  id: 8675309,
  name: 'Liquid EVM Mainnet',
  nativeCurrency: { name: 'LQDTY', symbol: 'LQDTY', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.satschel.com'] },
    public:  { http: ['https://rpc.satschel.com'] },
  },
  blockExplorers: {
    default: { name: 'Liquid Explorer', url: 'https://explorer.satschel.com' },
  },
})

export const liquidTestnet = defineChain({
  id: 8675310,
  name: 'Liquid EVM Testnet',
  nativeCurrency: { name: 'LQDTY', symbol: 'LQDTY', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.test.satschel.com'] },
    public:  { http: ['https://rpc.test.satschel.com'] },
  },
  blockExplorers: {
    default: { name: 'Liquid Testnet Explorer', url: 'https://explorer.test.satschel.com' },
  },
  testnet: true,
})

export const liquidDevnet = defineChain({
  id: 8675311,
  name: 'Liquid EVM Devnet',
  nativeCurrency: { name: 'LQDTY', symbol: 'LQDTY', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.dev.satschel.com'] },
    public:  { http: ['https://rpc.dev.satschel.com'] },
  },
  blockExplorers: {
    default: { name: 'Liquid Devnet Explorer', url: 'https://explorer.dev.satschel.com' },
  },
  testnet: true,
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
 * Lux Devnet (chain 96370) — shared devnet, not local-only.
 */
export const luxDevnet = defineChain({
  id: 96370,
  name: 'Lux Devnet',
  nativeCurrency: { name: 'LUX', symbol: 'LUX', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api.lux-dev.network/rpc'] },
    public:  { http: ['https://api.lux-dev.network/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Lux Devnet Explorer', url: 'https://explore.lux-dev.network' },
  },
  testnet: true,
})

/**
 * Chain IDs
 */
export const LUX_MAINNET_ID = 96369
export const LUX_TESTNET_ID = 96368
export const ZOO_MAINNET_ID = 200200
export const ZOO_TESTNET_ID = 200201
export const LUX_DEV_ID = 1337
export const ZOO_DEVNET_ID      = 200202
export const HANZO_MAINNET_ID   = 36963
export const HANZO_TESTNET_ID   = 36964
export const PARS_MAINNET_ID    = 494949
export const SPC_MAINNET_ID     = 36911
export const LIQUID_MAINNET_ID  = 8675309
export const LIQUID_TESTNET_ID  = 8675310
export const LIQUID_DEVNET_ID   = 8675311

/**
 * All supported chains
 */
export const supportedChains = [
  // Lux — 3 envs
  luxMainnet,    luxTestnet,    luxDevnet,
  // Zoo — 3 envs
  zooMainnet,    zooTestnet,    zooDevnet,
  // Hanzo — 3 envs
  hanzoMainnet,  hanzoTestnet,  hanzoDevnet,
  // Pars — 3 envs
  parsMainnet,   parsTestnet,   parsDevnet,
  // SPC — 3 envs
  spcMainnet,    spcTestnet,    spcDevnet,
  // Liquid EVM — 3 envs (regulated securities)
  liquidMainnet, liquidTestnet, liquidDevnet,
  // Local anvil-compat dev chain
  luxDev,
] as const

export type SupportedChainId = typeof supportedChains[number]['id']
