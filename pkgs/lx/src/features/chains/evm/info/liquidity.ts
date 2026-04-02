import { Token } from '@luxamm/sdk-core'
import { GraphQLApi } from '@l.x/api'
import { LIQUIDITY_LOGO } from 'ui/src/assets'
import { DEFAULT_NATIVE_ADDRESS_LEGACY } from 'lx/src/features/chains/evm/rpc'
import { buildChainTokens } from 'lx/src/features/chains/evm/tokens'
import { GENERIC_L2_GAS_CONFIG } from 'lx/src/features/chains/gasDefaults'
import { GqlChainId, NetworkLayer, RPCType, UniverseChainId, UniverseChainInfo } from 'lx/src/features/chains/types'
import { Platform } from 'lx/src/features/platforms/types/Platform'
import { ElementName } from 'lx/src/features/telemetry/constants'
import { ONE_SECOND_MS } from 'utilities/src/time/time'

// LUSD is the only dollar on the Liquidity chain — 1:1 USD backed via Braintree/ACH
const LUSD_ADDRESS = '0x0000000000000000000000000000000000000000' // deployed via SecurityToken on devnet

const liquidityTokens = buildChainTokens({
  stables: {
    LUSD: new Token(UniverseChainId.LiquidityMainnet, LUSD_ADDRESS, 18, 'LUSD', 'Liquidity USD'),
  },
})

const liquidityTestnetTokens = buildChainTokens({
  stables: {
    LUSD: new Token(UniverseChainId.LiquidityTestnet, LUSD_ADDRESS, 18, 'LUSD', 'Liquidity USD'),
  },
})

const liquidityDevnetTokens = buildChainTokens({
  stables: {
    LUSD: new Token(UniverseChainId.LiquidityDevnet, LUSD_ADDRESS, 18, 'LUSD', 'Liquidity USD'),
  },
})

export const LIQUIDITY_MAINNET_CHAIN_INFO = {
  id: UniverseChainId.LiquidityMainnet,
  platform: Platform.EVM,
  testnet: false,
  assetRepoNetworkName: undefined,
  backendChain: {
    chain: GraphQLApi.Chain.Ethereum as GqlChainId,
    backendSupported: false,
    nativeTokenBackendAddress: undefined,
  },
  bridge: undefined,
  docs: 'https://docs.lux.exchange/',
  label: 'Liquidity',
  logo: LIQUIDITY_LOGO,
  name: 'Liquidity',
  nativeCurrency: {
    name: 'LUX',
    symbol: 'LUX',
    decimals: 18,
    address: DEFAULT_NATIVE_ADDRESS_LEGACY,
    logo: LIQUIDITY_LOGO,
  },
  networkLayer: NetworkLayer.L2,
  blockTimeMs: 2000,
  pendingTransactionsRetryOptions: undefined,
  statusPage: undefined,
  supportsV4: false,
  supportsNFTs: false,
  urlParam: 'liquidity',
  rpcUrls: {
    [RPCType.Default]: { http: ['https://rpc.main.lux.network/rpc'] },
    [RPCType.Interface]: { http: ['https://rpc.main.lux.network/rpc'] },
  },
  wrappedNativeCurrency: {
    name: 'Wrapped LUX',
    symbol: 'WLUX',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000',
  },
  blockPerMainnetEpochForChainId: 1,
  blockWaitMsBeforeWarning: undefined,
  elementName: ElementName.ChainLiquidity,
  explorer: {
    name: 'Liquidity Explorer',
    url: 'https://explore.main.lux.network/',
  },
  interfaceName: 'liquidity',
  tokens: liquidityTokens,
  tradingApiPollingIntervalMs: ONE_SECOND_MS,
  gasConfig: GENERIC_L2_GAS_CONFIG,
} as const satisfies UniverseChainInfo

