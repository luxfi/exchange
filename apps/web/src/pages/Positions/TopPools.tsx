import { ExploreStatsResponse } from '@uniswap/client-explore/dist/uniswap/explore/v1/service_pb'
import { ALL_NETWORKS_ARG } from '@l.x/api'
import { FeatureFlags, useFeatureFlag } from '@l.x/gating'
import { useTranslation } from 'react-i18next'
import { Flex, useMedia } from 'ui/src'
import { useExploreStatsQuery } from 'uniswap/src/data/rest/exploreStats'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { PoolSortFields } from '~/appGraphql/data/pools/useTopPools'
import { OrderDirection } from '~/appGraphql/data/util'
import { ExternalArrowLink } from '~/components/Liquidity/ExternalArrowLink'
import { useAccount } from '~/hooks/useAccount'
import { ExploreTablesFilterStoreContextProvider } from '~/pages/Explore/exploreTablesFilterStore'
import { TopPoolsSection } from '~/pages/Positions/TopPoolsSection'
import { useTopPoolsLegacy } from '~/state/explore/topPools'

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
