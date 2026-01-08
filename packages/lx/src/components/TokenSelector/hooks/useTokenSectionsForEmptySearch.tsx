import { GqlResult } from '@luxfi/api'
import { useMemo } from 'react'
import { TokenOption } from 'lx/src/components/lists/items/types'
import { type OnchainItemSection, OnchainItemSectionName } from 'lx/src/components/lists/OnchainItemList/types'
import { useOnchainItemListSection } from 'lx/src/components/lists/utils'
import { MAX_DEFAULT_TRENDING_TOKEN_RESULTS_AMOUNT } from 'lx/src/components/TokenSelector/constants'
import { useRecentlySearchedTokens } from 'lx/src/components/TokenSelector/hooks/useRecentlySearchedTokens'
import { useTrendingTokensOptions } from 'lx/src/components/TokenSelector/hooks/useTrendingTokensOptions'
import { TokenSectionsHookProps } from 'lx/src/components/TokenSelector/types'
import { ClearRecentSearchesButton } from 'lx/src/features/search/ClearRecentSearchesButton'

export function useTokenSectionsForEmptySearch({
  evmAddress,
  svmAddress,
  chainFilter,
}: Omit<TokenSectionsHookProps, 'oppositeSelectedToken'>): GqlResult<OnchainItemSection<TokenOption>[]> {
  const { data: trendingTokenOptions, loading } = useTrendingTokensOptions({ evmAddress, svmAddress, chainFilter })

  const recentlySearchedTokenOptions = useRecentlySearchedTokens(chainFilter)

  const recentSection = useOnchainItemListSection({
    sectionKey: OnchainItemSectionName.RecentSearches,
    options: recentlySearchedTokenOptions,
    endElement: <ClearRecentSearchesButton />,
  })

  const trendingSection = useOnchainItemListSection({
    sectionKey: OnchainItemSectionName.TrendingTokens,
    options: trendingTokenOptions?.slice(0, MAX_DEFAULT_TRENDING_TOKEN_RESULTS_AMOUNT),
  })
  const sections = useMemo(
    () => [...(recentSection ?? []), ...(trendingSection ?? [])],
    [trendingSection, recentSection],
  )

  return useMemo(
    () => ({
      data: sections,
      loading,
    }),
    [loading, sections],
  )
}
