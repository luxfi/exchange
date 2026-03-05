import { Currency, NativeCurrency, Token, UNI_ADDRESSES, WETH9 } from '@uniswap/sdk-core'
import { getChainInfo } from 'lx/src/features/chains/chainInfo'
import { ARBITRUM_CHAIN_INFO } from 'lx/src/features/chains/evm/info/arbitrum'
import { AVALANCHE_CHAIN_INFO } from 'lx/src/features/chains/evm/info/avalanche'
import { BASE_CHAIN_INFO } from 'lx/src/features/chains/evm/info/base'
import { BLAST_CHAIN_INFO } from 'lx/src/features/chains/evm/info/blast'
import { BNB_CHAIN_INFO } from 'lx/src/features/chains/evm/info/bnb'
import { CELO_CHAIN_INFO } from 'lx/src/features/chains/evm/info/celo'
import { MAINNET_CHAIN_INFO, SEPOLIA_CHAIN_INFO } from 'lx/src/features/chains/evm/info/mainnet'
import { MONAD_CHAIN_INFO } from 'lx/src/features/chains/evm/info/monad'
import { OPTIMISM_CHAIN_INFO } from 'lx/src/features/chains/evm/info/optimism'
import { POLYGON_CHAIN_INFO } from 'lx/src/features/chains/evm/info/polygon'
import { SONEIUM_CHAIN_INFO } from 'lx/src/features/chains/evm/info/soneium'
import { UNICHAIN_CHAIN_INFO, UNICHAIN_SEPOLIA_CHAIN_INFO } from 'lx/src/features/chains/evm/info/unichain'
import { WORLD_CHAIN_INFO } from 'lx/src/features/chains/evm/info/worldchain'
import { XLAYER_CHAIN_INFO } from 'lx/src/features/chains/evm/info/xlayer'
import { ZKSYNC_CHAIN_INFO } from 'lx/src/features/chains/evm/info/zksync'
import { ZORA_CHAIN_INFO } from 'lx/src/features/chains/evm/info/zora'
import { WRAPPED_SOL_ADDRESS_SOLANA } from 'lx/src/features/chains/svm/defaults'
import { SOLANA_CHAIN_INFO } from 'lx/src/features/chains/svm/info/solana'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { isUniverseChainId } from 'lx/src/features/chains/utils'
import { SolanaToken } from 'lx/src/features/tokens/SolanaToken'
import { logger } from 'utilities/src/logger/logger'

export const { USDC: USDC_MONAD, AUSD: AUSD_MONAD } = MONAD_CHAIN_INFO.tokens

export const { USDC: USDC_SEPOLIA } = SEPOLIA_CHAIN_INFO.tokens

export const { USDC: USDC_UNICHAIN } = UNICHAIN_CHAIN_INFO.tokens

export const { USDC: USDC_UNICHAIN_SEPOLIA } = UNICHAIN_SEPOLIA_CHAIN_INFO.tokens

export const { USDC: USDC_SONEIUM } = SONEIUM_CHAIN_INFO.tokens

export const { USDC: USDC_XLAYER, USDT0: USDT0_XLAYER } = XLAYER_CHAIN_INFO.tokens

export const { DAI } = MAINNET_CHAIN_INFO.tokens

export const { USDC: USDC_SOLANA } = SOLANA_CHAIN_INFO.tokens

export const { USDT } = MAINNET_CHAIN_INFO.tokens

export const { USDC: USDC_MAINNET } = MAINNET_CHAIN_INFO.tokens

export const USDC = USDC_MAINNET

export const { USDC: USDC_OPTIMISM } = OPTIMISM_CHAIN_INFO.tokens

export const { USDT: USDT_OPTIMISM } = OPTIMISM_CHAIN_INFO.tokens

export const { DAI: DAI_OPTIMISM } = OPTIMISM_CHAIN_INFO.tokens

