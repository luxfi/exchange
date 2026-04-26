import { Token } from '@luxamm/sdk-core'
import { GraphQLApi } from '@l.x/api'
import { LIQUIDITY_LOGO } from '@l.x/ui/src/assets'
import { DEFAULT_NATIVE_ADDRESS_LEGACY } from '@l.x/lx/src/features/chains/evm/rpc'
import { buildChainTokens } from '@l.x/lx/src/features/chains/evm/tokens'
import { GENERIC_L2_GAS_CONFIG } from '@l.x/lx/src/features/chains/gasDefaults'
import { GqlChainId, NetworkLayer, RPCType, UniverseChainId, UniverseChainInfo } from '@l.x/lx/src/features/chains/types'
import { Platform } from '@l.x/lx/src/features/platforms/types/Platform'
import { ElementName } from '@l.x/lx/src/features/telemetry/constants'
import { ONE_SECOND_MS } from '@l.x/utils/src/time/time'

const USDL_MAINNET_ADDRESS = '0x0000000000000000000000000000000000000000'

const liquidityTokens = buildChainTokens({
  stables: {
    USDL: new Token(UniverseChainId.Liquidity, USDL_MAINNET_ADDRESS, 18, 'USDL', 'Liquidity USD'),
  },
})

const liquidityTestnetTokens = buildChainTokens({
  stables: {
    USDL: new Token(UniverseChainId.LiquidityTestnet, USDL_MAINNET_ADDRESS, 18, 'USDL', 'Liquidity USD'),
  },
})

const liquidityDevTokens = buildChainTokens({
  stables: {
    USDL: new Token(UniverseChainId.LiquidityDev, USDL_MAINNET_ADDRESS, 18, 'USDL', 'Liquidity USD'),
  },
})

export const LIQUIDITY_CHAIN_INFO = {
  id: UniverseChainId.Liquidity,
  platform: Platform.EVM,
  testnet: false,
  assetRepoNetworkName: undefined,
  backendChain: {
    chain: GraphQLApi.Chain.Liquidity as GqlChainId,
    backendSupported: false,
    nativeTokenBackendAddress: undefined,
  },
  bridge: undefined,
  docs: 'https://docs.liquidity.io',
  label: 'Liquidity',
  logo: LIQUIDITY_LOGO,
  name: 'Liquidity',
  nativeCurrency: {
    name: 'LQDTY',
    symbol: 'LQDTY',
    decimals: 18,
    address: DEFAULT_NATIVE_ADDRESS_LEGACY,
    logo: LIQUIDITY_LOGO,
  },
  networkLayer: NetworkLayer.L1,
  blockTimeMs: 2000,
  pendingTransactionsRetryOptions: undefined,
  statusPage: undefined,
  supportsV4: false,
  supportsNFTs: false,
  urlParam: 'liquidity',
  rpcUrls: {
    [RPCType.Default]: { http: ['https://rpc.main.satschel.com/rpc'] },
    [RPCType.Interface]: { http: ['https://rpc.main.satschel.com/rpc'] },
  },
  wrappedNativeCurrency: {
    name: 'Wrapped LQDTY',
    symbol: 'WLQDTY',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000',
  },
  blockPerMainnetEpochForChainId: 1,
  blockWaitMsBeforeWarning: undefined,
  elementName: ElementName.ChainLiquidity,
  explorer: {
    name: 'Liquidity Explorer',
    url: 'https://explore.main.satschel.com/',
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
    chain: GraphQLApi.Chain.LiquidityTestnet as GqlChainId,
    backendSupported: false,
    nativeTokenBackendAddress: undefined,
  },
  bridge: undefined,
  docs: 'https://docs.liquidity.io',
  label: 'Liquidity Testnet',
  logo: LIQUIDITY_LOGO,
  name: 'Liquidity Testnet',
  nativeCurrency: {
    name: 'LQDTY',
    symbol: 'LQDTY',
    decimals: 18,
    address: DEFAULT_NATIVE_ADDRESS_LEGACY,
    logo: LIQUIDITY_LOGO,
  },
  networkLayer: NetworkLayer.L1,
  blockTimeMs: 2000,
  pendingTransactionsRetryOptions: undefined,
  statusPage: undefined,
  supportsV4: false,
  supportsNFTs: false,
  urlParam: 'liquidity_testnet',
  rpcUrls: {
    [RPCType.Default]: { http: ['https://rpc.test.satschel.com/rpc'] },
    [RPCType.Interface]: { http: ['https://rpc.test.satschel.com/rpc'] },
  },
  wrappedNativeCurrency: {
    name: 'Wrapped LQDTY',
    symbol: 'WLQDTY',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000',
  },
  blockPerMainnetEpochForChainId: 1,
  blockWaitMsBeforeWarning: undefined,
  elementName: ElementName.ChainLiquidityTestnet,
  explorer: {
    name: 'Liquidity Testnet Explorer',
    url: 'https://explore.test.satschel.com/',
  },
  interfaceName: 'liquidity_testnet',
  tokens: liquidityTestnetTokens,
  tradingApiPollingIntervalMs: ONE_SECOND_MS,
  gasConfig: GENERIC_L2_GAS_CONFIG,
} as const satisfies UniverseChainInfo

export const LIQUIDITY_DEV_CHAIN_INFO = {
  id: UniverseChainId.LiquidityDev,
  platform: Platform.EVM,
  testnet: true,
  assetRepoNetworkName: undefined,
  backendChain: {
    chain: GraphQLApi.Chain.LiquidityDevnet as GqlChainId,
    backendSupported: false,
    nativeTokenBackendAddress: undefined,
  },
  bridge: undefined,
  docs: 'https://docs.liquidity.io',
  label: 'Liquidity Devnet',
  logo: LIQUIDITY_LOGO,
  name: 'Liquidity Devnet',
  nativeCurrency: {
    name: 'LQDTY',
    symbol: 'LQDTY',
    decimals: 18,
    address: DEFAULT_NATIVE_ADDRESS_LEGACY,
    logo: LIQUIDITY_LOGO,
  },
  networkLayer: NetworkLayer.L1,
  blockTimeMs: 2000,
  pendingTransactionsRetryOptions: undefined,
  statusPage: undefined,
  supportsV4: false,
  supportsNFTs: false,
  urlParam: 'liquidity_dev',
  rpcUrls: {
    [RPCType.Default]: { http: ['https://rpc.dev.satschel.com/rpc'] },
    [RPCType.Interface]: { http: ['https://rpc.dev.satschel.com/rpc'] },
  },
  wrappedNativeCurrency: {
    name: 'Wrapped LQDTY',
    symbol: 'WLQDTY',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000',
  },
  blockPerMainnetEpochForChainId: 1,
  blockWaitMsBeforeWarning: undefined,
  elementName: ElementName.ChainLiquidityDev,
  explorer: {
    name: 'Liquidity Devnet Explorer',
    url: 'https://explore.dev.satschel.com/',
  },
  interfaceName: 'liquidity_dev',
  tokens: liquidityDevTokens,
  tradingApiPollingIntervalMs: ONE_SECOND_MS,
  gasConfig: GENERIC_L2_GAS_CONFIG,
} as const satisfies UniverseChainInfo
