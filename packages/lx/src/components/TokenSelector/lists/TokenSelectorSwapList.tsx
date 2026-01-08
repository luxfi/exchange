import { GqlResult } from '@luxfi/api'
import { memo, useCallback, useMemo, useRef } from 'react'
import { TokenSelectorOption } from 'lx/src/components/lists/items/types'
import { type OnchainItemSection, OnchainItemSectionName } from 'lx/src/components/lists/OnchainItemList/types'
import { useOnchainItemListSection } from 'lx/src/components/lists/utils'
import { useCommonTokensOptionsWithFallback } from 'lx/src/components/TokenSelector/hooks/useCommonTokensOptionsWithFallback'
import { useFavoriteTokensOptions } from 'lx/src/components/TokenSelector/hooks/useFavoriteTokensOptions'
import { usePortfolioTokenOptions } from 'lx/src/components/TokenSelector/hooks/usePortfolioTokenOptions'
import { useRecentlySearchedTokens } from 'lx/src/components/TokenSelector/hooks/useRecentlySearchedTokens'
import { useTrendingTokensOptions } from 'lx/src/components/TokenSelector/hooks/useTrendingTokensOptions'
import { TokenSelectorList } from 'lx/src/components/TokenSelector/TokenSelectorList'
import { OnSelectCurrency, TokenSectionsHookProps } from 'lx/src/components/TokenSelector/types'
import { isSwapListLoading } from 'lx/src/components/TokenSelector/utils'
import { useBridgingTokensOptions } from 'lx/src/features/bridging/hooks/tokens'
import { useEnabledChains } from 'lx/src/features/chains/hooks/useEnabledChains'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { isBackendSupportedChainId } from 'lx/src/features/chains/utils'
import { ClearRecentSearchesButton } from 'lx/src/features/search/ClearRecentSearchesButton'
import { isMobileApp } from 'utilities/src/platform'