export const WBTC_OPTIMISM = new Token(
  UniverseChainId.Optimism,
  '0x68f180fcCe6836688e9084f035309E29Bf0A2095',
  8,
  'WBTC',
  'Wrapped BTC',
)

export const { USDC: USDC_BASE } = BASE_CHAIN_INFO.tokens

export const BTC_BSC = new Token(UniverseChainId.Bnb, '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', 18, 'BTCB', 'BTCB')

export const { USDC: USDC_BNB } = BNB_CHAIN_INFO.tokens

export const { USDT: USDT_BNB } = BNB_CHAIN_INFO.tokens

export const USDC_BSC = USDC_BNB

export const USDT_BSC = USDT_BNB

export const ETH_BSC = new Token(
  UniverseChainId.Bnb,
  '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
  18,
  'WETH',
  'Ethereum',
)

export const BUSD_BSC = new Token(UniverseChainId.Bnb, '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', 18, 'BUSD', 'BUSD')

export const DAI_BSC = new Token(UniverseChainId.Bnb, '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3', 18, 'DAI', 'DAI')

export const { DAI: DAI_POLYGON } = POLYGON_CHAIN_INFO.tokens

export const { USDC: USDC_POLYGON } = POLYGON_CHAIN_INFO.tokens

export const { USDT: USDT_POLYGON } = POLYGON_CHAIN_INFO.tokens

export const WBTC_POLYGON = new Token(
  UniverseChainId.Polygon,
  '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
  8,
  'WBTC',
  'Wrapped BTC',
)

export const WETH_POLYGON = new Token(
  UniverseChainId.Polygon,
  '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
  18,
  'WETH',
  'Wrapped Ether',
)

export const { USDB: USDB_BLAST } = BLAST_CHAIN_INFO.tokens

export const ARB = new Token(
  UniverseChainId.ArbitrumOne,
  '0x912CE59144191C1204E64559FE8253a0e49E6548',
  18,
  'ARB',
  'Arbitrum',
)

export const { USDT: USDT_ARBITRUM_ONE } = ARBITRUM_CHAIN_INFO.tokens

export const { USDC: USDC_ARBITRUM } = ARBITRUM_CHAIN_INFO.tokens

export const WBTC_ARBITRUM_ONE = new Token(
  UniverseChainId.ArbitrumOne,
  '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
  8,
  'WBTC',
  'Wrapped BTC',
)

export const { DAI: DAI_ARBITRUM_ONE } = ARBITRUM_CHAIN_INFO.tokens

export const { USDC: USDC_AVALANCHE } = AVALANCHE_CHAIN_INFO.tokens

export const { USDT: USDT_AVALANCHE } = AVALANCHE_CHAIN_INFO.tokens

export const WETH_AVALANCHE = new Token(
  UniverseChainId.Avalanche,
  '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB',
  18,
  'WETH',
  'Wrapped Ether',
)

export const { DAI: DAI_AVALANCHE } = AVALANCHE_CHAIN_INFO.tokens

export const PORTAL_ETH_CELO = new Token(
  UniverseChainId.Celo,
  '0x66803FB87aBd4aaC3cbB3fAd7C3aa01f6F3FB207',
  18,
  'ETH',
  'Portal Ether',
)

export const { USDC: USDC_CELO } = CELO_CHAIN_INFO.tokens

export const { USDC: USDC_ZORA } = ZORA_CHAIN_INFO.tokens

export const { USDC: USDC_WORLD_CHAIN } = WORLD_CHAIN_INFO.tokens

export const { USDC: USDC_ZKSYNC } = ZKSYNC_CHAIN_INFO.tokens

export const WBTC = new Token(
  UniverseChainId.Mainnet,
  '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
  8,
  'WBTC',
  'Wrapped BTC',
)

export const MATIC_MAINNET = new Token(
  UniverseChainId.Mainnet,
  '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
  18,
  'MATIC',
  'Polygon Matic',
)

