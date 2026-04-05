<<<<<<< HEAD
/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import { ApolloError } from '@apollo/client'
import { createColumnHelper } from '@tanstack/react-table'
import { FeatureFlags, useFeatureFlag } from '@l.x/gating'
import { ReactElement, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text, useMedia } from '@l.x/ui/src'
import { useEnabledChains } from 'lx/src/features/chains/hooks/useEnabledChains'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { fromGraphQLChain, toGraphQLChain } from 'lx/src/features/chains/utils'
import { useTokenSpotPrice } from 'lx/src/features/dataApi/tokenDetails/useTokenSpotPriceWrapper'
import { useLocalizationContext } from 'lx/src/features/language/LocalizationContext'
import { ElementName } from 'lx/src/features/telemetry/constants'
import { TestID } from 'lx/src/test/fixtures/testIDs'
import { buildCurrencyId } from 'lx/src/utils/currencyId'
import { FiatNumberType, NumberType } from '@l.x/utils/src/format/types'
=======
/* oxlint-disable typescript/no-unnecessary-condition */

import { ApolloError } from '@apollo/client'
import { createColumnHelper } from '@tanstack/react-table'
import type { MultichainToken } from '@uniswap/client-data-api/dist/data/v1/types_pb'
import { FeatureFlags, useFeatureFlag } from '@universe/gating'
import { ReactElement, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text, useMedia } from 'ui/src'
import { useEnabledChains } from 'uniswap/src/features/chains/hooks/useEnabledChains'
import { fromGraphQLChain, toGraphQLChain } from 'uniswap/src/features/chains/utils'
import { useTokenSpotPrice } from 'uniswap/src/features/dataApi/tokenDetails/useTokenSpotPriceWrapper'
import { useLocalizationContext } from 'uniswap/src/features/language/LocalizationContext'
import { ElementName } from 'uniswap/src/features/telemetry/constants'
import { TestID } from 'uniswap/src/test/fixtures/testIDs'
import { buildCurrencyId } from 'uniswap/src/utils/currencyId'
import { FiatNumberType, NumberType } from 'utilities/src/format/types'
>>>>>>> upstream/main
import { SparklineMap } from '~/appGraphql/data/types'
import { getTokenDetailsURL, OrderDirection, unwrapToken } from '~/appGraphql/data/util'
import SparklineChart from '~/components/Charts/SparklineChart'
import { DeltaArrow } from '~/components/DeltaArrow/DeltaArrow'
import { Table } from '~/components/Table'
import { Cell } from '~/components/Table/Cell'
import { EllipsisText, TableText } from '~/components/Table/shared/TableText'
import { HeaderCell } from '~/components/Table/styled'
import { TokenSortMethod } from '~/components/Tokens/constants'
import { useExploreTablesFilterStore } from '~/pages/Explore/exploreTablesFilterStore'
<<<<<<< HEAD
import { TokenDescription } from '~/pages/Explore/tables/Tokens/TokenDescription'
import { TokenTableHeader } from '~/pages/Explore/tables/Tokens/TokenTableHeader'
import { useTokenTableSortStore } from '~/pages/Explore/tables/Tokens/tokenTableSortStore'
=======
import { useExploreParams } from '~/pages/Explore/redirects'
import { getTokenDescriptionColumnSize, TokenDescription } from '~/pages/Explore/tables/Tokens/TokenDescription'
import { TokenTableHeader } from '~/pages/Explore/tables/Tokens/TokenTableHeader'
import { useTokenTableSortStore } from '~/pages/Explore/tables/Tokens/tokenTableSortStore'
import { VolumeByNetworkPopover } from '~/pages/Explore/tables/Tokens/VolumeByNetworkPopover/VolumeByNetworkPopover'
import { multichainTokenToDisplayToken } from '~/state/explore/listTokens/utils/multichainTokenToDisplayToken'
import { getChainIdsByVolume } from '~/state/explore/listTokens/utils/multichainVolume'
>>>>>>> upstream/main
import { TokenStat } from '~/state/explore/types'
import { getChainIdFromChainUrlParam } from '~/utils/chainParams'

interface TokenTableValue {
  index: number
  token: TokenStat
<<<<<<< HEAD
=======
  mcToken: MultichainToken | undefined
>>>>>>> upstream/main
  tokenDescription: ReactElement
  percentChange1hr: ReactElement
  percentChange1d: ReactElement
  fdv: string
  volume: string
  sparkline: ReactElement
  link: string
  /** Used for pre-loading TDP with logo to extract color from */
  linkState: { preloadedLogoSrc?: string }
}

