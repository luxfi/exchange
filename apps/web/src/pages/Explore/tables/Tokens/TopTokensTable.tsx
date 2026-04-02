import { memo, useMemo } from 'react'
import { Flex, styled } from '@luxfi/ui/src'
import { MAX_WIDTH_MEDIA_BREAKPOINT } from '~/constants/breakpoints'
import useSimplePagination from '~/hooks/useSimplePagination'
import { useExploreTablesFilterStore } from '~/pages/Explore/exploreTablesFilterStore'
import { TokenTable } from '~/pages/Explore/tables/Tokens/TokensTable'
import {
  TokenTableSortStoreContextProvider,
  useTokenTableSortStore,
} from '~/pages/Explore/tables/Tokens/tokenTableSortStore'
import { LuxTokensTable } from '~/pages/Explore/tables/LuxTokensTable'
import { TABLE_PAGE_SIZE } from '~/state/explore'
import { useListTokens } from '~/state/explore/listTokens/useListTokens'
import { useChainIdFromUrlParam } from '~/utils/chainParams'

const TableWrapper = styled(Flex, {
  m: '0 auto',
  maxWidth: MAX_WIDTH_MEDIA_BREAKPOINT,
})

function DefaultTokensTableContent(): JSX.Element {
  const chainId = useChainIdFromUrlParam()
  const sortMethod = useTokenTableSortStore((s) => s.sortMethod)
  const sortAscending = useTokenTableSortStore((s) => s.sortAscending)
  const filterString = useExploreTablesFilterStore((s) => s.filterString)
  const timePeriod = useExploreTablesFilterStore((s) => s.timePeriod)

  const options = useMemo(
    () => ({ sortMethod, sortAscending, filterString, filterTimePeriod: timePeriod }),
    [sortMethod, sortAscending, filterString, timePeriod],
  )

  const { topTokens, tokenSortRank, isLoading, sparklines, isError, loadMore } = useListTokens(chainId, options)

  const { page, loadMore: clientLoadMore } = useSimplePagination()
  const effectiveLoadMore = loadMore ?? clientLoadMore
  const displayedTokens = loadMore ? topTokens : topTokens?.slice(0, page * TABLE_PAGE_SIZE)

  return (
    <TableWrapper data-testid="top-tokens-explore-table">
      <TokenTable
        tokens={displayedTokens}
        tokenSortRank={tokenSortRank}
        sparklines={sparklines}
        loading={isLoading}
        loadMore={effectiveLoadMore}
        error={isError}
      />
    </TableWrapper>
  )
}

function TopTokensTableContent(): JSX.Element {
  const chainId = useChainIdFromUrlParam()

  if (isLuxChainId(chainId as number | undefined)) {
    return <LuxTokensTable />
  }

  return <DefaultTokensTableContent />
}

export const TopTokensTable = memo(function TopTokensTable() {
  return (
    <TokenTableSortStoreContextProvider>
      <TopTokensTableContent />
    </TokenTableSortStoreContextProvider>
  )
})
