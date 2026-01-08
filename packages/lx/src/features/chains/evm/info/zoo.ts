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
import { buildUSDC } from 'lx/src/features/tokens/stablecoin'
import { ONE_MINUTE_MS } from 'utilities/src/time/time'

const tokens = buildChainTokens({
  stables: {
    USDC: buildUSDC('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', UniverseChainId.Zoo), // Placeholder - update with actual USDC address on Zoo
  },
})

const testnetTokens = buildChainTokens({
  stables: {
    USDC: buildUSDC('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', UniverseChainId.ZooTestnet), // Placeholder
  },
})

export const ZOO_CHAIN_INFO = {
  id: UniverseChainId.Zoo,
  name: 'Zoo Network',
  platform: Platform.EVM,
  assetRepoNetworkName: 'zoo',
  backendChain: {
    chain: GraphQLApi.Chain.Ethereum as GqlChainId, // Fallback to Ethereum until Zoo is added to GraphQL
    backendSupported: true, // Using LXD Gateway for Zoo chain data
    nativeTokenBackendAddress: undefined,
  },
  blockPerMainnetEpochForChainId: 1,
  blockWaitMsBeforeWarning: ONE_MINUTE_MS,
  bridge: undefined,
  docs: 'https://docs.zoo.network/',
  elementName: ElementName.ChainZoo,
  explorer: {
    name: 'Zoo Explorer',
    url: 'https://explore.zoo.network/',
  },
  interfaceName: 'zoo',
  label: 'Zoo',
  logo: LUX_NETWORK_LOGO, // Use Lux logo until Zoo logo is added
  nativeCurrency: {
    name: 'ZOO',
    symbol: 'ZOO',
    decimals: 18,
    address: DEFAULT_NATIVE_ADDRESS_LEGACY,
    explorerLink: 'https://explore.zoo.network/stats',
    logo: LUX_LOGO, // Use LUX logo until ZOO logo is added
  },
  networkLayer: NetworkLayer.L1,
  pendingTransactionsRetryOptions: undefined,
  rpcUrls: {
    [RPCType.Public]: {
      http: ['https://api.zoo.network/rpc'],
    },
    [RPCType.Default]: {
      http: ['https://api.zoo.network/rpc'],
    },
    [RPCType.Fallback]: {
      http: ['https://api.zoo.network/rpc'],
    },
    [RPCType.Interface]: {
      http: ['https://api.zoo.network/rpc'],
    },
  },
  urlParam: 'zoo',
  statusPage: undefined,
  tokens,
  supportsV4: false,
  supportsNFTs: true,
  wrappedNativeCurrency: {
    name: 'Wrapped ZOO',
    symbol: 'WZOO',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000', // Placeholder - update with actual WZOO address
  },
  gasConfig: {
    send: {
      configKey: SwapConfigKey.EthSendMinGasAmount,
      default: 20, // .002 ZOO
    },
    swap: {
      configKey: SwapConfigKey.EthSwapMinGasAmount,
      default: 150, // .015 ZOO
    },
  },
  tradingApiPollingIntervalMs: 500,
  testnet: false,
} as const satisfies UniverseChainInfo

export const ZOO_TESTNET_CHAIN_INFO = {
  id: UniverseChainId.ZooTestnet,
  name: 'Zoo Testnet',
  platform: Platform.EVM,
  assetRepoNetworkName: 'zoo-testnet',
  backendChain: {
    chain: GraphQLApi.Chain.Ethereum as GqlChainId, // Fallback to Ethereum until Zoo is added to GraphQL
    backendSupported: true, // Using LXD Gateway for Zoo chain data
    nativeTokenBackendAddress: undefined,
  },
  blockPerMainnetEpochForChainId: 1,
  blockWaitMsBeforeWarning: ONE_MINUTE_MS,
  bridge: undefined,
  docs: 'https://docs.zoo.network/',
  elementName: ElementName.ChainZooTestnet,
  explorer: {
    name: 'Zoo Testnet Explorer',
    url: 'https://explore.zoo-test.network/',
  },
  interfaceName: 'zoo-testnet',
  label: 'Zoo Testnet',
  logo: LUX_NETWORK_LOGO, // Use Lux logo until Zoo logo is added
  nativeCurrency: {
    name: 'ZOO',
    symbol: 'ZOO',
    decimals: 18,
    address: DEFAULT_NATIVE_ADDRESS_LEGACY,
    explorerLink: 'https://explore.zoo-test.network/stats',
    logo: LUX_LOGO, // Use LUX logo until ZOO logo is added
  },
  networkLayer: NetworkLayer.L1,
  pendingTransactionsRetryOptions: undefined,
  rpcUrls: {
    [RPCType.Public]: {
      http: ['https://api.zoo-test.network/rpc'],
    },
    [RPCType.Default]: {
      http: ['https://api.zoo-test.network/rpc'],
    },
    [RPCType.Fallback]: {
      http: ['https://api.zoo-test.network/rpc'],
    },
    [RPCType.Interface]: {
      http: ['https://api.zoo-test.network/rpc'],
    },
  },
  urlParam: 'zoo-testnet',
  statusPage: undefined,
  tokens: testnetTokens,
  supportsV4: false,
  supportsNFTs: true,
  wrappedNativeCurrency: {
    name: 'Wrapped ZOO',
    symbol: 'WZOO',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000', // Placeholder - update with actual WZOO address
  },
  gasConfig: {
    send: {
      configKey: SwapConfigKey.EthSendMinGasAmount,
      default: 20, // .002 ZOO
    },
    swap: {
      configKey: SwapConfigKey.EthSwapMinGasAmount,
      default: 150, // .015 ZOO
    },
  },
  tradingApiPollingIntervalMs: 500,
  testnet: true,
} as const satisfies UniverseChainInfo
