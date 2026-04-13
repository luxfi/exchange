/* oxlint-disable typescript/no-unnecessary-condition */
/* oxlint-disable max-lines */

import { ApolloError } from '@apollo/client'
import { createColumnHelper, Row } from '@tanstack/react-table'
import { TokenStats } from '@uniswap/client-explore/dist/uniswap/explore/v1/service_pb'
import { Percent, Token } from '@uniswap/sdk-core'
import { GraphQLApi } from '@l.x/api'
import { FeatureFlags, useFeatureFlag } from '@l.x/gating'
import { memo, ReactElement, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, styled, Text, useMedia } from 'ui/src'
import { LearnMoreLink } from 'uniswap/src/components/text/LearnMoreLink'
import { getNativeAddress } from 'uniswap/src/constants/addresses'
import { BIPS_BASE } from 'uniswap/src/constants/misc'
import { UNI } from 'uniswap/src/constants/tokens'
import { uniswapUrls } from 'uniswap/src/constants/urls'
import { useEnabledChains } from 'uniswap/src/features/chains/hooks/useEnabledChains'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { useLocalizationContext } from 'uniswap/src/features/language/LocalizationContext'
import { ElementName } from 'uniswap/src/features/telemetry/constants'
import { useCurrencyInfo } from 'uniswap/src/features/tokens/useCurrencyInfo'
import { buildCurrencyId } from 'uniswap/src/utils/currencyId'
import { NumberType } from 'utilities/src/format/types'
import { supportedChainIdFromGQLChain } from '~/appGraphql/data/chainUtils'
import { PoolSortFields, TablePool } from '~/appGraphql/data/pools/useTopPools'
import { gqlToCurrency, OrderDirection, unwrapToken } from '~/appGraphql/data/util'
import { FeeData } from '~/components/Liquidity/Create/types'
import LPIncentiveFeeStatTooltip from '~/components/Liquidity/LPIncentives/LPIncentiveFeeStatTooltip'
import { isDynamicFeeTier } from '~/components/Liquidity/utils/feeTiers'
import CurrencyLogo from '~/components/Logo/CurrencyLogo'
import { getChainUrlParam, useChainIdFromUrlParam } from '~/utils/chainParams'

const TableWrapper = styled(Flex, {
  m: '0 auto',
  maxWidth: MAX_WIDTH_MEDIA_BREAKPOINT,
})

interface PoolTableValues {
  index: number
  poolDescription: ReactElement
  tvl: string
  apr: Percent
  volume24h: string
  volume30d: string
  volOverTvl?: number
  link: string
  protocolVersion?: string
  feeTier?: FeeData
  rewardApr?: number
  token0CurrencyId?: string
  token1CurrencyId?: string
}

function PoolDescription({
  token0,
  token1,
  showMainnetNetworkLogo,
}: {
  token0?: Token | TokenStats
  token1?: Token | TokenStats
  chainId: UniverseChainId
      <DoubleCurrencyLogo currencies={currencies} size={24} showMainnetNetworkLogo={showMainnetNetworkLogo} />
      <EllipsisText>
        {token0?.symbol}/{token1?.symbol}
      </EllipsisText>
    </Flex>
  )
}

function PoolTableHeader({
  category,
  isCurrentSortMethod,
  direction,
}: {
  category: PoolSortFields
  isCurrentSortMethod: boolean
  direction: OrderDirection
}) {
  const { setSort } = usePoolTableStoreActions()
  const handleSortCategory = useCallback(() => setSort(category), [setSort, category])
  const { t } = useTranslation()

  const HEADER_DESCRIPTIONS = {
    [PoolSortFields.TVL]: t('stats.tvl'),
    [PoolSortFields.Volume24h]: t('stats.volume.1d'),
    [PoolSortFields.Volume30D]: t('pool.volume.thirtyDay'),
    [PoolSortFields.VolOverTvl]: undefined,
    [PoolSortFields.Apr]: t('pool.apr.description'),
    [PoolSortFields.RewardApr]: (
      <>
        {t('pool.incentives.merklDocs')}
        <LearnMoreLink textVariant="buttonLabel4" url={uniswapUrls.merklDocsUrl} />
      </>
    ),
  }
  const HEADER_TEXT = {
    [PoolSortFields.TVL]: t('common.totalValueLocked'),
    [PoolSortFields.Volume24h]: t('stats.volume.1d.short'),
    [PoolSortFields.Volume30D]: t('pool.volume.thirtyDay.short'),
    [PoolSortFields.Apr]: t('pool.aprText'),
    [PoolSortFields.VolOverTvl]: t('pool.volOverTvl'),
    [PoolSortFields.RewardApr]: t('pool.apr.reward'),
  }

  return (
    <Flex width="100%">
      <MouseoverTooltip
        disabled={!HEADER_DESCRIPTIONS[category]}
        size={TooltipSize.Small}
        text={<Text variant="body3">{HEADER_DESCRIPTIONS[category]}</Text>}
        placement="top"
      >
        <ClickableHeaderRow justifyContent="flex-end" onPress={handleSortCategory} group>
          {isCurrentSortMethod && <HeaderArrow orderDirection={direction} size="$icon.16" />}
          <HeaderSortText active={isCurrentSortMethod} variant="body3">
            {HEADER_TEXT[category]}
          </HeaderSortText>
        </ClickableHeaderRow>
      </MouseoverTooltip>
    </Flex>
  )
}

