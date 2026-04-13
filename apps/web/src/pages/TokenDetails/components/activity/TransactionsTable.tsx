/* oxlint-disable typescript/no-unnecessary-condition */

import { ApolloError } from '@apollo/client'
import { createColumnHelper } from '@tanstack/react-table'
import { Token } from '@uniswap/sdk-core'
import { GraphQLApi } from '@l.x/api'
import { FeatureFlags, useFeatureFlag } from '@l.x/gating'
import { useMemo, useReducer, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text, useMedia } from 'ui/src'
import { getChainInfo } from 'uniswap/src/features/chains/chainInfo'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { useAppFiatCurrency } from 'uniswap/src/features/fiatCurrency/hooks'
import { useLocalizationContext } from 'uniswap/src/features/language/LocalizationContext'
import { Platform } from 'uniswap/src/features/platforms/types/Platform'
import { areAddressesEqual } from 'uniswap/src/utils/addresses'
import { ExplorerDataType, getExplorerLink } from 'uniswap/src/utils/linking'
import { shortenAddress } from 'utilities/src/addresses'
import { NumberType } from 'utilities/src/format/types'
import {
  getTokenTransactionTypeTranslation,
  TokenTransactionType,
  useTokenTransactions,
} from '~/appGraphql/data/useTokenTransactions'
import { unwrapToken } from '~/appGraphql/data/util'
import { AddressHoverCard } from '~/components/AddressHoverCard/AddressHoverCard'
import { LimitedDataBanner } from '~/components/Banner/Outage/OutageBanner'
import { InternalLink } from '~/components/InternalLink'
import { Table } from '~/components/Table'
import { Cell } from '~/components/Table/Cell'
import { Filter } from '~/components/Table/Filter'
import { HeaderSortText } from '~/components/Table/shared/SortableHeader'
import { EllipsisText, TableText } from '~/components/Table/shared/TableText'
import { TimestampCell } from '~/components/Table/shared/TimestampCell'
import { TokenLinkCell } from '~/components/Table/shared/TokenLinkCell'
import { FilterHeaderRow, HeaderCell } from '~/components/Table/styled'
import { useUpdateManualOutage } from '~/hooks/useUpdateManualOutage'
import { buildPortfolioUrl } from '~/pages/Portfolio/utils/portfolioUrls'

interface SwapTransaction {
  hash: string
  timestamp: number
  input: SwapLeg
  output: SwapLeg
  value: string
  makerAddress: string
}

interface SwapLeg {
  address?: string
  symbol?: string
  amount: number
  token: GraphQLApi.Token
}

export function TransactionsTable({ chainId, referenceToken }: { chainId: UniverseChainId; referenceToken: Token }) {
  const { t } = useTranslation()
  const isMultichainTokenUx = useFeatureFlag(FeatureFlags.MultichainTokenUx)
  const activeLocalCurrency = useAppFiatCurrency()
  const { convertFiatAmountFormatted, formatNumberOrString } = useLocalizationContext()
  const [filterModalIsOpen, toggleFilterModal] = useReducer((s) => !s, false)
  const filterAnchorRef = useRef<HTMLDivElement>(null)
  const [filter, setFilters] = useState<TokenTransactionType[]>([TokenTransactionType.BUY, TokenTransactionType.SELL])
  const { transactions, loading, loadMore, errorV2, errorV3, errorV4 } = useTokenTransactions({
    address: referenceToken.address,
    chainId,
    filter,
              <TokenLinkCell token={nonReferenceSwapLeg.token} showMainnetNetworkLogo={isMultichainTokenUx} />
            </Flex>
          )
        },
        {
          id: 'non-reference-amount',
          maxSize: 160,
          header: () => (
            <HeaderCell justifyContent="flex-end">
              <Text variant="body3" color="$neutral2">
                {t('common.for')}
              </Text>
            </HeaderCell>
          ),
          cell: (swapOutput) => (
            <Cell loading={showLoadingSkeleton} justifyContent="flex-end">
              <TableText>{swapOutput.getValue?.()}</TableText>
            </Cell>
          ),
        },
      ),
      columnHelper.accessor((row) => row.value, {
        id: 'fiat-value',
        maxSize: 100,
        header: () => (
          <HeaderCell justifyContent="flex-end">
            <Flex row gap="$gap4" justifyContent="flex-end">
              <HeaderSortText>{activeLocalCurrency}</HeaderSortText>
            </Flex>
          </HeaderCell>
        ),
        cell: (fiat) => (
          <Cell loading={showLoadingSkeleton} justifyContent="flex-end">
            <TableText>{fiat.getValue?.()}</TableText>
          </Cell>
        ),
      }),
      columnHelper.accessor((row) => row.makerAddress, {
        id: 'maker-address',
        maxSize: 130,
        header: () => (
          <HeaderCell justifyContent="flex-end">
            <Text variant="body3" color="$neutral2">
              {t('common.wallet.label')}
            </Text>
          </HeaderCell>
        ),
        cell: (makerAddress) => {
          const address = makerAddress.getValue?.()
          const shortenedAddress = shortenAddress({ address })
          const chainInfo = getChainInfo(chainId)

          return (
            <Cell loading={showLoadingSkeleton} justifyContent="flex-end">
              <AddressHoverCard address={address} platform={chainInfo.platform}>
                <InternalLink to={buildPortfolioUrl({ externalAddress: address })}>
                  <TableText>{shortenedAddress}</TableText>
                </InternalLink>
              </AddressHoverCard>
            </Cell>
          )
        },
      }),
    ]
  }, [
    t,
    showLoadingSkeleton,
    chainId,
    filterModalIsOpen,
    filter,
    isMultichainTokenUx,
    referenceToken.address,
    unwrappedReferenceToken.symbol,
    formatNumberOrString,
    activeLocalCurrency,
  ])

  return (
    <Flex position="relative" minHeight={158}>
      <Table
        columns={columns}
        data={data}
        loading={allDataStillLoading}
        error={combinedError}
        v2={isMultichainTokenUx}
        loadMore={loadMore}
        maxHeight={600}
        defaultPinnedColumns={['timestamp', 'swap-type']}
        forcePinning={media.xxl}
      />
      {showLimitedDataBanner && (
        <LimitedDataBanner failedVersions={failedVersions} tokenAddress={referenceToken.address} chainId={chainId} />
      )}
    </Flex>
  )
}
