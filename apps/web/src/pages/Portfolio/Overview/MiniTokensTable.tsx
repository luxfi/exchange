<<<<<<< HEAD
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex } from '@l.x/ui/src'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { ElementName, SectionName } from 'lx/src/features/telemetry/constants'
import { TestID } from 'lx/src/test/fixtures/testIDs'
import { usePortfolioRoutes } from '~/pages/Portfolio/Header/hooks/usePortfolioRoutes'
=======
import { FeatureFlags, useFeatureFlag } from '@universe/gating'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex } from 'ui/src'
import { useGetWalletTokensProfitLossQuery } from 'uniswap/src/data/rest/getWalletTokensProfitLoss'
import { useEnabledChains } from 'uniswap/src/features/chains/hooks/useEnabledChains'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { ElementName, SectionName } from 'uniswap/src/features/telemetry/constants'
import { TestID } from 'uniswap/src/test/fixtures/testIDs'
import { usePortfolioRoutes } from '~/pages/Portfolio/Header/hooks/usePortfolioRoutes'
import { usePortfolioAddresses } from '~/pages/Portfolio/hooks/usePortfolioAddresses'
>>>>>>> upstream/main
import { MAX_TOKENS_ROWS } from '~/pages/Portfolio/Overview/constants'
import { TableSectionHeader } from '~/pages/Portfolio/Overview/TableSectionHeader'
import { ViewAllButton } from '~/pages/Portfolio/Overview/ViewAllButton'
import { useTransformTokenTableData } from '~/pages/Portfolio/Tokens/hooks/useTransformTokenTableData'
import { TokenColumns } from '~/pages/Portfolio/Tokens/Table/columns/useTokenColumns'
import { TokensTableInner } from '~/pages/Portfolio/Tokens/Table/TokensTableInner'
import { PortfolioTab } from '~/pages/Portfolio/types'
import { buildPortfolioUrl } from '~/pages/Portfolio/utils/portfolioUrls'

interface MiniTokensTableProps {
  maxTokens?: number
  chainId?: UniverseChainId
}

export const MiniTokensTable = memo(function MiniTokensTable({ maxTokens = 8, chainId }: MiniTokensTableProps) {
  const { t } = useTranslation()
  const { externalAddress, chainId: routeChainId } = usePortfolioRoutes()
<<<<<<< HEAD
=======
  const portfolioAddresses = usePortfolioAddresses()
  const isProfitLossEnabled = useFeatureFlag(FeatureFlags.ProfitLoss)
  const { chains: enabledChains } = useEnabledChains()
>>>>>>> upstream/main
  const viewAllHref = buildPortfolioUrl({
    tab: PortfolioTab.Tokens,
    chainId: routeChainId,
    externalAddress: externalAddress?.address,
  })

<<<<<<< HEAD
=======
  const { data: tokenProfitLossData, isError: isProfitLossError } = useGetWalletTokensProfitLossQuery({
    input: {
      evmAddress: portfolioAddresses.evmAddress,
      svmAddress: portfolioAddresses.svmAddress,
      chainIds: chainId ? [chainId] : enabledChains,
    },
    enabled: isProfitLossEnabled,
  })

>>>>>>> upstream/main
  const {
    visible: tokenData,
    totalCount,
    loading,
    error,
  } = useTransformTokenTableData({
    limit: maxTokens,
    chainIds: chainId ? [chainId] : undefined,
<<<<<<< HEAD
=======
    tokenProfitLossData: isProfitLossError ? undefined : (tokenProfitLossData ?? undefined),
>>>>>>> upstream/main
  })

  const tableData = tokenData ?? []
  const tableLoading = loading && !tokenData

<<<<<<< HEAD
=======
  const hiddenColumns = [TokenColumns.Change1d, TokenColumns.Allocation, TokenColumns.AvgCost]
  if (!isProfitLossEnabled) {
    hiddenColumns.push(TokenColumns.UnrealizedPnl)
  }

>>>>>>> upstream/main
  return (
    <Flex grow gap="$gap12">
      <TableSectionHeader
        title={t('common.tokens')}
        subtitle={t('portfolio.tokens.balance.totalTokens', { count: totalCount ?? tableData.length })}
        loading={tableLoading}
        testId={TestID.PortfolioOverviewTokensSection}
      >
        <TokensTableInner
          tokenData={tableData}
          loading={tableLoading}
          error={error}
<<<<<<< HEAD
          hiddenColumns={[TokenColumns.Change1d, TokenColumns.Allocation]}
          maxHeight={undefined}
          loadingRowsCount={MAX_TOKENS_ROWS}
          externalScrollSync={false}
=======
          hiddenColumns={hiddenColumns}
          maxHeight={undefined}
          loadingRowsCount={MAX_TOKENS_ROWS}
          externalScrollSync={false}
          showUnrealizedPnlPercent
>>>>>>> upstream/main
          analyticsContext={{
            element: ElementName.PortfolioMiniTokenRow,
            section: SectionName.PortfolioOverviewTab,
          }}
        />
      </TableSectionHeader>
      <ViewAllButton
        href={viewAllHref}
        label={t('portfolio.overview.miniTokensTable.viewAllTokens')}
        elementName={ElementName.PortfolioViewAllTokens}
        testId={TestID.PortfolioOverviewViewAllTokens}
      />
    </Flex>
  )
})
