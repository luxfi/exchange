import { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
<<<<<<< HEAD
import { Flex, Text, useMedia } from '@l.x/ui/src'
=======
import { Flex, Text, useMedia } from 'ui/src'
>>>>>>> upstream/main
import { BidDistributionChartTab } from '~/components/Toucan/Auction/AuctionChartShared'

interface BidDistributionChartHeaderProps {
  activeTab: BidDistributionChartTab
  onTabChange: (tab: BidDistributionChartTab) => void
<<<<<<< HEAD
=======
  /** When true, show 2 tabs (combined Price & Distribution, Demand) instead of 3 */
  combinedMode?: boolean
>>>>>>> upstream/main
}

interface TabConfig {
  key: BidDistributionChartTab
  label: string
}

const preloadClearingPriceChart = () => import('~/components/Charts/ToucanChart/clearingPrice/ClearingPriceChart')
const preloadBidDistributionChart = () =>
  import('~/components/Toucan/Auction/BidDistributionChart/BidDistributionChart')

export const BidDistributionChartHeader = ({
  activeTab,
  onTabChange,
<<<<<<< HEAD
=======
  combinedMode = false,
>>>>>>> upstream/main
}: BidDistributionChartHeaderProps): JSX.Element => {
  const { t } = useTranslation()
  const media = useMedia()

  const tabVariant = media.lg ? 'subheading1' : 'heading3'

  const tabs: TabConfig[] = useMemo(
<<<<<<< HEAD
    () => [
      {
        key: BidDistributionChartTab.ClearingPrice,
        label: t('toucan.bidDistribution.tabs.clearingPriceChart'),
      },
      {
        key: BidDistributionChartTab.Demand,
        label: t('toucan.bidDistribution.tabs.demandChart'),
      },
      {
        key: BidDistributionChartTab.Distribution,
        label: t('toucan.bidDistribution.tabs.distributionChart'),
      },
    ],
    [t],
=======
    () =>
      combinedMode
        ? [
            {
              key: BidDistributionChartTab.ClearingPrice,
              label: t('toucan.bidDistribution.tabs.clearingPriceChart'),
            },
            {
              key: BidDistributionChartTab.Demand,
              label: t('toucan.bidDistribution.tabs.demandChart'),
            },
          ]
        : [
            {
              key: BidDistributionChartTab.ClearingPrice,
              label: t('toucan.bidDistribution.tabs.clearingPriceChart'),
            },
            {
              key: BidDistributionChartTab.Demand,
              label: t('toucan.bidDistribution.tabs.demandChart'),
            },
            {
              key: BidDistributionChartTab.Distribution,
              label: t('toucan.bidDistribution.tabs.distributionChart'),
            },
          ],
    [t, combinedMode],
>>>>>>> upstream/main
  )

  const prefetchTab = useCallback((tab: BidDistributionChartTab) => {
    if (tab === BidDistributionChartTab.ClearingPrice) {
      preloadClearingPriceChart()
      return
    }
    preloadBidDistributionChart()
  }, [])

  // Preload the default tab (ClearingPrice) on mount
  useEffect(() => {
    preloadClearingPriceChart()
  }, [])

  return (
    <Flex width="100%" mb={-6}>
      <Flex row gap="$spacing16" mb="$spacing12">
        {tabs.map(({ key, label }) => {
          const isActive = activeTab === key
          return (
            <Flex
              key={key}
              cursor="pointer"
              onMouseEnter={() => prefetchTab(key)}
              onFocus={() => prefetchTab(key)}
              onPress={() => onTabChange(key)}
            >
              <Text variant={tabVariant} color={isActive ? '$neutral1' : '$neutral2'}>
                {label}
              </Text>
            </Flex>
          )
        })}
      </Flex>
    </Flex>
  )
}