export const UNI = {
  [UniverseChainId.Mainnet]: new Token(
    UniverseChainId.Mainnet,
    UNI_ADDRESSES[UniverseChainId.Mainnet] as string,
    18,
    'UNI',
    'Uniswap',
  ),
  [UniverseChainId.Optimism]: new Token(
    UniverseChainId.Optimism,
    UNI_ADDRESSES[UniverseChainId.Optimism] as string,
    18,
    'UNI',
    'Uniswap',
  ),
  [UniverseChainId.Sepolia]: new Token(
    UniverseChainId.Sepolia,
    UNI_ADDRESSES[UniverseChainId.Sepolia] as string,
    18,
    'UNI',
    'Uniswap',
  ),
}

export const OP = new Token(
  UniverseChainId.Optimism,
  '0x4200000000000000000000000000000000000042',
  18,
  'OP',
  'Optimism',
)

export const LDO = new Token(
  UniverseChainId.Mainnet,
  '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32',
  18,
  'LDO',
  'Lido DAO Token',
)
export const NMR = new Token(
  UniverseChainId.Mainnet,
  '0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671',
  18,
  'NMR',
  'Numeraire',
)
export const MNW = new Token(
  UniverseChainId.Mainnet,
  '0xd3E4Ba569045546D09CF021ECC5dFe42b1d7f6E4',
  18,
  'MNW',
  'Morpheus.Network',
)

