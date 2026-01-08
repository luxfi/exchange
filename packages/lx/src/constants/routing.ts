import { Currency, Token, WETH9 } from '@luxamm/sdk-core'
import { GraphQLApi } from '@luxfi/api'
import type { ImageSourcePropType } from 'react-native'
import { CELO_LOGO, ETH_LOGO } from 'ui/src/assets'
import {
  ARB,
  AUSD_MONAD,
  BUSD_BSC,
  DAI,
  DAI_ARBITRUM_ONE,
  DAI_AVALANCHE,
  DAI_BSC,
  DAI_OPTIMISM,
  DAI_POLYGON,
  ETH_BSC,
  LAVAX_LUX,
  LBLAST_LUX,
  LBNB_LUX,
  LBTC_LUX,
  LBTC_LUX_TESTNET,
  LBTC_LUXDEV,
  LCELO_LUX,
  LETH_LUX,
  LETH_LUX_TESTNET,
  LETH_LUXDEV,
  LFTM_LUX,
  LPOL_LUX,
  LSOL_LUX,
  LTON_LUX,
  LUSD_LUX,
  LUSD_LUX_TESTNET,
  LUSD_LUXDEV,
  LXDAI_LUX,
  LZOO_LUX,
  nativeOnChain,
  OP,
  PORTAL_ETH_CELO,
  SADA_LUX,
  SAI_LUX,
  SAVAX_LUX,
  SBNB_LUX,
  SBTC_LUX,
  SETH_LUX,
  SLUX_LUX,
  SPOL_LUX,
  SSOL_LUX,
  STON_LUX,
  SUSD_LUX,
  SZOO_LUX,
  UNI,
  ZBNB_ZOO,
  ZBTC_ZOO,
  ZCELO_ZOO,
  ZETH_ZOO,
  ZFTM_ZOO,
  ZLUX_ZOO,
  ZPOL_ZOO,
  ZSOL_ZOO,
  ZTON_ZOO,
  ZUSD_ZOO,
  ZXDAI_ZOO,
  USDC_ARBITRUM,
  USDC_AVALANCHE,
  USDC_BASE,
  USDC_BSC,
  USDC_CELO,
  USDC_MAINNET,
  USDC_MONAD,
  USDC_OPTIMISM,
  USDC_POLYGON,
  USDC_SEPOLIA,
  USDC_SOLANA,
  USDC_SONEIUM,
  USDC_UNICHAIN,
  USDC_WORLD_CHAIN,
  USDC_ZKSYNC,
  USDC_ZORA,
  USDT,
  USDT_ARBITRUM_ONE,
  USDT_AVALANCHE,
  USDT_BSC,
  USDT_OPTIMISM,
  USDT_POLYGON,
  WBTC,
  WBTC_ARBITRUM_ONE,
  WBTC_OPTIMISM,
  WBTC_POLYGON,
  WETH_AVALANCHE,
  WETH_POLYGON,
  WRAPPED_NATIVE_CURRENCY,
} from 'lx/src/constants/tokens'
import { getChainInfo } from 'lx/src/features/chains/chainInfo'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { CurrencyInfo, TokenList } from 'lx/src/features/dataApi/types'
import { buildCurrencyInfo } from 'lx/src/features/dataApi/utils/buildCurrency'
import { Platform } from 'lx/src/features/platforms/types/Platform'
import { areAddressesEqual } from 'lx/src/utils/addresses'
import { isNativeCurrencyAddress } from 'lx/src/utils/currencyId'

type ChainCurrencyList = {
  readonly [chainId: number]: CurrencyInfo[]
}

/**
 * @deprecated
 * Instead, see the list used in the token selector's quick-select common options section at useAllCommonBaseCurrencies.ts.
 * This list is currently used as fallback list when Token GQL query fails for above list + for hardcoded tokens on testnet chains.
 */
