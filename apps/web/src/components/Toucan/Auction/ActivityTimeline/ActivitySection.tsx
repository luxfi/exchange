import { FeatureFlags, useFeatureFlag } from '@universe/gating'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Skeleton, Text, TouchableArea, useMedia } from 'ui/src'
import { ActivityTimeline } from '~/components/Toucan/Auction/ActivityTimeline/ActivityTimeline'
import { AuctionDetailsModal } from '~/components/Toucan/Auction/ActivityTimeline/AuctionDetailsModal'
import { BidActivities } from '~/components/Toucan/Auction/BidActivities/BidActivities'
import { AuctionProgressState } from '~/components/Toucan/Auction/store/types'
import { useAuctionStore } from '~/components/Toucan/Auction/store/useAuctionStore'

enum ActivityTab {
  Activity = 'activity',
  Timeline = 'timeline',
}

export function ActivitySection() {
  const isV2 = useFeatureFlag(FeatureFlags.AuctionDetailsV2)
  const auctionState = useAuctionStore((state) => state.progress.state)

  // V1: just show BidActivities with no tabs
  if (!isV2) {
    return <BidActivities />
  }

  if (auctionState === AuctionProgressState.UNKNOWN) {
    return (
      <Flex width="100%" gap="$spacing16">
        <Skeleton>
          <Flex height={24} width={200} borderRadius="$rounded8" backgroundColor="$neutral3" />
        </Skeleton>
        <Skeleton>
          <Flex height={120} borderRadius="$rounded16" backgroundColor="$neutral3" />
        </Skeleton>
      </Flex>
    )
  }

  return <ActivitySectionTabs isAuctionEnded={auctionState === AuctionProgressState.ENDED} />
}

function ActivitySectionTabs({ isAuctionEnded }: { isAuctionEnded: boolean }) {
  const { t } = useTranslation()
  const media = useMedia()
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<ActivityTab>(isAuctionEnded ? ActivityTab.Timeline : ActivityTab.Activity)

  const tabVariant = media.lg ? 'subheading1' : 'heading3'

  return (
    <Flex width="100%" minWidth={0} flexShrink={1} gap="$spacing16">
      <Flex row justifyContent="space-between" alignItems="center">
        <Flex row gap="$spacing16">
          <TouchableArea onPress={() => setActiveTab(ActivityTab.Activity)}>
            <Text variant={tabVariant} color={activeTab === ActivityTab.Activity ? '$neutral1' : '$neutral2'}>
              {t('toucan.auction.latestActivity')}
            </Text>
          </TouchableArea>
          <TouchableArea onPress={() => setActiveTab(ActivityTab.Timeline)}>
            <Text variant={tabVariant} color={activeTab === ActivityTab.Timeline ? '$neutral1' : '$neutral2'}>
              {t('toucan.timeline.title')}
            </Text>
          </TouchableArea>
        </Flex>
        <TouchableArea row alignItems="center" gap="$spacing4" onPress={() => setIsDetailsModalOpen(true)}>
          <Text variant="body3" color="$neutral2" hoverStyle={{ color: '$neutral1' }}>
            {t('toucan.details.seeFullDetails')}
          </Text>
        </TouchableArea>
      </Flex>
      {activeTab === ActivityTab.Activity ? <BidActivities hideHeader /> : <ActivityTimeline />}
      <AuctionDetailsModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} />
    </Flex>
  )
}