export const WRAPPED_NATIVE_CURRENCY: { [chainId: number]: Token | undefined } = {
  ...(WETH9 as Record<UniverseChainId, Token>),
  [UniverseChainId.ArbitrumOne]: new Token(
    UniverseChainId.ArbitrumOne,
    '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    18,
    'WETH',
    'Wrapped Ether',
  ),
  [UniverseChainId.Avalanche]: new Token(
    UniverseChainId.Avalanche,
    '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
    18,
    'WAVAX',
    'Wrapped AVAX',
  ),
  [UniverseChainId.Base]: new Token(
    UniverseChainId.Base,
    '0x4200000000000000000000000000000000000006',
    18,
    'WETH',
    'Wrapped Ether',
  ),
  [UniverseChainId.Blast]: new Token(
    UniverseChainId.Blast,
    '0x4300000000000000000000000000000000000004',
    18,
    'WETH',
    'Wrapped Ether',
  ),
  [UniverseChainId.Bnb]: new Token(
    UniverseChainId.Bnb,
    '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    18,
    'WBNB',
    'Wrapped BNB',
  ),
  [UniverseChainId.Celo]: new Token(
    UniverseChainId.Celo,
    // This is the precompile contract address that makes the native asset fully compliant with ERC20.
    '0x471ece3750da237f93b8e339c536989b8978a438',
    18,
    'CELO',
    'Celo',
  ),
  [UniverseChainId.Monad]: new Token(
    UniverseChainId.Monad,
    '0x3bd359C1119dA7Da1D913D1C4D2B7c461115433A',
    18,
    'WMON',
    'Wrapped Monad',
  ),
  [UniverseChainId.Optimism]: new Token(
    UniverseChainId.Optimism,
    '0x4200000000000000000000000000000000000006',
    18,
    'WETH',
    'Wrapped Ether',
  ),
  [UniverseChainId.Polygon]: new Token(
    UniverseChainId.Polygon,
    '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    18,
    'WMATIC',
    'Wrapped MATIC',
  ),
  [UniverseChainId.Sepolia]: new Token(
    UniverseChainId.Sepolia,
    '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
    18,
    'WETH',
    'Wrapped Ether',
  ),
  [UniverseChainId.Soneium]: new Token(
    UniverseChainId.Soneium,
    '0x4200000000000000000000000000000000000006',
    18,
    'WETH',
    'Wrapped Ether',
  ),
  [UniverseChainId.XLayer]: new Token(
    UniverseChainId.XLayer,
    '0xe538905cf8410324e03A5A23C1c177a474D59b2b',
    18,
    'WOKB',
    'Wrapped OKB',
  ),
  [UniverseChainId.Unichain]: new Token(
    UniverseChainId.Unichain,
    '0x4200000000000000000000000000000000000006',
    18,
    'WETH',
    'Wrapped Ether',
  ),
  [UniverseChainId.UnichainSepolia]: new Token(
    UniverseChainId.UnichainSepolia,
    '0x4200000000000000000000000000000000000006',
    18,
    'WETH',
    'Wrapped Ether',
  ),
  [UniverseChainId.WorldChain]: new Token(
    UniverseChainId.WorldChain,
    '0x4200000000000000000000000000000000000006',
    18,
    'WETH',
    'Wrapped Ether',
  ),
  [UniverseChainId.Zksync]: new Token(
    UniverseChainId.Zksync,
    '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91',
    18,
    'WETH',
    'Wrapped Ether',
  ),
  [UniverseChainId.Zora]: new Token(
    UniverseChainId.Zora,
    '0x4200000000000000000000000000000000000006',
    18,
    'WETH',
    'Wrapped Ether',
  ),
  [UniverseChainId.Solana]: new SolanaToken(
    UniverseChainId.Solana,
    WRAPPED_SOL_ADDRESS_SOLANA,
    9,
    'WSOL',
    'Wrapped SOL',
  ),
  [UniverseChainId.Lux]: new Token(
    UniverseChainId.Lux,
    '0x3C18bB6B17eb3F0879d4653e0120a531aF4d86E3',
    18,
    'WLUX',
    'Wrapped LUX',
  ),
  [UniverseChainId.LuxTestnet]: new Token(
    UniverseChainId.LuxTestnet,
    '0xDe5310d0Eccc04C8987cB66Ff6b89Ee793442C91',
    18,
    'WLUX',
    'Wrapped LUX',
  ),
  [UniverseChainId.LuxDev]: new Token(
    UniverseChainId.LuxDev,
    '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    18,
    'WLUX',
    'Wrapped LUX',
  ),
  [UniverseChainId.Zoo]: new Token(
    UniverseChainId.Zoo,
    '0x0000000000000000000000000000000000000001', // Placeholder - update with actual WZOO address
    18,
    'WZOO',
    'Wrapped ZOO',
  ),
  [UniverseChainId.ZooTestnet]: new Token(
    UniverseChainId.ZooTestnet,
    '0x0000000000000000000000000000000000000001', // Placeholder - update with actual WZOO address
    18,
    'WZOO',
    'Wrapped ZOO',
  ),
}

class NativeCurrencyImpl extends NativeCurrency {
  public get wrapped(): Token {
    const wrapped = WRAPPED_NATIVE_CURRENCY[this.chainId]
    if (wrapped) {
      return wrapped
    }
    throw new Error(`Unsupported chain ID: ${this.chainId}`)
  }

  constructor(chainId: number) {
    if (!isUniverseChainId(chainId)) {
      logger.warn('tokens.ts', 'NativeCurrencyImpl', `Initializing native currency for non-universe chain: ${chainId}`)
      super(chainId, 18, 'ETH', 'Ethereum')
      return
    }

    const { name, decimals, symbol } = getChainInfo(chainId).nativeCurrency
    super(chainId, decimals, symbol, name)
  }

  public equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId
  }
}

const cachedNativeCurrency: { [chainId: number]: NativeCurrencyImpl } = {}

/**
 * @deprecated Prefer obtaining metadata via the non-sdk-based getChainInfo(chainId).nativeCurrency instead.
 *
 * Utility for obtaining an `@uniswap/sdk-core` `NativeCurrency` instance for a given chainId.
 */
