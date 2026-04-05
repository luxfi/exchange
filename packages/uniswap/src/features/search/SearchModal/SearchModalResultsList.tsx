import { ContentStyle } from '@shopify/flash-list'
import { GqlResult } from '@universe/api'
import { FeatureFlags, useFeatureFlag } from '@universe/gating'
import { memo, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { usePoolSearchResultsToPoolOptions } from 'uniswap/src/components/lists/items/pools/usePoolSearchResultsToPoolOptions'
import { SearchModalOption } from 'uniswap/src/components/lists/items/types'
import { NetworkError, NoResultsFound } from 'uniswap/src/components/lists/NoResultsFound'
import { OnchainItemSection, OnchainItemSectionName } from 'uniswap/src/components/lists/OnchainItemList/types'
import { useOnchainItemListSection } from 'uniswap/src/components/lists/utils'
import { useCurrencyInfosToTokenOptions } from 'uniswap/src/components/TokenSelector/hooks/useCurrencyInfosToTokenOptions'
import { useMultichainSearchResultsToOptions } from 'uniswap/src/components/TokenSelector/hooks/useMultichainSearchResultsToOptions'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { useSearchPools } from 'uniswap/src/features/dataApi/searchPools'
import { useMultichainSearchTokens, useSearchTokens } from 'uniswap/src/features/dataApi/searchTokens'
import { Platform } from 'uniswap/src/features/platforms/types/Platform'
import { NUMBER_OF_RESULTS_ALL_TAB } from 'uniswap/src/features/search/SearchModal/constants'
import { useWalletSearchResults } from 'uniswap/src/features/search/SearchModal/hooks/useWalletSearchResults'
import { SearchModalList, SearchModalListProps } from 'uniswap/src/features/search/SearchModal/SearchModalList'
import { SearchTab } from 'uniswap/src/features/search/SearchModal/types'
import { getValidAddress } from 'uniswap/src/utils/addresses'
import { useIsOffline } from 'utilities/src/connection/useIsOffline'
import { isWebPlatform } from 'utilities/src/platform'
import { noop } from 'utilities/src/react/noop'
import { usePreviousWithLayoutEffect } from 'utilities/src/react/usePreviousWithLayoutEffect'

// oxlint-disable-next-line complexity
function useSectionsForSearchResults({
  chainFilter,
  searchFilter,
  activeTab,
  shouldPrioritizePools,
  shouldPrioritizeWallets,
}: {
  chainFilter: UniverseChainId | null
  searchFilter: string | null
  activeTab: SearchTab
  shouldPrioritizePools: boolean
  shouldPrioritizeWallets: boolean
}): GqlResult<OnchainItemSection<SearchModalOption>[]> {
  const skipPoolSearchQuery =
    !isWebPlatform || !searchFilter || (activeTab !== SearchTab.Pools && activeTab !== SearchTab.All)
  const {
    data: searchResultPools,
    error: searchPoolsError,
    refetch: refetchSearchPools,
    loading: searchPoolsLoading,
  } = useSearchPools({
    searchQuery: searchFilter,
    chainFilter,
    skip: skipPoolSearchQuery,
  })
  const poolSearchOptions = usePoolSearchResultsToPoolOptions(searchResultPools ?? [])
  const poolSearchResultsSection = useOnchainItemListSection({
    sectionKey: OnchainItemSectionName.Pools,
    options: activeTab === SearchTab.All ? poolSearchOptions.slice(0, NUMBER_OF_RESULTS_ALL_TAB) : poolSearchOptions,
  })

  const isMultichainTokenUx = useFeatureFlag(FeatureFlags.MultichainTokenUx)
  const useMultichainPath = isMultichainTokenUx && chainFilter === null

  const skipTokenSearch = !searchFilter || (activeTab !== SearchTab.Tokens && activeTab !== SearchTab.All)

  const {
    data: searchResultCurrencies,
    error: flatSearchTokensError,
    refetch: refetchFlatSearchTokens,
    loading: flatSearchTokensLoading,
  } = useSearchTokens({
    searchQuery: searchFilter,
    chainFilter,
    skip: skipTokenSearch || useMultichainPath,
  })

  const {
    data: multichainResults,
    error: multichainTokensError,
    refetch: refetchMultichainTokens,
    loading: multichainTokensLoading,
  } = useMultichainSearchTokens({
    searchQuery: searchFilter,
    chainFilter,
    skip: skipTokenSearch || !useMultichainPath,
  })

  const tokenSearchResults = useCurrencyInfosToTokenOptions({ currencyInfos: searchResultCurrencies })
  const multichainSearchOptions = useMultichainSearchResultsToOptions({ results: multichainResults })

  const searchTokensError = useMultichainPath ? multichainTokensError : flatSearchTokensError
  const searchTokensLoading = useMultichainPath ? multichainTokensLoading : flatSearchTokensLoading
  const refetchSearchTokens = useMultichainPath ? refetchMultichainTokens : refetchFlatSearchTokens

  const isPoolAddressSearch =
    searchFilter &&
    getValidAddress({ address: searchFilter, platform: Platform.EVM }) &&
    searchResultPools?.length === 1
  const tokenOptions: SearchModalOption[] = isPoolAddressSearch
    ? []
    : useMultichainPath
      ? (multichainSearchOptions ?? [])
      : (tokenSearchResults ?? [])
  const tokenSearchResultsSection = useOnchainItemListSection({
    sectionKey: OnchainItemSectionName.Tokens,
    options: activeTab === SearchTab.All ? tokenOptions.slice(0, NUMBER_OF_RESULTS_ALL_TAB) : tokenOptions,
  })

  const skipWalletSearchQuery = activeTab !== SearchTab.Wallets && activeTab !== SearchTab.All
  const { wallets: walletSearchOptions, loading: walletSearchResultsLoading } = useWalletSearchResults(
    skipWalletSearchQuery ? '' : (searchFilter ?? ''),
    chainFilter,
  )
  const walletSearchResultsSection = useOnchainItemListSection({
    sectionKey: OnchainItemSectionName.Wallets,
    options: walletSearchOptions,
  })

  const refetchAll = useCallback(async () => {
    refetchSearchTokens?.()
    refetchSearchPools?.()
  }, [refetchSearchPools, refetchSearchTokens])

  // oxlint-disable-next-line complexity
  return useMemo((): GqlResult<OnchainItemSection<SearchModalOption>[]> => {
    let sections: OnchainItemSection<SearchModalOption>[] = []
    switch (activeTab) {
      case SearchTab.All:
        if (isWebPlatform) {
          const tokenAndPoolSections = shouldPrioritizePools
            ? [...(poolSearchResultsSection ?? []), ...(tokenSearchResultsSection ?? [])]
            : [...(tokenSearchResultsSection ?? []), ...(poolSearchResultsSection ?? [])]
          sections = shouldPrioritizeWallets
            ? [...(walletSearchResultsSection ?? []), ...tokenAndPoolSections]
            : [...tokenAndPoolSections, ...(walletSearchResultsSection ?? [])]
        } else {
          sections = [...(tokenSearchResultsSection ?? []), ...(walletSearchResultsSection ?? [])]
        }
        return {
          data: !searchTokensLoading ? sections : [],
          loading: searchTokensLoading,
          error: (!tokenOptions.length && searchTokensError) || undefined,
          refetch: refetchAll,
        }
      case SearchTab.Tokens:
        return {
          data: tokenSearchResultsSection ?? [],
          loading: searchTokensLoading,
          error: (!tokenOptions.length && searchTokensError) || undefined,
          refetch: refetchSearchTokens,
        }
      case SearchTab.Pools:
        return {
          data: poolSearchResultsSection ?? [],
          loading: searchPoolsLoading || (poolSearchOptions.length === 0 && searchResultPools?.length !== 0),
          error: (!poolSearchResultsSection && searchPoolsError) || undefined,
          refetch: refetchSearchPools,
        }
      case SearchTab.Wallets:
        return {
          data: walletSearchResultsSection ?? [],
          loading: walletSearchResultsLoading,
          refetch: noop,
        }
      default:
        return {
          data: [],
          loading: false,
          error: undefined,
          refetch: noop,
        }
    }
  }, [
    activeTab,
    refetchSearchTokens,
    searchTokensError,
    searchTokensLoading,
    poolSearchOptions.length,
    poolSearchResultsSection,
    refetchAll,
    refetchSearchPools,
    searchPoolsError,
    searchPoolsLoading,
    searchResultPools?.length,
    shouldPrioritizePools,
    shouldPrioritizeWallets,
    tokenOptions.length,
    tokenSearchResultsSection,
    walletSearchResultsLoading,
    walletSearchResultsSection,
  ])
}

interface SearchModalResultsListProps {
  chainFilter: UniverseChainId | null
  parsedChainFilter: UniverseChainId | null
  searchFilter: string
  debouncedSearchFilter: string | null
  debouncedParsedSearchFilter: string | null
  activeTab: SearchTab
  onSelect?: SearchModalListProps['onSelect']
  onResetFilters?: () => void
  renderedInModal: boolean
  contentContainerStyle?: ContentStyle
}

function SearchModalResultsListInner({
  chainFilter,
  parsedChainFilter,
  searchFilter,
  debouncedSearchFilter,
  debouncedParsedSearchFilter,
  activeTab,
  onSelect,
  onResetFilters,
  renderedInModal,
  contentContainerStyle,
}: SearchModalResultsListProps): JSX.Element {
  const { t } = useTranslation()
  const isOffline = useIsOffline()

  const searchQuery = debouncedParsedSearchFilter ?? debouncedSearchFilter
  const shouldPrioritizeWallets =
    searchQuery?.toLowerCase().endsWith('.eth') || searchQuery?.toLowerCase().endsWith('.uni')

  const {
    data: sections,
    loading,
    error,
    refetch,
  } = useSectionsForSearchResults({
    // turn off parsed chainFilter for pools (to avoid "eth usdc" searches filtering by eth mainnet)
    chainFilter: activeTab !== SearchTab.Pools ? (chainFilter ?? parsedChainFilter) : chainFilter,
    searchFilter: searchQuery,
    activeTab,
    shouldPrioritizePools: searchQuery?.includes('/') ?? false,
    shouldPrioritizeWallets: shouldPrioritizeWallets ?? false,
  })

  const userIsTyping = Boolean(searchFilter && debouncedSearchFilter !== searchFilter)

  const hasData = Boolean(sections?.length)
  const isOfflineWithNoData = isOffline && !hasData
  const hasActiveFilters = chainFilter !== null || activeTab !== SearchTab.All

  const prevIsOffline = usePreviousWithLayoutEffect(isOffline)
  const hasReconnected = prevIsOffline && !isOffline
  useEffect(() => {
    if (hasReconnected) {
      refetch?.()
    }
  }, [hasReconnected, refetch])

  const emptyElement = useMemo(() => {
    if (isOfflineWithNoData) {
      return <NetworkError />
    }

    return debouncedSearchFilter ? (
      <NoResultsFound
        searchFilter={debouncedSearchFilter}
        onResetPressed={hasActiveFilters ? onResetFilters : undefined}
      />
    ) : undefined
  }, [debouncedSearchFilter, isOfflineWithNoData, hasActiveFilters, onResetFilters])

  return (
    <SearchModalList
      emptyElement={emptyElement}
      errorText={t('token.selector.search.error')}
      hasError={!isOffline && Boolean(error)}
      loading={!isOffline && (userIsTyping || loading)}
      refetch={refetch}
      sections={isOfflineWithNoData ? [] : sections}
      searchFilters={{
        query: debouncedParsedSearchFilter ?? debouncedSearchFilter ?? undefined,
        searchChainFilter: chainFilter,
        searchTabFilter: activeTab,
      }}
      renderedInModal={renderedInModal}
      contentContainerStyle={contentContainerStyle}
      onSelect={onSelect}
    />
  )
}

export const SearchModalResultsList = memo(SearchModalResultsListInner)