interface TopPoolTableProps {
  topPools?: PoolStat[]
  isLoading: boolean
  isError: boolean
  loadMore?: ({ onComplete }: { onComplete?: () => void }) => void
}
function ExploreTopPoolTableContent(): JSX.Element {
  const chainId = useChainIdFromUrlParam()
  const { sortMethod, sortAscending } = usePoolTableStore((s) => ({
    sortMethod: s.sortMethod,
    sortAscending: s.sortAscending,
  }))
  const { resetSort } = usePoolTableStoreActions()
  const selectedProtocol = useExploreTablesFilterStore((s) => s.selectedProtocol)

  useEffect(() => {
    resetSort()
  }, [resetSort])

  const { topPools, isLoading, isError, loadMore } = useTopPools({
    sortState: {
      sortBy: sortMethod,
      sortDirection: sortAscending ? OrderDirection.Asc : OrderDirection.Desc,
    },
    chainId,
    protocol: selectedProtocol,
  })

  return <TopPoolTable topPoolData={{ topPools, isLoading, isError, loadMore }} />
}

export const ExploreTopPoolTable = memo(function ExploreTopPoolTable() {
  return (
    <PoolTableStoreContextProvider>
      <ExploreTopPoolTableContent />
    </PoolTableStoreContextProvider>
  )
})

const TopPoolTable = memo(function TopPoolTable({
  topPoolData,
  pageSize = TABLE_PAGE_SIZE,
  staticSize = false,
  forcePinning = false,
}: {
  topPoolData: TopPoolTableProps
  pageSize?: number
  staticSize?: boolean
  forcePinning?: boolean
}) {
  const { topPools, isLoading, isError, loadMore: backendLoadMore } = topPoolData

  // Client-side pagination fallback (for legacy mode when loadMore is undefined)
  const { page, loadMore: clientLoadMore } = useSimplePagination()

  // Use backend loadMore if available, otherwise fall back to client-side slicing
  const effectiveLoadMore = backendLoadMore ?? clientLoadMore
  const displayedPools = backendLoadMore
    ? topPools // Backend pagination: use all fetched pools
    : topPools?.slice(0, page * pageSize) // Client-side: slice by page

  return (
    <TableWrapper data-testid="top-pools-explore-table">
      <PoolsTable
        pools={displayedPools}
        loading={isLoading}
        error={isError}
        loadMore={staticSize ? undefined : effectiveLoadMore}
        maxWidth={1200}
        forcePinning={forcePinning}
        maxHeight={staticSize ? 1000 : undefined}
      />
    </TableWrapper>
  )
})

export function PoolsTable({
  pools,
  loading,
  error,
  loadMore,
  maxWidth,
  maxHeight,
  hiddenColumns,
  forcePinning,
}: {
  pools?: TablePool[] | PoolStat[]
  loading: boolean
  error?: ApolloError | boolean
  loadMore?: ({ onComplete }: { onComplete?: () => void }) => void
  maxWidth?: number
  maxHeight?: number
  hiddenColumns?: PoolSortFields[]
  forcePinning?: boolean
}) {
  const { t } = useTranslation()
  const isLPIncentivesEnabled = useFeatureFlag(FeatureFlags.LpIncentives)
  const isMultichainTokenUx = useFeatureFlag(FeatureFlags.MultichainTokenUx)

  const { formatPercent, formatNumberOrString, convertFiatAmountFormatted } = useLocalizationContext()
  const { sortMethod, sortAscending } = usePoolTableStore((s) => ({
    sortMethod: s.sortMethod,
    sortAscending: s.sortAscending,
  }))
  const orderDirection = sortAscending ? OrderDirection.Asc : OrderDirection.Desc
  const filterString = useExploreTablesFilterStore((s) => s.filterString)
  const { defaultChainId } = useEnabledChains()

  const poolTableValues: PoolTableValues[] | undefined = useMemo(
    () =>
      pools?.map((pool, index) => {
        const poolSortRank = index + 1
        const isGqlPool = 'hash' in pool
        const chainId = supportedChainIdFromGQLChain(pool.token0?.chain as GraphQLApi.Chain) ?? defaultChainId

        const token0Address = pool.token0?.address || getNativeAddress(chainId)
        const token1Address = pool.token1?.address || getNativeAddress(chainId)
        const currency0Id =
          pool.protocolVersion === GraphQLApi.ProtocolVersion.V4 && token0Address
            ? buildCurrencyId(chainId, token0Address)
            : undefined
        const currency1Id =
          pool.protocolVersion === GraphQLApi.ProtocolVersion.V4 && token1Address
            ? buildCurrencyId(chainId, token1Address)
            : undefined

        const parseVolume = (amount: number | undefined): string => {
          return amount ? convertFiatAmountFormatted(amount, NumberType.FiatTokenStats) : '-'
        }

        return {
          index: poolSortRank,
          poolDescription: (
            <PoolDescription
              token0={unwrapToken(chainId, pool.token0) as TokenStats | Token | undefined}
              token1={unwrapToken(chainId, pool.token1) as TokenStats | Token | undefined}
              chainId={chainId}