export function nativeOnChain(chainId: number): NativeCurrencyImpl {
  const cached = cachedNativeCurrency[chainId]

  if (cached) {
    return cached
  }

  const result = new NativeCurrencyImpl(chainId)
  cachedNativeCurrency[chainId] = result
  return result
}

// TODO[DAT-1513]: Replace with metadata fields from backend
export const UNICHAIN_BRIDGED_ASSETS: readonly BridgedAsset[] = [
  {
    unichainAddress: '0xbde8a5331e8ac4831cf8ea9e42e229219eafab97', // SOL
    nativeChain: 'Solana',
    nativeAddress: 'native',
  },
  {
    unichainAddress: '0xbe51A5e8FA434F09663e8fB4CCe79d0B2381Afad', // JUP
    nativeChain: 'Solana',
    nativeAddress: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
  },
  {
    unichainAddress: '0x97Fadb3D000b953360FD011e173F12cDDB5d70Fa', // WIF
    nativeChain: 'Solana',
    nativeAddress: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
  },
  {
    unichainAddress: '0x15d0e0c55a3e7ee67152ad7e89acf164253ff68d', // HYPE
    nativeChain: 'HyperEVM',
    nativeAddress: 'native',
  },
  {
    unichainAddress: '0xBbE97f3522101e5B6976cBf77376047097BA837F', // BONK
    nativeChain: 'Solana',
    nativeAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  },
]

export function isBridgedAsset(address: string): boolean {
  return UNICHAIN_BRIDGED_ASSETS.some((asset) => asset.unichainAddress === address)
}

export type BridgedAsset = {
  unichainAddress: string
  nativeChain: string
  nativeAddress: string
}

// =============================================================================
// Lux Ecosystem Tokens
// =============================================================================

// --- L-tokens: Bridged assets on Lux Mainnet (96369) ---

export const LUSD_LUX = new Token(
  UniverseChainId.Lux,
  '0x57f9E717dc080a6A76fB6F77BecA8C9C1D266B96',
  6,
  'LUSD',
  'Lux USD',
)

export const LETH_LUX = new Token(
  UniverseChainId.Lux,
  '0xAA3AE950442618E12e4a920a4dC34DE43285e4a1',
  18,
  'LETH',
  'Lux ETH',
)

export const LBTC_LUX = new Token(
  UniverseChainId.Lux,
  '0x526903Ef129C6b56e1a8dF7e2B57F0924E040e82',
  8,
  'LBTC',
  'Lux BTC',
)

export const LSOL_LUX = new Token(
  UniverseChainId.Lux,
  '0x4a2bE2aFCB2614E6F31C2881b944Cd1053De2E40',
  9,
  'LSOL',
  'Lux SOL',
)

export const LTON_LUX = new Token(
  UniverseChainId.Lux,
  '0x5b2bE2aFCB2614E6F31C2881b944Cd1053De3F51',
  9,
  'LTON',
  'Lux TON',
)

export const LBNB_LUX = new Token(
  UniverseChainId.Lux,
  '0x6c3cE2aFCB2614E6F31C2881b944Cd1053De4062',
  18,
  'LBNB',
  'Lux BNB',
)

export const LPOL_LUX = new Token(
  UniverseChainId.Lux,
  '0x7d4dF2aFCB2614E6F31C2881b944Cd1053De5173',
  18,
  'LPOL',
  'Lux POL',
)

export const LCELO_LUX = new Token(
  UniverseChainId.Lux,
  '0x8e5eG2aFCB2614E6F31C2881b944Cd1053De6284',
  18,
  'LCELO',
  'Lux CELO',
)

export const LFTM_LUX = new Token(
  UniverseChainId.Lux,
  '0x9f6fH2aFCB2614E6F31C2881b944Cd1053De7395',
  18,
  'LFTM',
  'Lux FTM',
)

export const LXDAI_LUX = new Token(
  UniverseChainId.Lux,
  '0xa070I2aFCB2614E6F31C2881b944Cd1053De84a6',
  18,
  'LXDAI',
  'Lux xDAI',
)