// eslint-disable-next-line complexity
function useTokenSectionsForSwap({
  evmAddress,
  svmAddress,
  chainFilter,
  oppositeSelectedToken,
}: TokenSectionsHookProps): GqlResult<OnchainItemSection<TokenSelectorOption>[]> {
  const { defaultChainId, isTestnetModeEnabled } = useEnabledChains()

  const {
    data: portfolioTokenOptions,
    error: portfolioTokenOptionsError,
    refetch: refetchPortfolioTokenOptions,
    loading: portfolioTokenOptionsLoading,
  } = usePortfolioTokenOptions({ evmAddress, svmAddress, chainFilter })

  const {
    data: trendingTokenOptions,
    error: trendingTokenOptionsError,
    refetch: refetchTrendingTokenOptions,
    loading: trendingTokenOptionsLoading,
  } = useTrendingTokensOptions({ evmAddress, svmAddress, chainFilter })

  const {
    data: favoriteTokenOptions,
    error: favoriteTokenOptionsError,
    refetch: refetchFavoriteTokenOptions,
    loading: favoriteTokenOptionsLoading,
  } = useFavoriteTokensOptions({ evmAddress, svmAddress, chainFilter })

  const {
    data: commonTokenOptions,
    error: commonTokenOptionsError,
    refetch: refetchCommonTokenOptions,
    loading: commonTokenOptionsLoading,
    // if there is no chain filter, first check if the input token has a chainId, fallback to defaultChainId
  } = useCommonTokensOptionsWithFallback({
    evmAddress,
    svmAddress,
    chainFilter: chainFilter ?? oppositeSelectedToken?.chainId ?? defaultChainId,
  })

  const {
    data: bridgingTokenOptions,
    error: bridgingTokenOptionsError,
    refetch: refetchBridgingTokenOptions,
    loading: bridgingTokenOptionsLoading,
    shouldNest: shouldNestBridgingTokens,
  } = useBridgingTokensOptions({ oppositeSelectedToken, evmAddress, svmAddress, chainFilter })

  const recentlySearchedTokenOptions = useRecentlySearchedTokens(chainFilter)

  // For chains not supported by the backend (like LuxDev), we expect API errors
  // Suppress all errors for such chains - we'll only show tokens from COMMON_BASES fallback
  const effectiveChainId = chainFilter ?? oppositeSelectedToken?.chainId ?? defaultChainId
  const isChainBackendSupported = effectiveChainId ? isBackendSupportedChainId(effectiveChainId) : true

  // For non-backend-supported chains, suppress ALL API errors since we expect them to fail
  // We rely entirely on the COMMON_BASES fallback for these chains
  const error = isChainBackendSupported
    ? (!portfolioTokenOptions && portfolioTokenOptionsError) ||
      (!trendingTokenOptions && trendingTokenOptionsError) ||
      (!favoriteTokenOptions && favoriteTokenOptionsError) ||
      (!commonTokenOptions && commonTokenOptionsError) ||
      (!bridgingTokenOptions && bridgingTokenOptionsError)
    : undefined

  // For non-backend-supported chains, only consider common tokens loading state
  // since other API calls will fail anyway
  const loading = isChainBackendSupported
    ? (!portfolioTokenOptions && portfolioTokenOptionsLoading) ||
      (!trendingTokenOptions && trendingTokenOptionsLoading) ||
      (!favoriteTokenOptions && favoriteTokenOptionsLoading) ||
      (!commonTokenOptions && commonTokenOptionsLoading) ||
      (!bridgingTokenOptions && bridgingTokenOptionsLoading)
    : !commonTokenOptions && commonTokenOptionsLoading

  const refetchAllRef = useRef<() => void>(() => {})

  refetchAllRef.current = (): void => {
    refetchPortfolioTokenOptions?.()
    refetchTrendingTokenOptions?.()
    refetchFavoriteTokenOptions?.()
    refetchCommonTokenOptions?.()
    refetchBridgingTokenOptions?.()
  }

  const refetch = useCallback(() => {
    refetchAllRef.current()
  }, [])

  // we draw the Suggested pills as a single item of a section list, so `data` is TokenOption[][]

  const suggestedSectionOptions = useMemo(() => [commonTokenOptions ?? []], [commonTokenOptions])
  const suggestedSection = useOnchainItemListSection({
    sectionKey: OnchainItemSectionName.SuggestedTokens,
    options: suggestedSectionOptions,
  })

  const portfolioSection = useOnchainItemListSection({
    sectionKey: OnchainItemSectionName.YourTokens,
    options: portfolioTokenOptions,
  })

  const memoizedEndElement = useMemo(() => <ClearRecentSearchesButton />, [])
  const recentSection = useOnchainItemListSection({
    sectionKey: OnchainItemSectionName.RecentSearches,
    options: recentlySearchedTokenOptions,
    endElement: memoizedEndElement,
  })
  const favoriteSection = useOnchainItemListSection({
    sectionKey: OnchainItemSectionName.FavoriteTokens,
    options: favoriteTokenOptions,
  })
  const trendingSection = useOnchainItemListSection({
    sectionKey: OnchainItemSectionName.TrendingTokens,
    options: trendingTokenOptions,
  })
  const bridgingSectionTokenOptions: TokenSelectorOption[] = useMemo(
    () => (shouldNestBridgingTokens ? [bridgingTokenOptions ?? []] : (bridgingTokenOptions ?? [])),
    [bridgingTokenOptions, shouldNestBridgingTokens],
  )

  const bridgingSection = useOnchainItemListSection({
    sectionKey: OnchainItemSectionName.BridgingTokens,
    options: bridgingSectionTokenOptions,
  })

  const sections = useMemo(() => {
    if (isSwapListLoading({ loading, portfolioSection, trendingSection, isTestnetModeEnabled })) {
      return undefined
    }

    if (isTestnetModeEnabled) {
      return [...(suggestedSection ?? []), ...(portfolioSection ?? [])]
    }

    return [
      ...(suggestedSection ?? []),
      ...(bridgingSection ?? []),
      ...(portfolioSection ?? []),
      ...(recentSection ?? []),
      // TODO(WEB-3061): Favorited wallets/tokens
      // Extension & interface do not support favoriting but has a default list, so we can't rely on empty array check
      ...(isMobileApp ? (favoriteSection ?? []) : []),
      ...(trendingSection ?? []),
    ]
  }, [
    loading,
    portfolioSection,
    trendingSection,
    suggestedSection,
    bridgingSection,
    recentSection,
    favoriteSection,
    isTestnetModeEnabled,
  ])

  return useMemo(
    () => ({
      data: sections,
      loading,
      error: error || undefined,
      refetch,
    }),
    [error, loading, refetch, sections],
  )
}

function _TokenSelectorSwapList({
  onSelectCurrency,
  evmAddress,
  svmAddress,
  chainFilter,
  oppositeSelectedToken,
  renderedInModal,
}: TokenSectionsHookProps & {
  onSelectCurrency: OnSelectCurrency
  chainFilter: UniverseChainId | null
  renderedInModal: boolean
}): JSX.Element {
  const {
    data: sections,
    loading,
    error,
    refetch,
  } = useTokenSectionsForSwap({
    evmAddress,
    svmAddress,
    chainFilter,
    oppositeSelectedToken,
  })
  return (
    <TokenSelectorList
      showTokenAddress
      chainFilter={chainFilter}
      hasError={Boolean(error)}
      loading={loading}
      refetch={refetch}
      sections={sections}
      showTokenWarnings={true}
      renderedInModal={renderedInModal}
      onSelectCurrency={onSelectCurrency}
    />
  )
}

export const TokenSelectorSwapList = memo(_TokenSelectorSwapList)