export const LIQUIDITY_TESTNET_CHAIN_INFO = {
  id: UniverseChainId.LiquidityTestnet,
  platform: Platform.EVM,
  testnet: true,
  assetRepoNetworkName: undefined,
  backendChain: {
    chain: GraphQLApi.Chain.Ethereum as GqlChainId,
    backendSupported: false,
    nativeTokenBackendAddress: undefined,
  },
  bridge: undefined,
  docs: 'https://docs.lux.exchange/',
  label: 'Liquidity Testnet',
  logo: LIQUIDITY_LOGO,
  name: 'Liquidity Testnet',
  nativeCurrency: {
    name: 'LUX',
    symbol: 'LUX',
    decimals: 18,
    address: DEFAULT_NATIVE_ADDRESS_LEGACY,
    logo: LIQUIDITY_LOGO,
  },
  networkLayer: NetworkLayer.L2,
  blockTimeMs: 2000,
  pendingTransactionsRetryOptions: undefined,
  statusPage: undefined,
  supportsV4: false,
  supportsNFTs: false,
  urlParam: 'liquidity_testnet',
  rpcUrls: {
    [RPCType.Default]: { http: ['https://rpc.test.lux.network/rpc'] },
    [RPCType.Interface]: { http: ['https://rpc.test.lux.network/rpc'] },
  },
  wrappedNativeCurrency: {
    name: 'Wrapped LUX',
    symbol: 'WLUX',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000',
  },
  blockPerMainnetEpochForChainId: 1,
  blockWaitMsBeforeWarning: undefined,
  elementName: ElementName.ChainLiquidityTestnet,
  explorer: {
    name: 'Liquidity Testnet Explorer',
    url: 'https://explore.test.lux.network/',
  },
  interfaceName: 'liquidity_testnet',
  tokens: liquidityTestnetTokens,
  tradingApiPollingIntervalMs: ONE_SECOND_MS,
  gasConfig: GENERIC_L2_GAS_CONFIG,
} as const satisfies UniverseChainInfo

export const LIQUIDITY_DEVNET_CHAIN_INFO = {
  id: UniverseChainId.LiquidityDevnet,
  platform: Platform.EVM,
  testnet: true,
  assetRepoNetworkName: undefined,
  backendChain: {
    chain: GraphQLApi.Chain.Ethereum as GqlChainId,
    backendSupported: false,
    nativeTokenBackendAddress: undefined,
  },
  bridge: undefined,
  docs: 'https://docs.lux.exchange/',
  label: 'Liquidity Devnet',
  logo: LIQUIDITY_LOGO,
  name: 'Liquidity Devnet',
  nativeCurrency: {
    name: 'LUX',
    symbol: 'LUX',
    decimals: 18,
    address: DEFAULT_NATIVE_ADDRESS_LEGACY,
    logo: LIQUIDITY_LOGO,
  },
  networkLayer: NetworkLayer.L2,
  blockTimeMs: 2000,
  pendingTransactionsRetryOptions: undefined,
  statusPage: undefined,
  supportsV4: false,
  supportsNFTs: false,
  urlParam: 'liquidity_devnet',
  rpcUrls: {
    [RPCType.Default]: { http: ['https://rpc.dev.lux.network/rpc'] },
    [RPCType.Interface]: { http: ['https://rpc.dev.lux.network/rpc'] },
  },
  wrappedNativeCurrency: {
    name: 'Wrapped LUX',
    symbol: 'WLUX',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000',
  },
  blockPerMainnetEpochForChainId: 1,
  blockWaitMsBeforeWarning: undefined,
  elementName: ElementName.ChainLiquidityDevnet,
  explorer: {
    name: 'Liquidity Devnet Explorer',
    url: 'https://explore.dev.lux.network/',
  },
  interfaceName: 'liquidity_devnet',
  tokens: liquidityDevnetTokens,
  tradingApiPollingIntervalMs: ONE_SECOND_MS,
  gasConfig: GENERIC_L2_GAS_CONFIG,
} as const satisfies UniverseChainInfo
