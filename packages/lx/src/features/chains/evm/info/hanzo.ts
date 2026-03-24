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
    USDC: buildUSDC('0x57f9E717dc080a6A76fB6F77BecA8C9C1D266B96', UniverseChainId.Hanzo), // LUSDC on Hanzo
  },
})

export const HANZO_CHAIN_INFO = {
  id: UniverseChainId.Hanzo,
  name: 'Hanzo Network',
  platform: Platform.EVM,
  assetRepoNetworkName: 'hanzo',
  backendChain: {
    chain: GraphQLApi.Chain.Ethereum as GqlChainId,
    backendSupported: false,
    nativeTokenBackendAddress: undefined,
  },
  blockPerMainnetEpochForChainId: 1,
  blockWaitMsBeforeWarning: ONE_MINUTE_MS,
  bridge: undefined,
  docs: 'https://docs.lux.network/',
  elementName: ElementName.ChainHanzo,
  explorer: {
    name: 'Hanzo Explorer',
    url: 'https://explore-hanzo.lux.network/',
  },
  interfaceName: 'hanzo',
  label: 'Hanzo',
  logo: LUX_NETWORK_LOGO, // Uses Lux ecosystem logo
  nativeCurrency: {
    name: 'HANZO',
    symbol: 'HANZO',
    decimals: 18,
    address: DEFAULT_NATIVE_ADDRESS_LEGACY,
    explorerLink: 'https://explore-hanzo.lux.network/stats',
    logo: LUX_LOGO,
  },
  networkLayer: NetworkLayer.L2,
  pendingTransactionsRetryOptions: undefined,
  rpcUrls: {
    [RPCType.Public]: {
      http: ['https://api.lux.network/mainnet/ext/bc/2GiQb73CeJESjc4omFv2YtQHZrRgJf25NXPzAr5J6UNHRcDV2F/rpc'],
    },
    [RPCType.Default]: {
      http: ['https://api.lux.network/mainnet/ext/bc/2GiQb73CeJESjc4omFv2YtQHZrRgJf25NXPzAr5J6UNHRcDV2F/rpc'],
    },
    [RPCType.Fallback]: {
      http: ['https://api.lux.network/mainnet/ext/bc/2GiQb73CeJESjc4omFv2YtQHZrRgJf25NXPzAr5J6UNHRcDV2F/rpc'],
    },
    [RPCType.Interface]: {
      http: ['https://api.lux.network/mainnet/ext/bc/2GiQb73CeJESjc4omFv2YtQHZrRgJf25NXPzAr5J6UNHRcDV2F/rpc'],
    },
  },
  urlParam: 'hanzo',
  statusPage: undefined,
  tokens,
  supportsV4: false,
  supportsNFTs: false,
  wrappedNativeCurrency: {
    name: 'Wrapped HANZO',
    symbol: 'WHANZO',
    decimals: 18,
    address: '0x3C18bB6B17eb3F0879d4653e0120a531aF4d86E3', // WLUX-equivalent on Hanzo
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
