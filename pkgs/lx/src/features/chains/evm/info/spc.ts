import { Token } from '@luxamm/sdk-core'
import { GraphQLApi } from '@luxexchange/api'
import { SPC_LOGO } from 'ui/src/assets'
import { DEFAULT_NATIVE_ADDRESS_LEGACY } from 'uniswap/src/features/chains/evm/rpc'
import { buildChainTokens } from 'uniswap/src/features/chains/evm/tokens'
import { GENERIC_L2_GAS_CONFIG } from 'uniswap/src/features/chains/gasDefaults'
import { GqlChainId, NetworkLayer, RPCType, UniverseChainId, UniverseChainInfo } from 'uniswap/src/features/chains/types'
import { Platform } from 'uniswap/src/features/platforms/types/Platform'
import { ElementName } from 'uniswap/src/features/telemetry/constants'
import { ONE_SECOND_MS } from 'utilities/src/time/time'

const LUSDC_ADDRESS = '0xb2ee1CE7b84853b83AA08702aD0aD4D79711882D'

const spcTokens = buildChainTokens({
  stables: {
    LUSDC: new Token(UniverseChainId.SPC, LUSDC_ADDRESS, 6, 'LUSDC', 'Lux USD Coin'),
  },
})

export const SPC_CHAIN_INFO = {
  id: UniverseChainId.SPC,
  platform: Platform.EVM,
  testnet: false,
  assetRepoNetworkName: undefined,
  backendChain: {
    chain: GraphQLApi.Chain.Ethereum as GqlChainId,
    backendSupported: false,
    nativeTokenBackendAddress: undefined,
  },
  bridge: undefined,
  docs: 'https://docs.lux.network',
  label: 'SPC',
  logo: SPC_LOGO,
  name: 'SPC',
  nativeCurrency: {
    name: 'SPC',
    symbol: 'SPC',
    decimals: 18,
    address: DEFAULT_NATIVE_ADDRESS_LEGACY,
    logo: SPC_LOGO,
  },
  networkLayer: NetworkLayer.L2,
  blockTimeMs: 2000,
  pendingTransactionsRetryOptions: undefined,
  statusPage: undefined,
  supportsV4: false,
  supportsNFTs: false,
  urlParam: 'spc',
  rpcUrls: {
    [RPCType.Default]: { http: ['https://api.lux.network/mainnet/ext/bc/spc/rpc'] },
    [RPCType.Interface]: { http: ['https://api.lux.network/mainnet/ext/bc/spc/rpc'] },
  },
  wrappedNativeCurrency: {
    name: 'Wrapped SPC',
    symbol: 'WSPC',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000',
  },
  blockPerMainnetEpochForChainId: 1,
  blockWaitMsBeforeWarning: undefined,
  elementName: ElementName.ChainSPC,
  explorer: {
    name: 'SPC Explorer',
    url: 'https://explore-spc.lux.network/',
  },
  interfaceName: 'spc',
  tokens: spcTokens,
  tradingApiPollingIntervalMs: ONE_SECOND_MS,
  gasConfig: GENERIC_L2_GAS_CONFIG,
} as const satisfies UniverseChainInfo
