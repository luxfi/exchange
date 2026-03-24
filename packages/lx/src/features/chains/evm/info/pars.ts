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
    USDC: buildUSDC('0x57f9E717dc080a6A76fB6F77BecA8C9C1D266B96', UniverseChainId.Pars), // LUSDC on Pars
  },
})

export const PARS_CHAIN_INFO = {
  id: UniverseChainId.Pars,
  name: 'Pars Network',
  platform: Platform.EVM,
  assetRepoNetworkName: 'pars',
  backendChain: {
    chain: GraphQLApi.Chain.Ethereum as GqlChainId,
    backendSupported: false,
    nativeTokenBackendAddress: undefined,
  },
  blockPerMainnetEpochForChainId: 1,
  blockWaitMsBeforeWarning: ONE_MINUTE_MS,
  bridge: undefined,
  docs: 'https://docs.lux.network/',
  elementName: ElementName.ChainPars,
  explorer: {
    name: 'Pars Explorer',
    url: 'https://explore-pars.lux.network/',
  },
  interfaceName: 'pars',
  label: 'Pars',
  logo: LUX_NETWORK_LOGO,
  nativeCurrency: {
    name: 'PARS',
    symbol: 'PARS',
    decimals: 18,
    address: DEFAULT_NATIVE_ADDRESS_LEGACY,
    explorerLink: 'https://explore-pars.lux.network/stats',
    logo: LUX_LOGO,
  },
  networkLayer: NetworkLayer.L2,
  pendingTransactionsRetryOptions: undefined,
  rpcUrls: {
    [RPCType.Public]: {
      http: ['https://api.lux.network/mainnet/ext/bc/2pUskxqaL5Bpx7uRUGG1fDjPckjxQ4UKX4sLKeaS1NdSVBJd3F/rpc'],
    },
    [RPCType.Default]: {
      http: ['https://api.lux.network/mainnet/ext/bc/2pUskxqaL5Bpx7uRUGG1fDjPckjxQ4UKX4sLKeaS1NdSVBJd3F/rpc'],
    },
    [RPCType.Fallback]: {
      http: ['https://api.lux.network/mainnet/ext/bc/2pUskxqaL5Bpx7uRUGG1fDjPckjxQ4UKX4sLKeaS1NdSVBJd3F/rpc'],
    },
    [RPCType.Interface]: {
      http: ['https://api.lux.network/mainnet/ext/bc/2pUskxqaL5Bpx7uRUGG1fDjPckjxQ4UKX4sLKeaS1NdSVBJd3F/rpc'],
    },
  },
  urlParam: 'pars',
  statusPage: undefined,
  tokens,
  supportsV4: false,
  supportsNFTs: false,
  wrappedNativeCurrency: {
    name: 'Wrapped PARS',
    symbol: 'WPARS',
    decimals: 18,
    address: '0x3C18bB6B17eb3F0879d4653e0120a531aF4d86E3', // WLUX-equivalent on Pars
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
