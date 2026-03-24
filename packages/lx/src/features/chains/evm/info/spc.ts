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
    USDC: buildUSDC('0x0000000000000000000000000000000000000000', UniverseChainId.SPC), // NOT DEPLOYED on SPC mainnet
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
      http: ['https://api.lux.network/mainnet/ext/bc/spc/rpc'],
    },
    [RPCType.Default]: {
      http: ['https://api.lux.network/mainnet/ext/bc/spc/rpc'],
    },
    [RPCType.Fallback]: {
      http: ['https://api.lux.network/mainnet/ext/bc/spc/rpc'],
    },
    [RPCType.Interface]: {
      http: ['https://api.lux.network/mainnet/ext/bc/spc/rpc'],
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
    address: '0x0000000000000000000000000000000000000000', // NOT DEPLOYED on SPC mainnet
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