export const COMMON_BASES: ChainCurrencyList = {
  [UniverseChainId.Mainnet]: [
    nativeOnChain(UniverseChainId.Mainnet),
    DAI,
    USDC_MAINNET,
    USDT,
    WBTC,
    WRAPPED_NATIVE_CURRENCY[UniverseChainId.Mainnet] as Token,
  ].map(buildPartialCurrencyInfo),

  [UniverseChainId.ArbitrumOne]: [
    nativeOnChain(UniverseChainId.ArbitrumOne),
    ARB,
    DAI_ARBITRUM_ONE,
    USDC_ARBITRUM,
    USDT_ARBITRUM_ONE,
    WBTC_ARBITRUM_ONE,
    WRAPPED_NATIVE_CURRENCY[UniverseChainId.ArbitrumOne] as Token,
  ].map(buildPartialCurrencyInfo),

  [UniverseChainId.Avalanche]: [
    nativeOnChain(UniverseChainId.Avalanche),
    DAI_AVALANCHE,
    USDC_AVALANCHE,
    USDT_AVALANCHE,
    WETH_AVALANCHE,
  ].map(buildPartialCurrencyInfo),

  [UniverseChainId.Base]: [
    nativeOnChain(UniverseChainId.Base),
    WRAPPED_NATIVE_CURRENCY[UniverseChainId.Base] as Token,
    USDC_BASE,
  ].map(buildPartialCurrencyInfo),

  [UniverseChainId.Blast]: [
    nativeOnChain(UniverseChainId.Blast),
    WRAPPED_NATIVE_CURRENCY[UniverseChainId.Blast] as Token,
  ].map(buildPartialCurrencyInfo),

  [UniverseChainId.Bnb]: [nativeOnChain(UniverseChainId.Bnb), DAI_BSC, USDC_BSC, USDT_BSC, ETH_BSC, BUSD_BSC].map(
    buildPartialCurrencyInfo,
  ),

  [UniverseChainId.Celo]: [nativeOnChain(UniverseChainId.Celo), USDC_CELO].map(buildPartialCurrencyInfo),

  [UniverseChainId.Monad]: [
    nativeOnChain(UniverseChainId.Monad),
    WRAPPED_NATIVE_CURRENCY[UniverseChainId.Monad] as Token,
    USDC_MONAD,
    AUSD_MONAD,
  ].map(buildPartialCurrencyInfo),

  [UniverseChainId.Optimism]: [
    nativeOnChain(UniverseChainId.Optimism),
    OP,
    DAI_OPTIMISM,
    USDC_OPTIMISM,
    USDT_OPTIMISM,
    WBTC_OPTIMISM,
    WETH9[UniverseChainId.Optimism] as Token,
  ].map(buildPartialCurrencyInfo),

  [UniverseChainId.Polygon]: [
    nativeOnChain(UniverseChainId.Polygon),
    WETH_POLYGON,
    USDC_POLYGON,
    DAI_POLYGON,
    USDT_POLYGON,
    WBTC_POLYGON,
  ].map(buildPartialCurrencyInfo),

  [UniverseChainId.Sepolia]: [
    nativeOnChain(UniverseChainId.Sepolia),
    WRAPPED_NATIVE_CURRENCY[UniverseChainId.Sepolia] as Token,
    USDC_SEPOLIA,
    UNI[UniverseChainId.Sepolia],
  ].map(buildPartialCurrencyInfo),

  [UniverseChainId.Soneium]: [
    nativeOnChain(UniverseChainId.Soneium),
    WRAPPED_NATIVE_CURRENCY[UniverseChainId.Soneium] as Token,
    USDC_SONEIUM,
  ].map(buildPartialCurrencyInfo),

  [UniverseChainId.Solana]: [nativeOnChain(UniverseChainId.Solana), USDC_SOLANA].map(buildPartialCurrencyInfo),

  [UniverseChainId.Unichain]: [
    nativeOnChain(UniverseChainId.Unichain),
    WRAPPED_NATIVE_CURRENCY[UniverseChainId.Unichain] as Token,
    USDC_UNICHAIN,
  ].map(buildPartialCurrencyInfo),

  [UniverseChainId.UnichainSepolia]: [
    nativeOnChain(UniverseChainId.UnichainSepolia),
    WRAPPED_NATIVE_CURRENCY[UniverseChainId.UnichainSepolia] as Token,
    // TODO(WEB-5160): re-add usdc sepolia
    // USDC_UNICHAIN_SEPOLIA,
  ].map(buildPartialCurrencyInfo),

  [UniverseChainId.WorldChain]: [
    nativeOnChain(UniverseChainId.WorldChain),
    WRAPPED_NATIVE_CURRENCY[UniverseChainId.WorldChain] as Token,
    USDC_WORLD_CHAIN,
  ].map(buildPartialCurrencyInfo),

  [UniverseChainId.Zksync]: [
    nativeOnChain(UniverseChainId.Zksync),
    WRAPPED_NATIVE_CURRENCY[UniverseChainId.Zksync] as Token,
    USDC_ZKSYNC,
  ].map(buildPartialCurrencyInfo),

  [UniverseChainId.Zora]: [
    nativeOnChain(UniverseChainId.Zora),
    WRAPPED_NATIVE_CURRENCY[UniverseChainId.Zora] as Token,
    USDC_ZORA,
  ].map(buildPartialCurrencyInfo),

  // Lux ecosystem chains
  [UniverseChainId.Lux]: [
    nativeOnChain(UniverseChainId.Lux),
    WRAPPED_NATIVE_CURRENCY[UniverseChainId.Lux] as Token,
    // Core L-tokens (bridged assets)
    LUSD_LUX,
    LETH_LUX,
    LBTC_LUX,
    LSOL_LUX,
    LTON_LUX,
    LBNB_LUX,
    LPOL_LUX,
    LCELO_LUX,
    LFTM_LUX,
    LXDAI_LUX,
    LBLAST_LUX,
    LAVAX_LUX,
    LZOO_LUX,
    // Staked LUX
    SLUX_LUX,
    // Synthetic tokens
    SUSD_LUX,
    SETH_LUX,
    SBTC_LUX,
    SAI_LUX,
    SSOL_LUX,
    STON_LUX,
    SADA_LUX,
    SAVAX_LUX,
    SBNB_LUX,
    SPOL_LUX,
    SZOO_LUX,
  ].map(buildPartialCurrencyInfo),

  [UniverseChainId.Zoo]: [
    nativeOnChain(UniverseChainId.Zoo),
    WRAPPED_NATIVE_CURRENCY[UniverseChainId.Zoo] as Token,
    // Core Z-tokens (bridged assets)
    ZUSD_ZOO,
    ZETH_ZOO,
    ZBTC_ZOO,
    ZSOL_ZOO,
    ZTON_ZOO,
    ZLUX_ZOO,
    ZBNB_ZOO,
    ZPOL_ZOO,
    ZCELO_ZOO,
    ZFTM_ZOO,
    ZXDAI_ZOO,
  ].map(buildPartialCurrencyInfo),

  // Lux Testnet (Chain ID: 96368)
  [UniverseChainId.LuxTestnet]: [
    nativeOnChain(UniverseChainId.LuxTestnet),
    WRAPPED_NATIVE_CURRENCY[UniverseChainId.LuxTestnet] as Token,
    LUSD_LUX_TESTNET,
    LETH_LUX_TESTNET,
    LBTC_LUX_TESTNET,
  ].map(buildPartialCurrencyInfo),

  // Lux Dev (dev mode, Chain ID: 1337) - Deterministic addresses from luxd-manager.ts
  [UniverseChainId.LuxDev]: [
    nativeOnChain(UniverseChainId.LuxDev),
    WRAPPED_NATIVE_CURRENCY[UniverseChainId.LuxDev] as Token,
    LETH_LUXDEV,
    LBTC_LUXDEV,
    LUSD_LUXDEV,
  ].map(buildPartialCurrencyInfo),
}

