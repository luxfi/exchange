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
 * Localnet — anvil/hardhat/foundry default EVM on :8545.
 * Chain id 31337 is the standard localnet id.
 */
export const localnet = defineChain({
  id: 31337,
  name: 'Localnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['http://localhost:8545'] },
    public:  { http: ['http://localhost:8545'] },
  },
  blockExplorers: {
    default: { name: 'Local', url: 'http://localhost:8545' },
  },
  testnet: true,
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
export const LOCALNET_ID        = 31337
export const ZOO_DEVNET_ID      = 200202
export const HANZO_MAINNET_ID   = 36963
export const HANZO_TESTNET_ID   = 36964
export const PARS_MAINNET_ID    = 494949
export const LIQUID_MAINNET_ID  = 8675309
export const LIQUID_TESTNET_ID  = 8675310
export const LIQUID_DEVNET_ID   = 8675311

/**
 * Canonical chains — enabled out-of-box in every Lux-ecosystem
 * exchange. Four natively-integrated chains × 3 envs each = 12 chains.
 *
 *   Lux    (96369 / 96368 / 96370)     — LUX   — base L1
 *   Hanzo  (36963 / 36964 / 36965)     — AI    — AI chain
 *   Zoo    (200200 / 200201 / 200202)  — ZOO
 *   Liquid (8675309 / 8675310 / 8675311) — LQDTY — regulated securities
 *
 * Pars (not in canonical default) + localnet available via explicit
 * import — opt-in when needed.
 */
export const canonicalChains = [
  // Lux — base L1
  luxMainnet,    luxTestnet,    luxDevnet,
  // Hanzo — AI chain (AI coin)
  hanzoMainnet,  hanzoTestnet,  hanzoDevnet,
  // Zoo
  zooMainnet,    zooTestnet,    zooDevnet,
  // Liquid EVM (Liquidity.io — regulated securities)
  liquidMainnet, liquidTestnet, liquidDevnet,
] as const

/**
 * All supported chains — canonical + optional Pars + local dev.
 */
export const supportedChains = [
  ...canonicalChains,
  parsMainnet,   parsTestnet,   parsDevnet,
  localnet,
] as const

export type SupportedChainId = typeof supportedChains[number]['id']