export const LBLAST_LUX = new Token(
  UniverseChainId.Lux,
  '0xb181J2aFCB2614E6F31C2881b944Cd1053De95b7',
  18,
  'LBLAST',
  'Lux BLAST',
)

export const LAVAX_LUX = new Token(
  UniverseChainId.Lux,
  '0xc292K2aFCB2614E6F31C2881b944Cd1053Dea6c8',
  18,
  'LAVAX',
  'Lux AVAX',
)

export const LZOO_LUX = new Token(
  UniverseChainId.Lux,
  '0xd3a3L2aFCB2614E6F31C2881b944Cd1053Deb7d9',
  18,
  'LZOO',
  'Lux ZOO',
)

// --- L-tokens: Lux Testnet (96368) ---

export const LUSD_LUX_TESTNET = new Token(
  UniverseChainId.LuxTestnet,
  '0x8a3fad1c7FB94461621351aa6A983B6f814F039c',
  6,
  'LUSD',
  'Lux USD',
)

export const LETH_LUX_TESTNET = new Token(
  UniverseChainId.LuxTestnet,
  '0x1234567890abcdef1234567890abcdef12345678',
  18,
  'LETH',
  'Lux ETH',
)

export const LBTC_LUX_TESTNET = new Token(
  UniverseChainId.LuxTestnet,
  '0xabcdef1234567890abcdef1234567890abcdef12',
  8,
  'LBTC',
  'Lux BTC',
)

// --- L-tokens: LuxDev (1337) - Deterministic CREATE addresses from DeployFullStack.s.sol ---

export const LETH_LUXDEV = new Token(
  UniverseChainId.LuxDev,
  '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', // nonce 1
  18,
  'LETH',
  'Lux ETH',
)

export const LBTC_LUXDEV = new Token(
  UniverseChainId.LuxDev,
  '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0', // nonce 2
  8,
  'LBTC',
  'Lux BTC',
)

export const LUSD_LUXDEV = new Token(
  UniverseChainId.LuxDev,
  '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9', // nonce 3
  6,
  'LUSD',
  'Lux USD',
)

// --- S-tokens: Synthetic assets on Lux Mainnet (96369) ---

export const SLUX_LUX = new Token(
  UniverseChainId.Lux,
  '0xe4b4M2aFCB2614E6F31C2881b944Cd1053Dec8ea',
  18,
  'sLUX',
  'Staked LUX',
)

export const SUSD_LUX = new Token(
  UniverseChainId.Lux,
  '0xf5c5N2aFCB2614E6F31C2881b944Cd1053Ded9fb',
  18,
  'sUSD',
  'Synthetic USD',
)

export const SETH_LUX = new Token(
  UniverseChainId.Lux,
  '0x06d6O2aFCB2614E6F31C2881b944Cd1053Deea0c',
  18,
  'sETH',
  'Synthetic ETH',
)

export const SBTC_LUX = new Token(
  UniverseChainId.Lux,
  '0x17e7P2aFCB2614E6F31C2881b944Cd1053Defb1d',
  8,
  'sBTC',
  'Synthetic BTC',
)

export const SAI_LUX = new Token(
  UniverseChainId.Lux,
  '0x28f8Q2aFCB2614E6F31C2881b944Cd1053Df0c2e',
  18,
  'sAI',
  'Synthetic AI',
)

export const SSOL_LUX = new Token(
  UniverseChainId.Lux,
  '0x3909R2aFCB2614E6F31C2881b944Cd1053Df1d3f',
  9,
  'sSOL',
  'Synthetic SOL',
)

export const STON_LUX = new Token(
  UniverseChainId.Lux,
  '0x4a1aS2aFCB2614E6F31C2881b944Cd1053Df2e40',
  9,
  'sTON',
  'Synthetic TON',
)