export function getCommonBase(chainId?: number, address?: string): CurrencyInfo | undefined {
  if (!address || !chainId) {
    return undefined
  }

  const isNative = isNativeCurrencyAddress(chainId, address)
  return COMMON_BASES[chainId]?.find(
    (base) =>
      (base.currency.isNative && isNative) ||
      (base.currency.isToken &&
        areAddressesEqual({
          addressInput1: { address: base.currency.address, chainId: base.currency.chainId },
          addressInput2: { address, chainId },
        })),
  )
}

function getNativeLogoURI(chainId: UniverseChainId = UniverseChainId.Mainnet): ImageSourcePropType {
  if (chainId === UniverseChainId.Mainnet) {
    return ETH_LOGO as ImageSourcePropType
  }

  return getChainInfo(chainId).nativeCurrency.logo
}

function getTokenLogoURI(chainId: UniverseChainId, address: string): ImageSourcePropType | string | undefined {
  const chainInfo = getChainInfo(chainId)
  const networkName = chainInfo.assetRepoNetworkName

  if (
    chainId === UniverseChainId.Celo &&
    areAddressesEqual({
      addressInput1: { address, platform: Platform.EVM },
      addressInput2: { address: nativeOnChain(chainId).wrapped.address, platform: Platform.EVM },
    })
  ) {
    return CELO_LOGO as ImageSourcePropType
  }
  if (
    chainId === UniverseChainId.Celo &&
    areAddressesEqual({
      addressInput1: { address, platform: Platform.EVM },
      addressInput2: { address: PORTAL_ETH_CELO.address, platform: Platform.EVM },
    })
  ) {
    return ETH_LOGO as ImageSourcePropType
  }

  return networkName
    ? `https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/${networkName}/assets/${address}/logo.png`
    : undefined
}

export function buildPartialCurrencyInfo(commonBase: Currency): CurrencyInfo {
  const logoUrl = commonBase.isNative
    ? getNativeLogoURI(commonBase.chainId)
    : getTokenLogoURI(commonBase.chainId, commonBase.address)

  return buildCurrencyInfo({
    currency: commonBase,
    logoUrl,
    safetyInfo: {
      tokenList: TokenList.Default,
      protectionResult: GraphQLApi.ProtectionResult.Benign,
    },
    isSpam: false,
  } as CurrencyInfo)
}
