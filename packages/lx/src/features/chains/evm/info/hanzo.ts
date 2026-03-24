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
    USDC: buildUSDC('0x51c3408B9A6a0B2446CCB78c72C846CEB76201FA', UniverseChainId.Hanzo), // LUSDC on Hanzo Mainnet
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
    name: 'AI',
    symbol: 'AI',
    decimals: 18,
    address: DEFAULT_NATIVE_ADDRESS_LEGACY,
    explorerLink: 'https://explore-hanzo.lux.network/stats',
    logo: LUX_LOGO,
  },
  networkLayer: NetworkLayer.L2,
  pendingTransactionsRetryOptions: undefined,
  rpcUrls: {
    [RPCType.Public]: {
      http: ['https://api.lux.network/mainnet/ext/bc/hanzo/rpc'],
    },
    [RPCType.Default]: {
      http: ['https://api.lux.network/mainnet/ext/bc/hanzo/rpc'],
    },
    [RPCType.Fallback]: {
      http: ['https://api.lux.network/mainnet/ext/bc/hanzo/rpc'],
    },
    [RPCType.Interface]: {
      http: ['https://api.lux.network/mainnet/ext/bc/hanzo/rpc'],
    },
  },
  urlParam: 'hanzo',
  statusPage: undefined,
  tokens,
  supportsV4: false,
  supportsNFTs: false,
  wrappedNativeCurrency: {
    name: 'Wrapped AI',
    symbol: 'WAI',
    decimals: 18,
    address: '0xc65ea8882020Af7CDa7854d590C6Fcd34BF364ec', // WAI (Wrapped AI) on Hanzo Mainnet
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
