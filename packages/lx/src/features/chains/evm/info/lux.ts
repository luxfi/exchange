import { GraphQLApi } from '@luxfi/api'
import { SwapConfigKey } from '@luxfi/gating'
import { LUX_LOGO, LUX_NETWORK_LOGO } from 'ui/src/assets'
import { DEFAULT_NATIVE_ADDRESS_LEGACY } from 'lx/src/features/chains/evm/rpc'
import { buildChainTokens } from 'lx/src/features/chains/evm/tokens'
import {
  GqlChainId,
  NetworkLayer,
  RPCType,
  UniverseChainId,
  UniverseChainInfo,
} from 'lx/src/features/chains/types'
import { Platform } from 'lx/src/features/platforms/types/Platform'
import { ElementName } from 'lx/src/features/telemetry/constants'
import { buildUSDC, buildUSDT } from 'lx/src/features/tokens/stablecoin'
import { ONE_MINUTE_MS } from 'utilities/src/time/time'

const tokens = buildChainTokens({
  stables: {
    USDC: buildUSDC('0x57f9E717dc080a6A76fB6F77BecA8C9C1D266B96', UniverseChainId.Lux), // LUSDC on Lux mainnet
    USDT: buildUSDT('0x5aa01B3b5877255cE50cc55e8986a7a5fe29C70e', UniverseChainId.Lux), // USDT on Lux mainnet
  },
})

// Lux testnet tokens - LUSD is a stablecoin on testnet
const testnetTokens = buildChainTokens({
  stables: {
    USDC: buildUSDC('0x8a3fad1c7FB94461621351aa6A983B6f814F039c', UniverseChainId.LuxTestnet), // LUSDC on Lux testnet
  },
})

export const LUX_CHAIN_INFO = {
  id: UniverseChainId.Lux,
  name: 'Lux Mainnet',
  platform: Platform.EVM,
  assetRepoNetworkName: 'lux',
  backendChain: {
    chain: GraphQLApi.Chain.Ethereum as GqlChainId, // Fallback to Ethereum until Lux is added to GraphQL
    backendSupported: true, // Using Lux Gateway for Lux chain data
    nativeTokenBackendAddress: undefined,
  },
  blockPerMainnetEpochForChainId: 1,
  blockWaitMsBeforeWarning: ONE_MINUTE_MS,
  bridge: undefined,
  docs: 'https://docs.lux.network/',
  elementName: ElementName.ChainLux,
  explorer: {
    name: 'Lux Explorer',
    url: 'https://explore.lux.network/',
  },
  interfaceName: 'lux',
  label: 'Lux',
  logo: LUX_NETWORK_LOGO,
  nativeCurrency: {
    name: 'LUX',
    symbol: 'LUX',
    decimals: 18,
    address: DEFAULT_NATIVE_ADDRESS_LEGACY,
    explorerLink: 'https://explore.lux.network/stats',
    logo: LUX_LOGO,
  },
  networkLayer: NetworkLayer.L1,
  pendingTransactionsRetryOptions: undefined,
  rpcUrls: {
    [RPCType.Public]: {
      http: ['https://api.lux.network/mainnet/ext/bc/C/rpc'],
    },
    [RPCType.Default]: {
      http: ['https://api.lux.network/mainnet/ext/bc/C/rpc'],
    },
    [RPCType.Fallback]: {
      http: ['https://api.lux.network/mainnet/ext/bc/C/rpc'],
    },
    [RPCType.Interface]: {
      http: ['https://api.lux.network/mainnet/ext/bc/C/rpc'],
    },
  },
  urlParam: 'lux',
  statusPage: undefined,
  tokens,
  supportsV4: true, // Lux DEX precompile at 0x0400 supports V4-style pools
  supportsNFTs: true,
  wrappedNativeCurrency: {
    name: 'Wrapped LUX',
    symbol: 'WLUX',
    decimals: 18,
    address: '0x3C18bB6B17eb3F0879d4653e0120a531aF4d86E3', // WLUX mainnet deployment 2026-02-26
  },
  gasConfig: {
    send: {
      configKey: SwapConfigKey.EthSendMinGasAmount,
      default: 20, // .002 LUX
    },
    swap: {
      configKey: SwapConfigKey.EthSwapMinGasAmount,
      default: 150, // .015 LUX
    },
  },
  tradingApiPollingIntervalMs: 500,
  testnet: false,
} as const satisfies UniverseChainInfo

