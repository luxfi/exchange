import { GqlResult } from '@universe/api'
import { useCallback, useMemo } from 'react'
import { TokenOption } from 'uniswap/src/components/lists/items/types'
import { filter } from 'uniswap/src/components/TokenSelector/filter'
import { useAllCommonBaseCurrencies } from 'uniswap/src/components/TokenSelector/hooks/useAllCommonBaseCurrencies'
import { useCurrencyInfosToTokenOptions } from 'uniswap/src/components/TokenSelector/hooks/useCurrencyInfosToTokenOptions'
import { usePortfolioBalancesForAddressById } from 'uniswap/src/components/TokenSelector/hooks/usePortfolioBalancesForAddressById'
import { USDC_LINEA, USDT_LINEA, USDT0_XLAYER } from 'uniswap/src/constants/tokens'
import type { AddressGroup } from 'uniswap/src/features/accounts/store/types/AccountsState'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { useCurrencyInfosWithLoading } from 'uniswap/src/features/tokens/useCurrencyInfo'
import { areAddressesEqual } from 'uniswap/src/utils/addresses'
import { buildCurrencyId, buildNativeCurrencyId } from 'uniswap/src/utils/currencyId'

// X Layer quick-select tokens
const XLAYER_CURRENCY_IDS = [
  buildCurrencyId(UniverseChainId.XLayer, USDT0_XLAYER.address),
  buildCurrencyId(UniverseChainId.XLayer, '0x4ae46a509F6b1D9056937BA4500cb143933D2dc8'), // USDG
  buildCurrencyId(UniverseChainId.XLayer, '0xb7C00000bcDEeF966b20B3D884B98E64d2b06b4f'), // xBTC
  buildCurrencyId(UniverseChainId.XLayer, '0xE7B000003A45145decf8a28FC755aD5eC5EA025A'), // xETH
]

// Linea quick-select tokens
const LINEA_CURRENCY_IDS = [
  buildNativeCurrencyId(UniverseChainId.Linea), // ETH
  buildCurrencyId(UniverseChainId.Linea, USDC_LINEA.address), // USDC
  buildCurrencyId(UniverseChainId.Linea, USDT_LINEA.address), // USDT
  buildCurrencyId(UniverseChainId.Linea, '0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f'), // WETH
  buildCurrencyId(UniverseChainId.Linea, '0x3aAB2285ddcDdaD8edf438C1bAB47e1a9D05a9b4'), // WBTC
]

export function useCommonTokensOptions({
  addresses,
  chainFilter,
}: {
  addresses: AddressGroup
  chainFilter: UniverseChainId | null
}): GqlResult<TokenOption[] | undefined> {
  const {
    data: portfolioBalancesById,
    error: portfolioBalancesByIdError,
    refetch: portfolioBalancesByIdRefetch,
    loading: loadingPorfolioBalancesById,
  } = usePortfolioBalancesForAddressById(addresses)

  const {
    data: commonBaseCurrencies,
    error: commonBaseCurrenciesError,
    refetch: refetchCommonBaseCurrencies,
    loading: loadingCommonBaseCurrencies,
  } = useAllCommonBaseCurrencies()

  const {
    data: xLayerCurrencies,
    error: xLayerCurrenciesError,
    refetch: refetchXLayerCurrencies,
    loading: loadingXLayerCurrencies,
  } = useCurrencyInfosWithLoading(XLAYER_CURRENCY_IDS, { skip: chainFilter !== UniverseChainId.XLayer })

  const {
    data: lineaCurrencies,
    error: lineaCurrenciesError,
    refetch: refetchLineaCurrencies,
    loading: loadingLineaCurrencies,
  } = useCurrencyInfosWithLoading(LINEA_CURRENCY_IDS, { skip: chainFilter !== UniverseChainId.Linea })

  // this is a one-off filter for USDT on Unichain which at time of launch does not have enough liquidity for swapping so we are filtering it out of quick select
  // TODO(WEB-6284): Replace useAllCommonBaseCurrencies static filter with a dynamic filter
  const USDT_UNICHAIN_ADDRESS = '0x588ce4f028d8e7b53b687865d6a67b3a54c75518'
  const filteredCommonBaseCurrencies = useMemo(() => {
    const filtered = commonBaseCurrencies?.filter((currency) => {
      // Use our custom X Layer tokens list instead of the commonBaseCurrencies list
      const isXLayerToken = currency.currency.chainId === UniverseChainId.XLayer

      // Use our custom Linea tokens list instead of the commonBaseCurrencies list
      const isLineaToken = currency.currency.chainId === UniverseChainId.Linea

      const isUSDTUnichain =
        currency.currency.chainId === UniverseChainId.Unichain &&
        !currency.currency.isNative &&
        areAddressesEqual({
          addressInput1: { address: USDT_UNICHAIN_ADDRESS, chainId: UniverseChainId.Unichain },
          addressInput2: { address: currency.currency.address, chainId: currency.currency.chainId },
        })

      return !isXLayerToken && !isLineaToken && !isUSDTUnichain
    })

    if (chainFilter === UniverseChainId.XLayer) {
      return xLayerCurrencies
    }
    if (chainFilter === UniverseChainId.Linea) {
      return lineaCurrencies
    }
    return filtered
  }, [chainFilter, commonBaseCurrencies, lineaCurrencies, xLayerCurrencies])

  const commonBaseTokenOptions = useCurrencyInfosToTokenOptions({
    currencyInfos: filteredCommonBaseCurrencies,
    portfolioBalancesById,
  })

  const refetch = useCallback(() => {
    portfolioBalancesByIdRefetch?.()
    refetchCommonBaseCurrencies?.()
    refetchXLayerCurrencies?.()
    refetchLineaCurrencies?.()
  }, [portfolioBalancesByIdRefetch, refetchCommonBaseCurrencies, refetchXLayerCurrencies, refetchLineaCurrencies])

  const error =
    (!portfolioBalancesById && portfolioBalancesByIdError) ||
    (!commonBaseCurrencies && commonBaseCurrenciesError) ||
    (!xLayerCurrencies?.length && xLayerCurrenciesError) ||
    (!lineaCurrencies?.length && lineaCurrenciesError)

  const filteredCommonBaseTokenOptions = useMemo(
    () => commonBaseTokenOptions && filter({ tokenOptions: commonBaseTokenOptions, chainFilter }),
    [chainFilter, commonBaseTokenOptions],
  )

  return useMemo(
    () => ({
      data: filteredCommonBaseTokenOptions,
      refetch,
      error: error || undefined,
      loading:
        loadingPorfolioBalancesById || loadingCommonBaseCurrencies || loadingXLayerCurrencies || loadingLineaCurrencies,
    }),
    [
      error,
      loadingCommonBaseCurrencies,
      loadingLineaCurrencies,
      loadingXLayerCurrencies,
      loadingPorfolioBalancesById,
      filteredCommonBaseTokenOptions,
      refetch,
    ],
  )
}