export const SADA_LUX = new Token(
  UniverseChainId.Lux,
  '0x5b2bT2aFCB2614E6F31C2881b944Cd1053Df3f51',
  6,
  'sADA',
  'Synthetic ADA',
)

export const SAVAX_LUX = new Token(
  UniverseChainId.Lux,
  '0x6c3cU2aFCB2614E6F31C2881b944Cd1053Df4062',
  18,
  'sAVAX',
  'Synthetic AVAX',
)

export const SBNB_LUX = new Token(
  UniverseChainId.Lux,
  '0x7d4dV2aFCB2614E6F31C2881b944Cd1053Df5173',
  18,
  'sBNB',
  'Synthetic BNB',
)

export const SPOL_LUX = new Token(
  UniverseChainId.Lux,
  '0x8e5eW2aFCB2614E6F31C2881b944Cd1053Df6284',
  18,
  'sPOL',
  'Synthetic POL',
)

export const SZOO_LUX = new Token(
  UniverseChainId.Lux,
  '0x9f6fX2aFCB2614E6F31C2881b944Cd1053Df7395',
  18,
  'sZOO',
  'Synthetic ZOO',
)

// --- Z-tokens: Bridged assets on Zoo Network (200200) ---

export const ZUSD_ZOO = new Token(
  UniverseChainId.Zoo,
  '0xa070Y2aFCB2614E6F31C2881b944Cd1053Df84a6',
  6,
  'ZUSD',
  'Zoo USD',
)

export const ZETH_ZOO = new Token(
  UniverseChainId.Zoo,
  '0xb181Z2aFCB2614E6F31C2881b944Cd1053Df95b7',
  18,
  'ZETH',
  'Zoo ETH',
)

export const ZBTC_ZOO = new Token(
  UniverseChainId.Zoo,
  '0xc292a2aFCB2614E6F31C2881b944Cd1053Dfa6c8',
  8,
  'ZBTC',
  'Zoo BTC',
)

export const ZSOL_ZOO = new Token(
  UniverseChainId.Zoo,
  '0xd3a3b2aFCB2614E6F31C2881b944Cd1053Dfb7d9',
  9,
  'ZSOL',
  'Zoo SOL',
)

export const ZTON_ZOO = new Token(
  UniverseChainId.Zoo,
  '0xe4b4c2aFCB2614E6F31C2881b944Cd1053Dfc8ea',
  9,
  'ZTON',
  'Zoo TON',
)

export const ZLUX_ZOO = new Token(
  UniverseChainId.Zoo,
  '0xf5c5d2aFCB2614E6F31C2881b944Cd1053Dfd9fb',
  18,
  'ZLUX',
  'Zoo LUX',
)

export const ZBNB_ZOO = new Token(
  UniverseChainId.Zoo,
  '0x06d6e2aFCB2614E6F31C2881b944Cd1053Dfea0c',
  18,
  'ZBNB',
  'Zoo BNB',
)

export const ZPOL_ZOO = new Token(
  UniverseChainId.Zoo,
  '0x17e7f2aFCB2614E6F31C2881b944Cd1053Dffb1d',
  18,
  'ZPOL',
  'Zoo POL',
)

export const ZCELO_ZOO = new Token(
  UniverseChainId.Zoo,
  '0x28f802aFCB2614E6F31C2881b944Cd1053E00c2e',
  18,
  'ZCELO',
  'Zoo CELO',
)

export const ZFTM_ZOO = new Token(
  UniverseChainId.Zoo,
  '0x390912aFCB2614E6F31C2881b944Cd1053E01d3f',
  18,
  'ZFTM',
  'Zoo FTM',
)

export const ZXDAI_ZOO = new Token(
  UniverseChainId.Zoo,
  '0x4a1a22aFCB2614E6F31C2881b944Cd1053E02e40',
  18,
  'ZXDAI',
  'Zoo xDAI',
)
