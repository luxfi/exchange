import { FeatureFlags, useFeatureFlag } from '@universe/gating'
import { useTranslation } from 'react-i18next'
import { Flex, useMedia } from 'ui/src'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { PoolSortFields } from '~/appGraphql/data/pools/useTopPools'
import { OrderDirection } from '~/appGraphql/data/util'
import { ExternalArrowLink } from '~/components/Liquidity/ExternalArrowLink'
import { useAccount } from '~/hooks/useAccount'
import { ExploreTablesFilterStoreContextProvider } from '~/pages/Explore/exploreTablesFilterStore'
import { TopPoolsSection } from '~/pages/Positions/TopPoolsSection'
import { useTopPoolsLegacy } from '~/state/explore/topPools'
import { useExchangeStats } from '~/state/explore/useExchangeStats'

const MAX_BOOSTED_POOLS = 3

function TopPoolsContent({ chainId }: { chainId: UniverseChainId | null }): JSX.Element | null {
  const account = useAccount()
  const { t } = useTranslation()
  const isLPIncentivesEnabled = useFeatureFlag(FeatureFlags.LpIncentives)
  const media = useMedia()
  const isBelowXlScreen = !media.xl

  const {
    data: exploreStatsData,
    isLoading: exploreStatsLoading,
    error: exploreStatsError,
  } = useExchangeStats(chainId ?? undefined)

  const { topPools, topBoostedPools } = useTopPoolsLegacy({
    topPoolData: { data: exploreStatsData, isLoading: exploreStatsLoading, isError: !!exploreStatsError },
    sortState: { sortDirection: OrderDirection.Desc, sortBy: PoolSortFields.TVL },
  })

  const displayBoostedPools =
    topBoostedPools && topBoostedPools.length > 0 && Boolean(account.address) && isLPIncentivesEnabled
  const displayTopPools = topPools && topPools.length > 0

  if (!isBelowXlScreen) {
    return null
  }

  return (
    <Flex gap={48}>
      {displayBoostedPools && (
        <Flex gap="$gap20">
          <TopPoolsSection
            title={t('pool.top.rewards')}
            pools={topBoostedPools.slice(0, MAX_BOOSTED_POOLS)}
            isLoading={exploreStatsLoading}
          />
          <ExternalArrowLink href="/explore/pools" openInNewTab={false}>
            {t('explore.more.unichain')}
          </ExternalArrowLink>
        </Flex>
      )}
      {displayTopPools && (
        <Flex gap="$gap20">
          <TopPoolsSection title={t('pool.top.tvl')} pools={topPools} isLoading={exploreStatsLoading} />
          <ExternalArrowLink href="/explore/pools" openInNewTab={false}>
            {t('explore.more.pools')}
          </ExternalArrowLink>
        </Flex>
      )}
    </Flex>
  )
}

export function TopPools(props: { chainId: UniverseChainId | null }): JSX.Element {
  return (
    <ExploreTablesFilterStoreContextProvider>
      <TopPoolsContent {...props} />
    </ExploreTablesFilterStoreContextProvider>
  )
}
