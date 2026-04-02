import { Token } from '@luxamm/sdk-core'
import { GraphQLApi } from '@luxexchange/api'
import { HANZO_LOGO } from 'ui/src/assets'
import { DEFAULT_NATIVE_ADDRESS_LEGACY } from 'uniswap/src/features/chains/evm/rpc'
import { buildChainTokens } from 'uniswap/src/features/chains/evm/tokens'
import { GENERIC_L2_GAS_CONFIG } from 'uniswap/src/features/chains/gasDefaults'
import { GqlChainId, NetworkLayer, RPCType, UniverseChainId, UniverseChainInfo } from 'uniswap/src/features/chains/types'
import { Platform } from 'uniswap/src/features/platforms/types/Platform'
import { ElementName } from 'uniswap/src/features/telemetry/constants'
import { ONE_SECOND_MS } from 'utilities/src/time/time'

const LUSDC_ADDRESS = '0xb2ee1CE7b84853b83AA08702aD0aD4D79711882D'

const hanzoTokens = buildChainTokens({
  stables: {
    LUSDC: new Token(UniverseChainId.Hanzo, LUSDC_ADDRESS, 6, 'LUSDC', 'Lux USD Coin'),
  },
})

export const HANZO_CHAIN_INFO = {
  id: UniverseChainId.Hanzo,
  platform: Platform.EVM,
  testnet: false,
  assetRepoNetworkName: undefined,
  backendChain: {
    chain: GraphQLApi.Chain.Ethereum as GqlChainId,
    backendSupported: false,
    nativeTokenBackendAddress: undefined,
  },
  bridge: undefined,
  docs: 'https://docs.hanzo.ai',
  label: 'Hanzo',
  logo: HANZO_LOGO,
  name: 'Hanzo',
  nativeCurrency: {
    name: 'AI',
    symbol: 'AI',
    decimals: 18,
    address: DEFAULT_NATIVE_ADDRESS_LEGACY,
    logo: HANZO_LOGO,
  },
  networkLayer: NetworkLayer.L2,
  blockTimeMs: 2000,
  pendingTransactionsRetryOptions: undefined,
  statusPage: undefined,
  supportsV4: false,
  supportsNFTs: false,
  urlParam: 'hanzo',
  rpcUrls: {
    [RPCType.Default]: { http: ['https://api.lux.network/mainnet/ext/bc/hanzo/rpc'] },
    [RPCType.Interface]: { http: ['https://api.lux.network/mainnet/ext/bc/hanzo/rpc'] },
  },
  wrappedNativeCurrency: {
    name: 'Wrapped AI',
    symbol: 'WAI',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000',
  },
  blockPerMainnetEpochForChainId: 1,
  blockWaitMsBeforeWarning: undefined,
  elementName: ElementName.ChainHanzo,
  explorer: {
    name: 'Hanzo Explorer',
    url: 'https://explore-hanzo.lux.network/',
  },
  interfaceName: 'hanzo',
  tokens: hanzoTokens,
  tradingApiPollingIntervalMs: ONE_SECOND_MS,
  gasConfig: GENERIC_L2_GAS_CONFIG,
} as const satisfies UniverseChainInfo
