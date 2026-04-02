import { GqlResult } from '@luxexchange/api'
import { useCallback, useMemo } from 'react'
import { TokenOption } from 'lx/src/components/lists/items/types'
import { filter } from 'lx/src/components/TokenSelector/filter'
import { useAllCommonBaseCurrencies } from 'lx/src/components/TokenSelector/hooks/useAllCommonBaseCurrencies'
import { useCurrencyInfosToTokenOptions } from 'lx/src/components/TokenSelector/hooks/useCurrencyInfosToTokenOptions'
import { usePortfolioBalancesForAddressById } from 'lx/src/components/TokenSelector/hooks/usePortfolioBalancesForAddressById'
import { USDT0_XLAYER } from 'lx/src/constants/tokens'
import type { AddressGroup } from 'lx/src/features/accounts/store/types/AccountsState'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { useCurrencyInfosWithLoading } from 'lx/src/features/tokens/useCurrencyInfo'
import { areAddressesEqual } from 'lx/src/utils/addresses'
import { buildCurrencyId } from 'lx/src/utils/currencyId'

// X Layer quick-select tokens
const XLAYER_CURRENCY_IDS = [
  buildCurrencyId(UniverseChainId.XLayer, USDT0_XLAYER.address),
  buildCurrencyId(UniverseChainId.XLayer, '0x4ae46a509F6b1D9056937BA4500cb143933D2dc8'), // USDG
  buildCurrencyId(UniverseChainId.XLayer, '0xb7C00000bcDEeF966b20B3D884B98E64d2b06b4f'), // xBTC
  buildCurrencyId(UniverseChainId.XLayer, '0xE7B000003A45145decf8a28FC755aD5eC5EA025A'), // xETH
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

  // this is a one-off filter for USDT on Unichain which at time of launch does not have enough liquidity for swapping so we are filtering it out of quick select
  // TODO(WEB-6284): Replace useAllCommonBaseCurrencies static filter with a dynamic filter
  const USDT_UNICHAIN_ADDRESS = '0x588ce4f028d8e7b53b687865d6a67b3a54c75518'
  const filteredCommonBaseCurrencies = useMemo(() => {
    const filtered = commonBaseCurrencies?.filter((currency) => {
      // Use our custom X Layer tokens list instead of the commonBaseCurrencies list
      const isXLayerToken = currency.currency.chainId === UniverseChainId.XLayer

      const isUSDTUnichain =
        currency.currency.chainId === UniverseChainId.Unichain &&
        !currency.currency.isNative &&
        areAddressesEqual({
          addressInput1: { address: USDT_UNICHAIN_ADDRESS, chainId: UniverseChainId.Unichain },
          addressInput2: { address: currency.currency.address, chainId: currency.currency.chainId },
        })

      return !isXLayerToken && !isUSDTUnichain
    })

    return chainFilter === UniverseChainId.XLayer ? xLayerCurrencies : filtered
  }, [chainFilter, commonBaseCurrencies, xLayerCurrencies])

  const commonBaseTokenOptions = useCurrencyInfosToTokenOptions({
    currencyInfos: filteredCommonBaseCurrencies,
    portfolioBalancesById,
  })

  const refetch = useCallback(() => {
    portfolioBalancesByIdRefetch?.()
    refetchCommonBaseCurrencies?.()
    refetchXLayerCurrencies?.()
  }, [portfolioBalancesByIdRefetch, refetchCommonBaseCurrencies, refetchXLayerCurrencies])

  const error =
    (!portfolioBalancesById && portfolioBalancesByIdError) ||
    (!commonBaseCurrencies && commonBaseCurrenciesError) ||
    (!xLayerCurrencies?.length && xLayerCurrenciesError)

  const filteredCommonBaseTokenOptions = useMemo(
    () => commonBaseTokenOptions && filter({ tokenOptions: commonBaseTokenOptions, chainFilter }),
    [chainFilter, commonBaseTokenOptions],
  )

  return useMemo(
    () => ({
      data: filteredCommonBaseTokenOptions,
      refetch,
      error: error || undefined,
      loading: loadingPorfolioBalancesById || loadingCommonBaseCurrencies || loadingXLayerCurrencies,
    }),
    [
      error,
      loadingCommonBaseCurrencies,
      loadingXLayerCurrencies,
      loadingPorfolioBalancesById,
      filteredCommonBaseTokenOptions,
      refetch,
    ],
  )
}
