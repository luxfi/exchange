import { type ColumnDef, Row } from '@tanstack/react-table'
import { SharedEventName } from '@luxamm/analytics-events'
import { FeatureFlags, useFeatureFlag } from '@luxexchange/gating'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableArea } from '@luxfi/ui/src'
import { InformationBanner } from '@luxexchange/lx/src/components/banners/InformationBanner'
import { ElementName, SectionName } from '@luxexchange/lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from '@luxexchange/lx/src/features/telemetry/send'
import { HiddenTokenInfoModal } from '@luxexchange/lx/src/features/transactions/modals/HiddenTokenInfoModal'
import { TestID } from '@luxexchange/lx/src/test/fixtures/testIDs'
import { useBooleanState } from '@luxfi/utilities/src/react/useBooleanState'
import { useTrace } from '@luxfi/utilities/src/telemetry/trace/TraceContext'
import { Table } from '~/components/Table'
import { PORTFOLIO_TABLE_ROW_HEIGHT } from '~/pages/Portfolio/constants'
import { useNavigateToTokenDetails } from '~/pages/Portfolio/Tokens/hooks/useNavigateToTokenDetails'
import { TokenData } from '~/pages/Portfolio/Tokens/hooks/useTransformTokenTableData'
import { TokenColumns, useTokenColumns } from '~/pages/Portfolio/Tokens/Table/columns/useTokenColumns'
import type { TokenTableRow } from '~/pages/Portfolio/Tokens/Table/tokenTableRowUtils'
import {
  buildTokenTableRows,
  getSubRows,
  getTokenDataForRow,
  getTokenTableRowId,
} from '~/pages/Portfolio/Tokens/Table/tokenTableRowUtils'

export function TokensTableInner({
  tokenData,
  hideHeader,
  showHiddenTokensBanner = false,
  loading = false,
  error,
  hiddenColumns,
  maxHeight,
  maxWidth = 1200,
  loadingRowsCount,
  externalScrollSync = true,
  scrollGroup = 'portfolio-tokens',
  analyticsContext,
}: {
  tokenData: TokenData[]
  hideHeader?: boolean
  showHiddenTokensBanner?: boolean
  loading?: boolean
  error?: Error | undefined
  hiddenColumns?: TokenColumns[]
  maxHeight?: number
  maxWidth?: number
  loadingRowsCount?: number
  externalScrollSync?: boolean
  scrollGroup?: string
  analyticsContext?: { element: ElementName; section: SectionName }
}) {
  const { t } = useTranslation()
  const { value: isModalVisible, setTrue: openModal, setFalse: closeModal } = useBooleanState(false)
  const showLoadingSkeleton = loading || !!error
  const trace = useTrace()
  const multichainExpandable = useFeatureFlag(FeatureFlags.MultichainTokenUx)
  const rows = useMemo(() => buildTokenTableRows(tokenData, multichainExpandable), [tokenData, multichainExpandable])

  const columns = useTokenColumns({ hiddenColumns, showLoadingSkeleton })

  const navigateToTokenDetails = useNavigateToTokenDetails()

  const handleTokenRowClick = useCallback(
    (data: TokenData) => {
      sendAnalyticsEvent(SharedEventName.ELEMENT_CLICKED, {
        element: analyticsContext?.element ?? ElementName.TokenItem,
        section: analyticsContext?.section ?? SectionName.PortfolioTokensTab,
        ...trace,
      })
      navigateToTokenDetails(data.currencyInfo.currency)
    },
    [navigateToTokenDetails, trace, analyticsContext],
  )

  const rowWrapper = useCallback(
    (row: Row<TokenTableRow>, content: JSX.Element) => {
      if (loading) {
        return content
      }
      const canExpand = multichainExpandable && row.getCanExpand()
      const onPress = canExpand
        ? () => row.toggleExpanded()
        : () => handleTokenRowClick(getTokenDataForRow(row.original))
      return (
        <TouchableArea onPress={onPress} pressStyle={{ scale: 1 }}>
          {content}
        </TouchableArea>
      )
    },
    [loading, multichainExpandable, handleTokenRowClick],
  )

  return (
    <>
      {showHiddenTokensBanner && (
        <InformationBanner
          infoText={t('hidden.tokens.info.banner.text')}
          onPress={openModal}
          testID={TestID.HiddenTokensInfoBanner}
        />
      )}
      <HiddenTokenInfoModal isOpen={isModalVisible} onClose={closeModal} />
      <Table<TokenTableRow>
        columns={columns as ColumnDef<TokenTableRow, unknown>[]}
        data={rows}
        loading={loading}
        error={!!error}
        v2={true}
        hideHeader={hideHeader}
        externalScrollSync={externalScrollSync}
        scrollGroup={scrollGroup}
        getRowId={(row: TokenTableRow) => getTokenTableRowId(row)}
        getSubRows={getSubRows}
        singleExpandedRow
        rowWrapper={rowWrapper}
        rowHeight={PORTFOLIO_TABLE_ROW_HEIGHT}
        compactRowHeight={PORTFOLIO_TABLE_ROW_HEIGHT}
        subRowHeight={40}
        defaultPinnedColumns={['currencyInfo']}
        maxWidth={maxWidth}
        maxHeight={maxHeight}
        loadingRowsCount={loadingRowsCount}
        centerArrows
      />
    </>
  )
}
