import { memo, useMemo } from 'react'
<<<<<<< HEAD
import { Flex, styled } from '@l.x/ui/src'
=======
import { Flex, styled } from 'ui/src'
>>>>>>> upstream/main
import { MAX_WIDTH_MEDIA_BREAKPOINT } from '~/constants/breakpoints'
import useSimplePagination from '~/hooks/useSimplePagination'
import { useExploreTablesFilterStore } from '~/pages/Explore/exploreTablesFilterStore'
import { TokenTable } from '~/pages/Explore/tables/Tokens/TokensTable'
import {
  TokenTableSortStoreContextProvider,
  useTokenTableSortStore,
} from '~/pages/Explore/tables/Tokens/tokenTableSortStore'
<<<<<<< HEAD
import { LuxTokensTable } from '~/pages/Explore/tables/LuxTokensTable'
import { isLuxChainId } from '~/state/explore/luxSubgraph'
import { TABLE_PAGE_SIZE } from '~/state/explore'
import { useListTokens } from '~/state/explore/listTokens/useListTokens'
=======
import { TABLE_PAGE_SIZE } from '~/state/explore'
import { useListTokens } from '~/state/explore/listTokens/useListTokens'
import { useExploreBackendSortingEnabled } from '~/state/explore/useExploreBackendSortingEnabled'
>>>>>>> upstream/main
import { useChainIdFromUrlParam } from '~/utils/chainParams'

const TableWrapper = styled(Flex, {
  m: '0 auto',
  maxWidth: MAX_WIDTH_MEDIA_BREAKPOINT,
})

<<<<<<< HEAD
function DefaultTokensTableContent(): JSX.Element {
=======
function TopTokensTableContent(): JSX.Element {
>>>>>>> upstream/main
  const chainId = useChainIdFromUrlParam()
  const sortMethod = useTokenTableSortStore((s) => s.sortMethod)
  const sortAscending = useTokenTableSortStore((s) => s.sortAscending)
  const filterString = useExploreTablesFilterStore((s) => s.filterString)
  const timePeriod = useExploreTablesFilterStore((s) => s.timePeriod)

  const options = useMemo(
    () => ({ sortMethod, sortAscending, filterString, filterTimePeriod: timePeriod }),
    [sortMethod, sortAscending, filterString, timePeriod],
  )

<<<<<<< HEAD
=======
  const backendSortingEnabled = useExploreBackendSortingEnabled()
>>>>>>> upstream/main
  const { topTokens, tokenSortRank, isLoading, sparklines, isError, loadMore } = useListTokens(chainId, options)

  const { page, loadMore: clientLoadMore } = useSimplePagination()
  const effectiveLoadMore = loadMore ?? clientLoadMore
<<<<<<< HEAD
  const displayedTokens = loadMore ? topTokens : topTokens?.slice(0, page * TABLE_PAGE_SIZE)
=======
  const displayedTokens = backendSortingEnabled ? topTokens : topTokens.slice(0, page * TABLE_PAGE_SIZE)
>>>>>>> upstream/main

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

<<<<<<< HEAD
function TopTokensTableContent(): JSX.Element {
  const chainId = useChainIdFromUrlParam()

  if (isLuxChainId(chainId as number | undefined)) {
    return <LuxTokensTable />
  }

  return <DefaultTokensTableContent />
}

=======
>>>>>>> upstream/main
export const TopTokensTable = memo(function TopTokensTable() {
  return (
    <TokenTableSortStoreContextProvider>
      <TopTokensTableContent />
    </TokenTableSortStoreContextProvider>
  )
})