export const LUX_TESTNET_CHAIN_INFO = {
  id: UniverseChainId.LuxTestnet,
  name: 'Lux Testnet',
  platform: Platform.EVM,
  assetRepoNetworkName: 'lux-testnet',
  backendChain: {
    chain: GraphQLApi.Chain.Ethereum as GqlChainId, // Fallback to Ethereum until Lux is added to GraphQL
    backendSupported: true, // Using Lux Gateway for Lux chain data
    nativeTokenBackendAddress: undefined,
  },
  blockPerMainnetEpochForChainId: 1,
  blockWaitMsBeforeWarning: ONE_MINUTE_MS,
  bridge: undefined,
  docs: 'https://docs.lux.network/',
  elementName: ElementName.ChainLuxTestnet,
  explorer: {
    name: 'Lux Testnet Explorer',
    url: 'https://explore.lux-test.network/',
  },
  interfaceName: 'lux-testnet',
  label: 'Lux Testnet',
  logo: LUX_NETWORK_LOGO,
  nativeCurrency: {
    name: 'LUX',
    symbol: 'LUX',
    decimals: 18,
    address: DEFAULT_NATIVE_ADDRESS_LEGACY,
    explorerLink: 'https://explore.lux-test.network/stats',
    logo: LUX_LOGO,
  },
  networkLayer: NetworkLayer.L1,
  pendingTransactionsRetryOptions: undefined,
  rpcUrls: {
    [RPCType.Public]: {
      http: ['https://api.lux.network/testnet/ext/bc/C/rpc'],
    },
    [RPCType.Default]: {
      http: ['https://api.lux.network/testnet/ext/bc/C/rpc'],
    },
    [RPCType.Fallback]: {
      http: ['https://api.lux.network/testnet/ext/bc/C/rpc'],
    },
    [RPCType.Interface]: {
      http: ['https://api.lux.network/testnet/ext/bc/C/rpc'],
    },
  },
  urlParam: 'lux-testnet',
  statusPage: undefined,
  tokens: testnetTokens,
  supportsV4: true, // Lux DEX precompile at 0x0400 supports V4-style pools
  supportsNFTs: true,
  wrappedNativeCurrency: {
    name: 'Wrapped LUX',
    symbol: 'WLUX',
    decimals: 18,
    address: '0xDe5310d0Eccc04C8987cB66Ff6b89Ee793442C91', // WLUX testnet deployment 2026-02-27
  },
  gasConfig: {
    send: {
      configKey: SwapConfigKey.EthSendMinGasAmount,
      default: 20, // .002 LUX
    },
    swap: {
      configKey: SwapConfigKey.EthSwapMinGasAmount,
      default: 150, // .015 LUX
    },
  },
  tradingApiPollingIntervalMs: 500,
  testnet: true,
} as const satisfies UniverseChainInfo

// LuxDev - for local development with luxd --dev or `lux dev start` (chain ID 1337, port 8545)
// Token addresses are deterministic CREATE addresses from DeployFullStack.s.sol deployed by anvil account 0
// The deployment nonces are: WLUX(0), LETH(1), LBTC(2), LUSD(3)
const devTokens = buildChainTokens({
  stables: {
    // LUSD is the stablecoin for LuxDev (nonce 3 from DeployFullStack.s.sol)
    USDC: buildUSDC('0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9', UniverseChainId.LuxDev),
  },
})

export const LUX_DEV_CHAIN_INFO = {
  id: UniverseChainId.LuxDev,
  name: 'Lux Dev',
  platform: Platform.EVM,
  assetRepoNetworkName: 'lux-dev',
  backendChain: {
    chain: GraphQLApi.Chain.Ethereum as GqlChainId, // Fallback to Ethereum for dev
    backendSupported: false, // No backend for dev mode
    nativeTokenBackendAddress: undefined,
  },
  blockPerMainnetEpochForChainId: 1,
  blockWaitMsBeforeWarning: ONE_MINUTE_MS,
  bridge: undefined,
  docs: 'https://docs.lux.network/',
  elementName: ElementName.ChainLux,
  explorer: {
    name: 'Lux Dev Explorer',
    url: 'http://localhost:8545/ext/bc/C/explorer/',
  },
  interfaceName: 'lux-dev',
  label: 'Lux Dev',
  logo: LUX_NETWORK_LOGO,
  nativeCurrency: {
    name: 'LUX',
    symbol: 'LUX',
    decimals: 18,
    address: DEFAULT_NATIVE_ADDRESS_LEGACY,
    explorerLink: undefined,
    logo: LUX_LOGO,
  },
  networkLayer: NetworkLayer.L1,
  pendingTransactionsRetryOptions: undefined,
  rpcUrls: {
    [RPCType.Public]: {
      http: ['http://127.0.0.1:8545/ext/bc/C/rpc'],
    },
    [RPCType.Default]: {
      http: ['http://127.0.0.1:8545/ext/bc/C/rpc'],
    },
    [RPCType.Fallback]: {
      http: ['http://127.0.0.1:8545/ext/bc/C/rpc'],
    },
    [RPCType.Interface]: {
      http: ['http://127.0.0.1:8545/ext/bc/C/rpc'],
    },
  },
  urlParam: 'lux-dev',
  statusPage: undefined,
  tokens: devTokens,
  supportsV4: true, // Lux DEX precompile supports V4-style pools
  supportsNFTs: true,
  wrappedNativeCurrency: {
    name: 'Wrapped LUX',
    symbol: 'WLUX',
    decimals: 18,
    // Deterministic CREATE address from DeployFullStack.s.sol (nonce 0 from anvil account 0)
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  },
  gasConfig: {
    send: {
      configKey: SwapConfigKey.EthSendMinGasAmount,
      default: 20, // .002 LUX
    },
    swap: {
      configKey: SwapConfigKey.EthSwapMinGasAmount,
      default: 150, // .015 LUX
    },
  },
  tradingApiPollingIntervalMs: 500,
  testnet: false, // LuxDev is for local dev, not a true testnet
} as const satisfies UniverseChainInfo
