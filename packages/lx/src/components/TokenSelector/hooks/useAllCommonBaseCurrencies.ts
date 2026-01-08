import { GqlResult } from '@luxfi/api'
import { useMemo } from 'react'
import { useCurrencies } from 'lx/src/components/TokenSelector/hooks/useCurrencies'
import {
  LBTC_LUX,
  LBTC_LUX_TESTNET,
  LBTC_LUXDEV,
  LETH_LUX,
  LETH_LUX_TESTNET,
  LETH_LUXDEV,
  LUSD_LUX,
  LUSD_LUX_TESTNET,
  LUSD_LUXDEV,
  USDC,
  USDT,
  WBTC,
  ZBTC_ZOO,
  ZETH_ZOO,
  ZUSD_ZOO,
} from 'lx/src/constants/tokens'
import { COMMON_BASES } from 'lx/src/constants/routing'
import { useEnabledChains } from 'lx/src/features/chains/hooks/useEnabledChains'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { CurrencyInfo } from 'lx/src/features/dataApi/types'
import { buildNativeCurrencyId, buildWrappedNativeCurrencyId, currencyId } from 'lx/src/utils/currencyId'

// Base currency IDs for traditional EVM chains
const evmBaseCurrencyIds = [
  buildNativeCurrencyId(UniverseChainId.Mainnet),
  buildNativeCurrencyId(UniverseChainId.Polygon),
  buildNativeCurrencyId(UniverseChainId.Bnb),
  buildNativeCurrencyId(UniverseChainId.Celo),
  buildNativeCurrencyId(UniverseChainId.Avalanche),
  buildNativeCurrencyId(UniverseChainId.Solana),
  buildNativeCurrencyId(UniverseChainId.Monad),
  currencyId(USDC),
  currencyId(USDT),
  currencyId(WBTC),
  buildWrappedNativeCurrencyId(UniverseChainId.Mainnet),
]

// Lux ecosystem currency IDs
const luxBaseCurrencyIds = [
  buildNativeCurrencyId(UniverseChainId.Lux),
  buildWrappedNativeCurrencyId(UniverseChainId.Lux),
  currencyId(LUSD_LUX),
  currencyId(LETH_LUX),
  currencyId(LBTC_LUX),
]

// Zoo ecosystem currency IDs
const zooBaseCurrencyIds = [
  buildNativeCurrencyId(UniverseChainId.Zoo),
  buildWrappedNativeCurrencyId(UniverseChainId.Zoo),
  currencyId(ZUSD_ZOO),
  currencyId(ZETH_ZOO),
  currencyId(ZBTC_ZOO),
]

// Lux testnet currency IDs
const luxTestnetBaseCurrencyIds = [
  buildNativeCurrencyId(UniverseChainId.LuxTestnet),
  buildWrappedNativeCurrencyId(UniverseChainId.LuxTestnet),
  currencyId(LUSD_LUX_TESTNET),
  currencyId(LETH_LUX_TESTNET),
  currencyId(LBTC_LUX_TESTNET),
]

// Lux dev currency IDs (for local development)
// These must match tokens in COMMON_BASES and common_bases_lux.json mock
const luxDevBaseCurrencyIds = [
  buildNativeCurrencyId(UniverseChainId.LuxDev),
  buildWrappedNativeCurrencyId(UniverseChainId.LuxDev),
  currencyId(LETH_LUXDEV),
  currencyId(LBTC_LUXDEV),
  currencyId(LUSD_LUXDEV),
]

export function useAllCommonBaseCurrencies(chainFilter?: UniverseChainId | null): GqlResult<CurrencyInfo[]> {
  const { defaultChainId } = useEnabledChains()

  // Use chainFilter if provided, otherwise fall back to defaultChainId
  const effectiveChainId = chainFilter ?? defaultChainId

  // Determine which currency IDs to fetch based on effective chain
  const baseCurrencyIds = useMemo(() => {
    // For Lux ecosystem chains, prioritize Lux tokens
    if (effectiveChainId === UniverseChainId.Lux) {
      return luxBaseCurrencyIds
    }
    if (effectiveChainId === UniverseChainId.Zoo) {
      return zooBaseCurrencyIds
    }
    if (effectiveChainId === UniverseChainId.LuxTestnet) {
      return luxTestnetBaseCurrencyIds
    }
    if (effectiveChainId === UniverseChainId.LuxDev) {
      return luxDevBaseCurrencyIds
    }
    // For other chains, use standard EVM tokens
    return evmBaseCurrencyIds
  }, [effectiveChainId])

  // Use baseCurrencyIds which is already computed based on effectiveChainId
  // (which considers chainFilter from URL, testnet chains, etc.)
  const { data: apiCurrencies, error, refetch, loading } = useCurrencies(baseCurrencyIds)

  // Fallback to COMMON_BASES when API fails or returns empty
  const fallbackCurrencies = useMemo(() => {
    if (effectiveChainId && COMMON_BASES[effectiveChainId]) {
      return COMMON_BASES[effectiveChainId]
    }
    return COMMON_BASES[UniverseChainId.Lux] || []
  }, [effectiveChainId])

  const data = useMemo(() => {
    // If we have API data, use it
    if (apiCurrencies && apiCurrencies.length > 0) {
      return apiCurrencies
    }
    // Otherwise fall back to static COMMON_BASES
    return fallbackCurrencies
  }, [apiCurrencies, fallbackCurrencies])

  return { data, error, refetch, loading }
}
