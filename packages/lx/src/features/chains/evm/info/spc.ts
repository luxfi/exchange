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
    USDC: buildUSDC('0x57f9E717dc080a6A76fB6F77BecA8C9C1D266B96', UniverseChainId.SPC), // LUSDC on SPC
  },
})

export const SPC_CHAIN_INFO = {
  id: UniverseChainId.SPC,
  name: 'SPC Network',
  platform: Platform.EVM,
  assetRepoNetworkName: 'spc',
  backendChain: {
    chain: GraphQLApi.Chain.Ethereum as GqlChainId,
    backendSupported: false,
    nativeTokenBackendAddress: undefined,
  },
  blockPerMainnetEpochForChainId: 1,
  blockWaitMsBeforeWarning: ONE_MINUTE_MS,
  bridge: undefined,
  docs: 'https://docs.lux.network/',
  elementName: ElementName.ChainSPC,
  explorer: {
    name: 'SPC Explorer',
    url: 'https://explore-spc.lux.network/',
  },
  interfaceName: 'spc',
  label: 'SPC',
  logo: LUX_NETWORK_LOGO,
  nativeCurrency: {
    name: 'SPC',
    symbol: 'SPC',
    decimals: 18,
    address: DEFAULT_NATIVE_ADDRESS_LEGACY,
    explorerLink: 'https://explore-spc.lux.network/stats',
    logo: LUX_LOGO,
  },
  networkLayer: NetworkLayer.L2,
  pendingTransactionsRetryOptions: undefined,
  rpcUrls: {
    [RPCType.Public]: {
      http: ['https://api.lux.network/mainnet/ext/bc/rtjwvtE1tEvrokmpeYdTq7b2zqZgmybKwR5MLjKMGAR1W78dQ/rpc'],
    },
    [RPCType.Default]: {
      http: ['https://api.lux.network/mainnet/ext/bc/rtjwvtE1tEvrokmpeYdTq7b2zqZgmybKwR5MLjKMGAR1W78dQ/rpc'],
    },
    [RPCType.Fallback]: {
      http: ['https://api.lux.network/mainnet/ext/bc/rtjwvtE1tEvrokmpeYdTq7b2zqZgmybKwR5MLjKMGAR1W78dQ/rpc'],
    },
    [RPCType.Interface]: {
      http: ['https://api.lux.network/mainnet/ext/bc/rtjwvtE1tEvrokmpeYdTq7b2zqZgmybKwR5MLjKMGAR1W78dQ/rpc'],
    },
  },
  urlParam: 'spc',
  statusPage: undefined,
  tokens,
  supportsV4: false,
  supportsNFTs: false,
  wrappedNativeCurrency: {
    name: 'Wrapped SPC',
    symbol: 'WSPC',
    decimals: 18,
    address: '0x3C18bB6B17eb3F0879d4653e0120a531aF4d86E3', // WLUX-equivalent on SPC
  },
  gasConfig: {
    send: {
      configKey: SwapConfigKey.EthSendMinGasAmount,
      default: 20,
    },
    swap: {
      configKey: SwapConfigKey.EthSwapMinGasAmount,
      default: 150,
    },
  },
  tradingApiPollingIntervalMs: 500,
  testnet: false,
} as const satisfies UniverseChainInfo
