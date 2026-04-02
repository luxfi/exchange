import { Token } from '@luxamm/sdk-core'
import { GraphQLApi } from '@luxexchange/api'
import { LUX_LOGO } from 'ui/src/assets'
import { DEFAULT_NATIVE_ADDRESS_LEGACY } from 'uniswap/src/features/chains/evm/rpc'
import { buildChainTokens } from 'uniswap/src/features/chains/evm/tokens'
import { GENERIC_L2_GAS_CONFIG } from 'uniswap/src/features/chains/gasDefaults'
import { GqlChainId, NetworkLayer, RPCType, UniverseChainId, UniverseChainInfo } from 'uniswap/src/features/chains/types'
import { Platform } from 'uniswap/src/features/platforms/types/Platform'
import { ElementName } from 'uniswap/src/features/telemetry/constants'
import { ONE_SECOND_MS } from 'utilities/src/time/time'

const LUSDC_MAINNET_ADDRESS = '0x848Cff46eb323f323b6Bbe1Df274E40793d7f2c2'
const LUSDC_TESTNET_ADDRESS = '0x8a3fad1c7FB94461621351aa6A983B6f814F039c'

const luxTokens = buildChainTokens({
  stables: {
    LUSDC: new Token(UniverseChainId.Lux, LUSDC_MAINNET_ADDRESS, 18, 'LUSDC', 'Lux USD Coin'),
  },
})

const luxTestnetTokens = buildChainTokens({
  stables: {
    LUSDC: new Token(UniverseChainId.LuxTestnet, LUSDC_TESTNET_ADDRESS, 6, 'LUSDC', 'Lux USD Coin'),
  },
})

const luxDevTokens = buildChainTokens({
  stables: {},
})

export const LUX_CHAIN_INFO = {
  id: UniverseChainId.Lux,
  platform: Platform.EVM,
  testnet: false,
  assetRepoNetworkName: undefined,
  backendChain: {
    chain: GraphQLApi.Chain.Ethereum as GqlChainId,
    backendSupported: false,
    nativeTokenBackendAddress: undefined,
  },
  bridge: undefined,
  docs: 'https://docs.lux.network',
  label: 'Lux',
  logo: LUX_LOGO,
  name: 'Lux Network',
  nativeCurrency: {
    name: 'LUX',
    symbol: 'LUX',
    decimals: 18,
    address: DEFAULT_NATIVE_ADDRESS_LEGACY,
    logo: LUX_LOGO,
  },
  networkLayer: NetworkLayer.L1,
  blockTimeMs: 2000,
  pendingTransactionsRetryOptions: undefined,
  statusPage: undefined,
  supportsV4: false,
  supportsNFTs: false,
  urlParam: 'lux',
  rpcUrls: {
    [RPCType.Default]: { http: ['https://api.lux.network/mainnet/ext/bc/C/rpc'] },
    [RPCType.Interface]: { http: ['https://api.lux.network/mainnet/ext/bc/C/rpc'] },
  },
  wrappedNativeCurrency: {
    name: 'Wrapped LUX',
    symbol: 'WLUX',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000',
  },
  blockPerMainnetEpochForChainId: 1,
  blockWaitMsBeforeWarning: undefined,
  elementName: ElementName.ChainLux,
  explorer: {
    name: 'Lux Explorer',
    url: 'https://explore.lux.network/',
  },
  interfaceName: 'lux',
  tokens: luxTokens,
  tradingApiPollingIntervalMs: ONE_SECOND_MS,
  gasConfig: GENERIC_L2_GAS_CONFIG,
} as const satisfies UniverseChainInfo

export const LUX_TESTNET_CHAIN_INFO = {
  id: UniverseChainId.LuxTestnet,
  platform: Platform.EVM,
  testnet: true,
  assetRepoNetworkName: undefined,
  backendChain: {
    chain: GraphQLApi.Chain.Ethereum as GqlChainId,
    backendSupported: false,
    nativeTokenBackendAddress: undefined,
  },
  bridge: undefined,
  docs: 'https://docs.lux.network',
  label: 'Lux Testnet',
  logo: LUX_LOGO,
  name: 'Lux Network Testnet',
  nativeCurrency: {
    name: 'LUX',
    symbol: 'LUX',
    decimals: 18,
    address: DEFAULT_NATIVE_ADDRESS_LEGACY,
    logo: LUX_LOGO,
  },
  networkLayer: NetworkLayer.L1,
  blockTimeMs: 2000,
  pendingTransactionsRetryOptions: undefined,
  statusPage: undefined,
  supportsV4: false,
  supportsNFTs: false,
  urlParam: 'lux_testnet',
  rpcUrls: {
    [RPCType.Default]: { http: ['https://api.lux.network/testnet/ext/bc/C/rpc'] },
    [RPCType.Interface]: { http: ['https://api.lux.network/testnet/ext/bc/C/rpc'] },
  },
  wrappedNativeCurrency: {
    name: 'Wrapped LUX',
    symbol: 'WLUX',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000',
  },
  blockPerMainnetEpochForChainId: 1,
  blockWaitMsBeforeWarning: undefined,
  elementName: ElementName.ChainLuxTestnet,
  explorer: {
    name: 'Lux Testnet Explorer',
    url: 'https://explore-testnet.lux.network/',
  },
  interfaceName: 'lux_testnet',
  tokens: luxTestnetTokens,
  tradingApiPollingIntervalMs: ONE_SECOND_MS,
  gasConfig: GENERIC_L2_GAS_CONFIG,
} as const satisfies UniverseChainInfo

export const LUX_DEV_CHAIN_INFO = {
  id: UniverseChainId.LuxDev,
  platform: Platform.EVM,
  testnet: true,
  assetRepoNetworkName: undefined,
  backendChain: {
    chain: GraphQLApi.Chain.Ethereum as GqlChainId,
    backendSupported: false,
    nativeTokenBackendAddress: undefined,
  },
  bridge: undefined,
  docs: 'https://docs.lux.network',
  label: 'Lux Dev',
  logo: LUX_LOGO,
  name: 'Lux Network Dev',
  nativeCurrency: {
    name: 'LUX',
    symbol: 'LUX',
    decimals: 18,
    address: DEFAULT_NATIVE_ADDRESS_LEGACY,
    logo: LUX_LOGO,
  },
  networkLayer: NetworkLayer.L1,
  blockTimeMs: 2000,
  pendingTransactionsRetryOptions: undefined,
  statusPage: undefined,
  supportsV4: false,
  supportsNFTs: false,
  urlParam: 'lux_dev',
  rpcUrls: {
    [RPCType.Default]: { http: ['http://localhost:8545/ext/bc/C/rpc'] },
    [RPCType.Interface]: { http: ['http://localhost:8545/ext/bc/C/rpc'] },
  },
  wrappedNativeCurrency: {
    name: 'Wrapped LUX',
    symbol: 'WLUX',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000',
  },
  blockPerMainnetEpochForChainId: 1,
  blockWaitMsBeforeWarning: undefined,
  elementName: ElementName.ChainLuxDev,
  explorer: undefined,
  interfaceName: 'lux_dev',
  tokens: luxDevTokens,
  tradingApiPollingIntervalMs: ONE_SECOND_MS,
  gasConfig: GENERIC_L2_GAS_CONFIG,
} as const satisfies UniverseChainInfo
