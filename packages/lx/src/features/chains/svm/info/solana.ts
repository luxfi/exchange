import { GraphQLApi } from '@luxfi/api'
import { SOLANA_LOGO } from 'ui/src/assets'
import { getQuicknodeEndpointUrl } from 'lx/src/features/chains/evm/rpc'
import { buildChainTokens } from 'lx/src/features/chains/evm/tokens'
import { SOLANA_GAS_CONFIG } from 'lx/src/features/chains/gasDefaults'
import { DEFAULT_NATIVE_ADDRESS_SOLANA, WRAPPED_SOL_ADDRESS_SOLANA } from 'lx/src/features/chains/svm/defaults'
import { NetworkLayer, RPCType, UniverseChainId, UniverseChainInfo } from 'lx/src/features/chains/types'
import { Platform } from 'lx/src/features/platforms/types/Platform'
import { ElementName } from 'lx/src/features/telemetry/constants'
import { SolanaToken } from 'lx/src/features/tokens/SolanaToken'

const tokens = buildChainTokens({
  stables: {
    USDC: new SolanaToken(
      UniverseChainId.Solana,
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      6,
      'USDC',
      'USD Coin',
    ),
  },
})

export const SOLANA_CHAIN_INFO = {
  id: UniverseChainId.Solana,
  platform: Platform.SVM,
  assetRepoNetworkName: 'solana',
  blockPerMainnetEpochForChainId: 1,
  urlParam: 'solana',
  name: 'Solana',
  tokens,
  blockWaitMsBeforeWarning: undefined,
  bridge: undefined,
  docs: 'https://docs.solana.com',
  elementName: ElementName.ChainSolana,
  supportsV4: false,
  supportsNFTs: false,
  explorer: {
    name: 'Solana Explorer',
    url: 'https://solscan.io/',
    apiURL: 'https://api.explorer.solana.com',
  },
  interfaceName: 'solana',
  label: 'Solana',
  logo: SOLANA_LOGO,
  nativeCurrency: {
    name: 'Solana',
    symbol: 'SOL',
    decimals: 9,
    address: DEFAULT_NATIVE_ADDRESS_SOLANA,
    explorerLink: 'https://explorer.solana.com',
    logo: SOLANA_LOGO,
  },
  wrappedNativeCurrency: {
    name: 'Wrapped SOL',
    symbol: 'wSOL',
    decimals: 9,
    address: WRAPPED_SOL_ADDRESS_SOLANA,
  },
  gasConfig: SOLANA_GAS_CONFIG,
  networkLayer: NetworkLayer.L1,
  pendingTransactionsRetryOptions: undefined,
  rpcUrls: {
    [RPCType.Default]: {
      http: [getQuicknodeEndpointUrl(UniverseChainId.Solana)],
    },
    [RPCType.Interface]: {
      http: [''], // Not used for Solana; defined for type compatibility with EVM chains
    },
  },
  backendChain: {
    chain: GraphQLApi.Chain.Solana,
    backendSupported: true,
    nativeTokenBackendAddress: undefined,
  },
  testnet: false,
  statusPage: 'https://status.solana.com/',
  tradingApiPollingIntervalMs: 250,
} as const satisfies UniverseChainInfo