function LivePriceCell({ token }: { token?: TokenStat }) {
  const { convertFiatAmountFormatted } = useLocalizationContext()
  const chainId = token ? fromGraphQLChain(token.chain) : undefined
  const currencyId = chainId && token?.address ? buildCurrencyId(chainId, token.address) : undefined
  const livePrice = useTokenSpotPrice(currencyId)

  const price = livePrice ?? token?.price?.value
  const formatted = price ? convertFiatAmountFormatted(price, NumberType.FiatTokenPrice) : '-'

  return <TableText>{formatted}</TableText>
}

export function TokenTable({
  tokens,
  tokenSortRank,
  sparklines,
  loading,
  error,
  loadMore,
}: {
<<<<<<< HEAD
  tokens?: readonly TokenStat[]
=======
  tokens?: readonly MultichainToken[]
>>>>>>> upstream/main
  tokenSortRank: Record<string, number>
  sparklines: SparklineMap
  loading: boolean
  error?: ApolloError | boolean
  loadMore?: ({ onComplete }: { onComplete?: () => void }) => void
}) {
  const { t } = useTranslation()
  const isMultichainTokenUx = useFeatureFlag(FeatureFlags.MultichainTokenUx)
  const { convertFiatAmountFormatted, formatPercent } = useLocalizationContext()
  const { defaultChainId } = useEnabledChains()
  const { sortMethod, sortAscending } = useTokenTableSortStore((s) => ({
    sortMethod: s.sortMethod,
    sortAscending: s.sortAscending,
  }))
  const orderDirection = sortAscending ? OrderDirection.Asc : OrderDirection.Desc
  const { filterString, timePeriod } = useExploreTablesFilterStore((s) => ({
    filterString: s.filterString,
    timePeriod: s.timePeriod,
  }))
<<<<<<< HEAD

  const tokenTableValues: TokenTableValue[] | undefined = useMemo(
    () =>
      tokens?.map((token, i) => {
=======
  const chainFilter = useExploreParams().chainName

  const tokenTableValues: TokenTableValue[] | undefined = useMemo(
    () =>
      tokens?.flatMap((mcToken, i) => {
        const token = multichainTokenToDisplayToken(mcToken, timePeriod)
        if (!token) {
          return []
        }
>>>>>>> upstream/main
        const delta1hr = token.pricePercentChange1Hour?.value
        const delta1hrAbs = delta1hr !== undefined ? Math.abs(delta1hr) : undefined
        const delta1d = token.pricePercentChange1Day?.value
        const delta1dAbs = delta1d !== undefined ? Math.abs(delta1d) : undefined
<<<<<<< HEAD
        const currCurrencyId = buildCurrencyId(fromGraphQLChain(token.chain) ?? UniverseChainId.Mainnet, token.address)
        const tokenSortIndex = tokenSortRank[currCurrencyId]
=======
        const tokenSortIndex = tokenSortRank[mcToken.multichainId]
>>>>>>> upstream/main
        const chainId = getChainIdFromChainUrlParam(token.chain.toLowerCase())
        const unwrappedToken = chainId ? unwrapToken(chainId, token) : token

        const parseAmount = (amount: number | undefined, type: FiatNumberType): string => {
          return amount ? convertFiatAmountFormatted(amount, type) : '-'
        }

<<<<<<< HEAD
        return {
          index: tokenSortIndex,
          token,
          tokenDescription: <TokenDescription token={unwrappedToken} />,
          testId: `${TestID.TokenTableRowPrefix}${unwrappedToken.address}`,
          percentChange1hr: (
            <Flex row gap="$gap4" alignItems="center">
              <DeltaArrow delta={delta1hr} formattedDelta={formatPercent(delta1hrAbs)} />
              <TableText>{formatPercent(delta1hrAbs)}</TableText>
            </Flex>
          ),
          percentChange1d: (
            <Flex row gap="$gap4" alignItems="center">
              <DeltaArrow delta={delta1d} formattedDelta={formatPercent(delta1dAbs)} />
              <TableText>{formatPercent(delta1dAbs)}</TableText>
            </Flex>
          ),
          fdv: parseAmount(token.fullyDilutedValuation?.value, NumberType.FiatTokenStats),
          volume: parseAmount(token.volume?.value, NumberType.FiatTokenStats),
          sparkline: (
            <SparklineChart
              width={80}
              height={20}
              tokenData={token}
              pricePercentChange={token.pricePercentChange1Day?.value}
              sparklineMap={sparklines}
            />
          ),
          link: getTokenDetailsURL({
            address: unwrappedToken.address,
            chain: toGraphQLChain(chainId ?? defaultChainId),
          }),
          analytics: {
            elementName: ElementName.TokensTableRow,
            properties: {
              chain_id: chainId,
              token_address: token.address,
              token_symbol: token.symbol,
              token_list_index: i,
              token_list_rank: tokenSortIndex,
              token_list_length: tokens.length,
              time_frame: timePeriod,
              search_token_address_input: filterString,
            },
          },
          linkState: { preloadedLogoSrc: token.logo },
        }
      }) ?? [],
    [
=======
        return [
          {
            index: tokenSortIndex,
            token,
            mcToken,
            tokenDescription: (
              <TokenDescription
                chainFilter={chainFilter}
                chainIdsByVolume={getChainIdsByVolume(mcToken, timePeriod)}
                token={unwrappedToken}
              />
            ),
            testId: `${TestID.TokenTableRowPrefix}${unwrappedToken.address}`,
            percentChange1hr: (
              <Flex row gap="$gap4" alignItems="center">
                <DeltaArrow delta={delta1hr} formattedDelta={formatPercent(delta1hrAbs)} />
                <TableText>{formatPercent(delta1hrAbs)}</TableText>
              </Flex>
            ),
            percentChange1d: (
              <Flex row gap="$gap4" alignItems="center">
                <DeltaArrow delta={delta1d} formattedDelta={formatPercent(delta1dAbs)} />
                <TableText>{formatPercent(delta1dAbs)}</TableText>
              </Flex>
            ),
            fdv: parseAmount(token.fullyDilutedValuation?.value, NumberType.FiatTokenStats),
            volume: parseAmount(token.volume?.value, NumberType.FiatTokenStats),
            sparkline: (
              <SparklineChart
                width={80}
                height={20}
                tokenData={token}
                pricePercentChange={token.pricePercentChange1Day?.value}
                sparklineMap={sparklines}
              />
            ),
            link: getTokenDetailsURL({
              address: unwrappedToken.address,
              chain: toGraphQLChain(chainId ?? defaultChainId),
            }),
            analytics: {
              elementName: ElementName.TokensTableRow,
              properties: {
                chain_id: chainId,
                token_address: token.address,
                token_symbol: token.symbol,
                token_list_index: i,
                token_list_rank: tokenSortIndex,
                token_list_length: tokens.length,
                time_frame: timePeriod,
                search_token_address_input: filterString,
              },
            },
            linkState: { preloadedLogoSrc: token.logo },
          },
        ]
      }) ?? [],
    [
      chainFilter,
>>>>>>> upstream/main
      convertFiatAmountFormatted,
      defaultChainId,
      filterString,
      formatPercent,
      sparklines,
      timePeriod,
      tokenSortRank,
      tokens,
    ],
  )

  const showLoadingSkeleton = loading || !!error

<<<<<<< HEAD
=======
  const rowHeight = useMemo(() => (isMultichainTokenUx ? 64 : undefined), [isMultichainTokenUx])

>>>>>>> upstream/main
  const media = useMedia()
  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<TokenTableValue>()
    const filteredColumns = [
      !media.lg
        ? columnHelper.accessor((row) => row.index, {
            id: 'index',
            size: 60,
            header: () => (
              <HeaderCell justifyContent="flex-start">
                <Text variant="body3" color="$neutral2">
                  #
                </Text>
              </HeaderCell>
            ),
            cell: (index) => (
              <Cell justifyContent="flex-start" loading={showLoadingSkeleton}>
                <TableText>{index.getValue?.()}</TableText>
              </Cell>
            ),
          })
        : null,
      columnHelper.accessor((row) => row.tokenDescription, {
        id: 'tokenDescription',
<<<<<<< HEAD
        size: media.lg ? 150 : 300,
        header: () => (
          <HeaderCell justifyContent="flex-start">
            <Text variant="body3" color="$neutral2" fontWeight="500">
              {t('common.tokenName')}
=======
        size: getTokenDescriptionColumnSize(media.lg, isMultichainTokenUx),
        header: () => (
          <HeaderCell justifyContent="flex-start">
            <Text variant="body3" color="$neutral2" fontWeight="500">
              {t('explore.table.column.token')}
>>>>>>> upstream/main
            </Text>
          </HeaderCell>
        ),
        cell: (tokenDescription) => (
          <Cell justifyContent="flex-start" loading={showLoadingSkeleton} testId={TestID.NameCell}>
<<<<<<< HEAD
            <TableText>{tokenDescription.getValue?.()}</TableText>
=======
            <TableText flex={1} minWidth={0} width="100%">
              {tokenDescription.getValue?.()}
            </TableText>
>>>>>>> upstream/main
          </Cell>
        ),
      }),
      columnHelper.accessor((row) => row.token, {
        id: 'price',
        maxSize: 140,
        header: () => (
          <HeaderCell justifyContent="flex-end">
            <TokenTableHeader
              category={TokenSortMethod.PRICE}
              isCurrentSortMethod={sortMethod === TokenSortMethod.PRICE}
              direction={orderDirection}
            />
          </HeaderCell>
        ),
        cell: (tokenCell) => (
          <Cell loading={showLoadingSkeleton} testId={TestID.PriceCell} justifyContent="flex-end">
            <LivePriceCell token={tokenCell.getValue?.()} />
          </Cell>
        ),
      }),
      columnHelper.accessor((row) => row.percentChange1hr, {
        id: 'percentChange1hr',
        maxSize: 100,
        header: () => (
          <HeaderCell>
            <TokenTableHeader
              category={TokenSortMethod.HOUR_CHANGE}
              isCurrentSortMethod={sortMethod === TokenSortMethod.HOUR_CHANGE}
              direction={orderDirection}
            />
          </HeaderCell>
        ),
        cell: (percentChange1hr) => (
          <Cell loading={showLoadingSkeleton}>
            <TableText>{percentChange1hr.getValue?.()}</TableText>
          </Cell>
        ),
      }),
      columnHelper.accessor((row) => row.percentChange1d, {
        id: 'percentChange1d',
        maxSize: 120,
        header: () => (
          <HeaderCell justifyContent="flex-end">
            <TokenTableHeader
              category={TokenSortMethod.DAY_CHANGE}
              isCurrentSortMethod={sortMethod === TokenSortMethod.DAY_CHANGE}
              direction={orderDirection}
            />
          </HeaderCell>
        ),
        cell: (percentChange1d) => (
          <Cell loading={showLoadingSkeleton} justifyContent="flex-end">
            <TableText>{percentChange1d.getValue?.()}</TableText>
          </Cell>
        ),
      }),
      columnHelper.accessor((row) => row.fdv, {
        id: 'fdv',
        maxSize: 120,
        header: () => (
          <HeaderCell justifyContent="flex-end">
            <TokenTableHeader
              category={TokenSortMethod.FULLY_DILUTED_VALUATION}
              isCurrentSortMethod={sortMethod === TokenSortMethod.FULLY_DILUTED_VALUATION}
              direction={orderDirection}
            />
          </HeaderCell>
        ),
        cell: (fdv) => (
          <Cell loading={showLoadingSkeleton} justifyContent="flex-end" testId={TestID.FdvCell}>
            <EllipsisText>{fdv.getValue?.()}</EllipsisText>
          </Cell>
        ),
      }),
      columnHelper.accessor((row) => row.volume, {
        id: 'volume',
        maxSize: 150,
        header: () => (
          <HeaderCell>
            <TokenTableHeader
              category={TokenSortMethod.VOLUME}
              isCurrentSortMethod={sortMethod === TokenSortMethod.VOLUME}
              direction={orderDirection}
            />
          </HeaderCell>
        ),
<<<<<<< HEAD
        cell: (volume) => (
          <Cell loading={showLoadingSkeleton} grow testId={TestID.VolumeCell}>
            <EllipsisText>{volume.getValue?.()}</EllipsisText>
          </Cell>
        ),
=======
        cell: (volume) => {
          const row = volume.row?.original as TokenTableValue | undefined
          if (!row) {
            return null
          }
          return (
            <Cell loading={showLoadingSkeleton} grow testId={TestID.VolumeCell}>
              <VolumeByNetworkPopover mcToken={row.mcToken} timePeriod={timePeriod} volumeFormatted={row.volume}>
                <EllipsisText>{volume.getValue?.()}</EllipsisText>
              </VolumeByNetworkPopover>
            </Cell>
          )
        },
>>>>>>> upstream/main
      }),
      columnHelper.accessor((row) => row.sparkline, {
        id: 'sparkline',
        maxSize: 120,
        header: () => (
          <HeaderCell>
            <Text variant="body3" color="$neutral2" fontWeight="500">
              {t('explore.tokens.table.column.sparkline')}
            </Text>
          </HeaderCell>
        ),
        cell: (sparkline) => <Cell loading={showLoadingSkeleton}>{sparkline.getValue?.()}</Cell>,
      }),
    ]

    return filteredColumns.filter((column): column is NonNullable<(typeof filteredColumns)[number]> => Boolean(column))
<<<<<<< HEAD
  }, [orderDirection, showLoadingSkeleton, sortMethod, media, t])
=======
  }, [orderDirection, isMultichainTokenUx, showLoadingSkeleton, sortMethod, media, t, timePeriod])
>>>>>>> upstream/main

  return (
    <Table
      columns={columns}
      data={tokenTableValues}
      loading={loading}
      error={error}
      v2={isMultichainTokenUx}
<<<<<<< HEAD
=======
      rowHeight={rowHeight}
      compactRowHeight={rowHeight}
>>>>>>> upstream/main
      loadMore={loadMore}
      maxWidth={1200}
      defaultPinnedColumns={['index', 'tokenDescription']}
    />
  )
}
