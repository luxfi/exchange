import { Row } from '@tanstack/react-table'
import { SharedEventName } from '@uniswap/analytics-events'
import { useCallback, useMemo, useState } from 'react'
import { Flex, TouchableArea } from 'ui/src'
import { ElementName, InterfacePageName, SectionName } from 'uniswap/src/features/telemetry/constants'
import { sendAnalyticsEvent } from 'uniswap/src/features/telemetry/send'
import Trace from 'uniswap/src/features/telemetry/Trace'
import { TransactionDetails } from 'uniswap/src/features/transactions/types/transactionDetails'
import { TestID } from 'uniswap/src/test/fixtures/testIDs'
import { useEvent } from 'utilities/src/react/hooks'
import { useTrace } from 'utilities/src/telemetry/trace/TraceContext'
import { useOpenTransactionDetailsModal } from '~/components/TopLevelModals/TransactionDetailsModalDispatcher'
import { ActivityFilters } from '~/pages/Portfolio/Activity/ActivityFilters'
import { ActivityTable } from '~/pages/Portfolio/Activity/ActivityTable/ActivityTable'
import { ActivityFilterType, TimePeriod } from '~/pages/Portfolio/Activity/Filters/utils'
import { useActivityEmptyState } from '~/pages/Portfolio/Activity/hooks/useActivityEmptyState'
import { useActivityFiltering } from '~/pages/Portfolio/Activity/hooks/useActivityFiltering'
import { PaginationSkeletonRow } from '~/pages/Portfolio/Activity/PaginationSkeletonRow'
import { usePortfolioRoutes } from '~/pages/Portfolio/Header/hooks/usePortfolioRoutes'
import { usePortfolioAddresses } from '~/pages/Portfolio/hooks/usePortfolioAddresses'

export default function PortfolioActivity() {
  const trace = useTrace()
  const [selectedTransactionType, setSelectedTransactionType] = useState<string>(ActivityFilterType.All)
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<string>(TimePeriod.All)
  const openTransactionDetailsModal = useOpenTransactionDetailsModal()

  const { evmAddress, svmAddress } = usePortfolioAddresses()
  const { chainId, isExternalWallet } = usePortfolioRoutes()

  const { transactionData, sectionData, showLoading, isFetchingNextPage, sentinelRef } = useActivityFiltering({
    evmAddress,
    svmAddress,
    chainId,
    selectedTransactionType,
    selectedTimePeriod,
  })

  // Handler to clear type and time filters
  const handleClearFilters = useCallback(() => {
    setSelectedTransactionType(ActivityFilterType.All)
    setSelectedTimePeriod(TimePeriod.All)
  }, [])

  const { shouldShowEmptyState, emptyStateContent } = useActivityEmptyState({
    chainId,
    selectedTransactionType,
    selectedTimePeriod,
    sectionData,
    isExternalWallet,
    showLoading,
    transactionDataLength: transactionData.length,
    onClearFilters: handleClearFilters,
  })

  const error = false

  const tableData = useMemo(
    () =>
      transactionData.map((tx) => ({
        ...tx,
        testId: `${TestID.PortfolioActivityTableRowPrefix}${tx.hash ?? tx.id}`,
      })),
    [transactionData],
  )

  const handleTransactionClick = useEvent((transaction: TransactionDetails) => {
    sendAnalyticsEvent(SharedEventName.ELEMENT_CLICKED, {
      element: ElementName.ActivityRow,
      section: SectionName.PortfolioActivityTab,
      ...trace,
    })
    openTransactionDetailsModal(transaction, { isExternalProfile: isExternalWallet })
  })

  const rowWrapper = useEvent((row: Row<TransactionDetails>, content: JSX.Element) => {
    const transaction = row.original
    return (
      <TouchableArea onPress={() => handleTransactionClick(transaction)} cursor="pointer" pressStyle={{ scale: 1 }}>
        {content}
      </TouchableArea>
    )
  })

>>>>>>> upstream/main
  return (
    <Trace logImpression page={InterfacePageName.PortfolioActivityPage} properties={{ isExternal: isExternalWallet }}>
      <Flex gap="$spacing28" mt="$spacing12">
        {/* Filtering Controls */}
        <Trace section={SectionName.PortfolioActivityTab} element={ElementName.ActivityFilters}>
          <ActivityFilters
            selectedTransactionType={selectedTransactionType}
            onTransactionTypeChange={setSelectedTransactionType}
            selectedTimePeriod={selectedTimePeriod}
            onTimePeriodChange={setSelectedTimePeriod}
          />
        </Trace>

        <Flex>
          {shouldShowEmptyState ? (
            emptyStateContent
          ) : (
            <Trace section={SectionName.PortfolioActivityTab} element={ElementName.PortfolioActivityTable}>
              <>
                <ActivityTable data={tableData} loading={showLoading} error={error} rowWrapper={rowWrapper} />

                {/* Show skeleton loading indicator while fetching next page */}
                {isFetchingNextPage && <PaginationSkeletonRow />}

                {/* Intersection observer sentinel for infinite scroll */}
                <Flex ref={sentinelRef} height={1} my={10} />
              </>
            </Trace>
          )}
        </Flex>
<<<<<<< HEAD

        {selectedTransaction && (
          <TransactionDetailsModal
            isExternalProfile={isExternalWallet}
            transactionDetails={selectedTransaction}
            onClose={handleCloseTransactionDetails}
            authTrigger={undefined}
            onReportSuccess={onReportSuccess}
            onUnhideTransaction={onUnhideTransaction}
            onCopySuccess={onCopySuccess}
          />
        )}
=======
      </Flex>
    </Trace>
  )
}
