/* oxlint-disable typescript/no-unnecessary-condition, max-lines */
import { createColumnHelper } from '@tanstack/react-table'
import { FeatureFlags, useFeatureFlag } from '@l.x/gating'
import { useAtom } from 'jotai'
import { atomWithReset } from 'jotai/utils'
import { memo, ReactElement, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, styled, Text, useMedia } from 'ui/src'
import { normalizeTokenAddressForCache } from 'uniswap/src/data/cache'
import { getChainInfo } from 'uniswap/src/features/chains/chainInfo'
import { useLocalizationContext } from 'uniswap/src/features/language/LocalizationContext'
import { ElementName } from 'uniswap/src/features/telemetry/constants'
import { NumberType } from 'utilities/src/format/types'
import { useEvent } from 'utilities/src/react/hooks'
import { ONE_HOUR_MS, ONE_SECOND_MS } from 'utilities/src/time/time'
import { useDebounce } from 'utilities/src/time/timing'
import { OrderDirection } from '~/appGraphql/data/util'
import { Table } from '~/components/Table'
import { Cell } from '~/components/Table/Cell'
import { TableText } from '~/components/Table/shared/TableText'
import { HeaderCell } from '~/components/Table/styled'
import { formatCompactFromRaw } from '~/components/Toucan/Auction/utils/fixedPointFdv'
import { buildTokenMarketPriceKey } from '~/components/Toucan/hooks/useTokenMarketPrices'
import { computeProjectedFdvTableValue, ProjectedFdvTableValue } from '~/components/Toucan/utils/computeProjectedFdv'
import { MAX_WIDTH_MEDIA_BREAKPOINT } from '~/constants/breakpoints'
import useSimplePagination from '~/hooks/useSimplePagination'
import {
  AuctionStatusFilter,
  AuctionVerificationFilter,
  useExploreTablesFilterStore,
} from '~/pages/Explore/exploreTablesFilterStore'
import { TimeRemainingCell } from '~/pages/Explore/tables/Auctions/TimeRemainingCell'
import {
  AuctionSortField,
  AuctionTableHeader,
  TokenNameCell,
} from '~/pages/Explore/tables/Auctions/TopAuctionsTableCells'
import { TABLE_PAGE_SIZE } from '~/state/explore'
import { useAuctionTokenPrices } from '~/state/explore/topAuctions/useAuctionTokenPrices'
import type { EnrichedAuction } from '~/state/explore/topAuctions/useTopAuctions'
import { auctionCommittedVolumeComparator, useTopAuctions } from '~/state/explore/topAuctions/useTopAuctions'

