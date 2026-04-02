import { Token } from '@luxamm/sdk-core'
import { GraphQLApi } from '@l.x/api'
import { ZOO_LOGO } from 'ui/src/assets'
import { DEFAULT_NATIVE_ADDRESS_LEGACY } from 'uniswap/src/features/chains/evm/rpc'
import { buildChainTokens } from 'uniswap/src/features/chains/evm/tokens'
import { GENERIC_L2_GAS_CONFIG } from 'uniswap/src/features/chains/gasDefaults'
import { GqlChainId, NetworkLayer, RPCType, UniverseChainId, UniverseChainInfo } from 'uniswap/src/features/chains/types'
import { Platform } from 'uniswap/src/features/platforms/types/Platform'
import { ElementName } from 'uniswap/src/features/telemetry/constants'
import { ONE_SECOND_MS } from 'utilities/src/time/time'

const LUSDC_ADDRESS = '0xb2ee1CE7b84853b83AA08702aD0aD4D79711882D'

const zooTokens = buildChainTokens({
  stables: {
    LUSDC: new Token(UniverseChainId.Zoo, LUSDC_ADDRESS, 6, 'LUSDC', 'Lux USD Coin'),
  },
})

const zooTestnetTokens = buildChainTokens({
  stables: {
    LUSDC: new Token(UniverseChainId.ZooTestnet, LUSDC_ADDRESS, 6, 'LUSDC', 'Lux USD Coin'),
  },
})

export const ZOO_CHAIN_INFO = {
  id: UniverseChainId.Zoo,
  platform: Platform.EVM,
  testnet: false,
  assetRepoNetworkName: undefined,
  backendChain: {
    chain: GraphQLApi.Chain.Ethereum as GqlChainId,
    backendSupported: false,
    nativeTokenBackendAddress: undefined,
  },
  bridge: undefined,
  docs: 'https://docs.zoo.network',
  label: 'Zoo Network',
  logo: ZOO_LOGO,
  name: 'Zoo Network',
  nativeCurrency: {
    name: 'ZOO',
    symbol: 'ZOO',
    decimals: 18,
    address: DEFAULT_NATIVE_ADDRESS_LEGACY,
    logo: ZOO_LOGO,
  },
  networkLayer: NetworkLayer.L2,
  blockTimeMs: 2000,
  pendingTransactionsRetryOptions: undefined,
  statusPage: undefined,
  supportsV4: false,
  supportsNFTs: false,
  urlParam: 'zoo',
  rpcUrls: {
    [RPCType.Default]: { http: ['https://api.lux.network/mainnet/ext/bc/zoo/rpc'] },
    [RPCType.Interface]: { http: ['https://api.lux.network/mainnet/ext/bc/zoo/rpc'] },
  },
  wrappedNativeCurrency: {
    name: 'Wrapped ZOO',
    symbol: 'WZOO',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000',
  },
  blockPerMainnetEpochForChainId: 1,
  blockWaitMsBeforeWarning: undefined,
  elementName: ElementName.ChainZoo,
  explorer: {
    name: 'Zoo Explorer',
    url: 'https://explore-zoo.lux.network/',
  },
  interfaceName: 'zoo',
  tokens: zooTokens,
  tradingApiPollingIntervalMs: ONE_SECOND_MS,
  gasConfig: GENERIC_L2_GAS_CONFIG,
} as const satisfies UniverseChainInfo

export const ZOO_TESTNET_CHAIN_INFO = {
  id: UniverseChainId.ZooTestnet,
  platform: Platform.EVM,
  testnet: true,
  assetRepoNetworkName: undefined,
  backendChain: {
    chain: GraphQLApi.Chain.Ethereum as GqlChainId,
    backendSupported: false,
    nativeTokenBackendAddress: undefined,
  },
  bridge: undefined,
  docs: 'https://docs.zoo.network',
  label: 'Zoo Network Testnet',
  logo: ZOO_LOGO,
  name: 'Zoo Network Testnet',
  nativeCurrency: {
    name: 'ZOO',
    symbol: 'ZOO',
    decimals: 18,
    address: DEFAULT_NATIVE_ADDRESS_LEGACY,
    logo: ZOO_LOGO,
  },
  networkLayer: NetworkLayer.L2,
  blockTimeMs: 2000,
  pendingTransactionsRetryOptions: undefined,
  statusPage: undefined,
  supportsV4: false,
  supportsNFTs: false,
  urlParam: 'zoo_testnet',
  rpcUrls: {
    [RPCType.Default]: { http: ['https://api.lux.network/testnet/ext/bc/zoo/rpc'] },
    [RPCType.Interface]: { http: ['https://api.lux.network/testnet/ext/bc/zoo/rpc'] },
  },
  wrappedNativeCurrency: {
    name: 'Wrapped ZOO',
    symbol: 'WZOO',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000',
  },
  blockPerMainnetEpochForChainId: 1,
  blockWaitMsBeforeWarning: undefined,
  elementName: ElementName.ChainZooTestnet,
  explorer: {
    name: 'Zoo Testnet Explorer',
    url: 'https://explore-zoo.lux.network/',
  },
  interfaceName: 'zoo_testnet',
  tokens: zooTestnetTokens,
  tradingApiPollingIntervalMs: ONE_SECOND_MS,
  gasConfig: GENERIC_L2_GAS_CONFIG,
} as const satisfies UniverseChainInfo