/**
 * Comparator functions for client-side auction sorting.
 * Default behavior: descending order (higher values first).
 * Uses bigint comparison to avoid precision loss.
 * Treats 0n as "no data" and sorts it to the end.
 */

  [AuctionSortField.TIME_REMAINING]: (a, b, sortAscending = false) => {
    const aMs = a.auction.timeRemaining.endBlockTimestamp
    const bMs = b.auction.timeRemaining.endBlockTimestamp
    const aCompleted = a.auction.timeRemaining.isCompleted
    const bCompleted = b.auction.timeRemaining.isCompleted

    // No data sorts to end
    if (aMs === undefined) {
      return 1
    }
    if (bMs === undefined) {
      return -1
    }

    // Descending (default): ongoing first, then completed
    // Ascending: completed first, then ongoing
    if (!sortAscending) {
      // Descending: ongoing auctions first
      if (!aCompleted && bCompleted) {
        return -1 // a (ongoing) comes first
      }
      if (aCompleted && !bCompleted) {
        return 1 // b (ongoing) comes first
      }
      // Both same status: sort by earliest timestamp first
      return Number(aMs) - Number(bMs)
    } else {
      // Ascending: completed auctions first
      if (aCompleted && !bCompleted) {
        return -1 // a (completed) comes first
      }
      if (!aCompleted && bCompleted) {
        return 1 // b (completed) comes first
      }
      // Both ongoing: sort by latest timestamp first
      return Number(bMs) - Number(aMs)
    }
  },
}
              {t('explore.table.column.token')}
            </Text>
          </HeaderCell>
        ),
        cell: (tokenName) => (
          <Cell justifyContent="flex-start" loading={showLoadingSkeleton}>
            {tokenName.getValue?.()}
          </Cell>
        ),
      }),
      columnHelper.accessor((row) => row.projectedFdv, {
        id: 'projectedFdv',
        size: 180,
        header: () => (
          <HeaderCell justifyContent="flex-end">
            <AuctionTableHeader
              category={AuctionSortField.FDV}
              isCurrentSortMethod={sortMethod === AuctionSortField.FDV}
              direction={orderDirection}
              onSort={createSortHandler(AuctionSortField.FDV)}
            />
          </HeaderCell>
        ),
        cell: (row) => {
          const projectedFdv = row.getValue?.()
          return (
            <Cell justifyContent="flex-end" loading={showLoadingSkeleton}>
              <Flex flexDirection="column" alignItems="flex-end" gap="$spacing4">
                <TableText>
                  {projectedFdv?.usd !== undefined
                    ? convertFiatAmountFormatted(projectedFdv.usd, NumberType.FiatTokenStats)
                    : projectedFdv?.formattedBidToken}
                </TableText>
              </Flex>
            </Cell>
          )
        },
      }),
      columnHelper.accessor((row) => row.auction, {
        id: 'committedVolume',
        size: 180,
        header: () => (
          <HeaderCell justifyContent="flex-end">
            <AuctionTableHeader
              category={AuctionSortField.COMMITTED_VOLUME}
              isCurrentSortMethod={sortMethod === AuctionSortField.COMMITTED_VOLUME}
              direction={orderDirection}
              onSort={createSortHandler(AuctionSortField.COMMITTED_VOLUME)}
            />
          </HeaderCell>
        ),
        cell: (row) => {
          const auction = row.getValue?.()?.auction
          const commitedVolumeUsd = auction?.totalBidVolumeUsd
          const commitedVolumeRaw = auction?.totalBidVolume
          const commitedVolumeFormatted =
            commitedVolumeRaw && auction?.currencyTokenDecimals
              ? formatCompactFromRaw({
                  raw: BigInt(commitedVolumeRaw),
                  decimals: auction?.currencyTokenDecimals,
                })
              : undefined

          return (
            <Cell justifyContent="flex-end" loading={showLoadingSkeleton}>
              <Flex flexDirection="column" alignItems="flex-end" gap="$spacing4">
                <TableText>
                  {commitedVolumeUsd !== undefined
                    ? convertFiatAmountFormatted(commitedVolumeUsd, NumberType.FiatTokenStats)
                    : commitedVolumeFormatted}
                </TableText>
              </Flex>
            </Cell>
          )
        },
      }),
      columnHelper.accessor((row) => row.auction, {
        id: 'timeRemaining',
        size: 240,
        header: () => (
          <HeaderCell justifyContent="flex-end">
            <AuctionTableHeader
              category={AuctionSortField.TIME_REMAINING}
              isCurrentSortMethod={sortMethod === AuctionSortField.TIME_REMAINING}
              direction={orderDirection}
              onSort={createSortHandler(AuctionSortField.TIME_REMAINING)}
            />
          </HeaderCell>
        ),
        cell: (row) => {
          const timeRemaining = row.getValue?.()?.timeRemaining
          return (
            <Cell justifyContent="flex-end" loading={showLoadingSkeleton}>
              <TimeRemainingCell
                startBlockTimestamp={timeRemaining?.startBlockTimestamp}
                endBlockTimestamp={timeRemaining?.endBlockTimestamp}
              />
            </Cell>
          )
        },
      }),
    ]

    return filteredColumns.filter((column): column is NonNullable<(typeof filteredColumns)[number]> => Boolean(column))
  }, [showLoadingSkeleton, media, t, sortMethod, orderDirection, convertFiatAmountFormatted, createSortHandler])

  return (
    <Flex gap="$spacing12">
      <Table
        columns={columns}
        data={sortedVisibleAuctionTableValues}
        loading={loading}
        error={error}
        v2={isMultichainTokenUx}
        loadMore={loadMore}
        maxWidth={1200}
        defaultPinnedColumns={['index', 'tokenName']}
        hiddenRows={sortedHiddenAuctionTableValues}
        showHiddenRowsLabel={t('toucan.auction.showHiddenAuctions')}
        hideHiddenRowsLabel={t('toucan.auction.hideHiddenAuctions')}
      />
      <Flex justifyContent="center" alignItems="center">
        <Text lineHeight="$spacing12" flex={1} width="75%" color="$neutral3" textAlign="center" variant="body4">
          {t('toucan.auction.disclaimer')}
        </Text>
      </Flex>
    </Flex>
  )
}
