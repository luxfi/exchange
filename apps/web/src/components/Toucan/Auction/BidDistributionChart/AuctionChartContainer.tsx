import { FeatureFlags, useFeatureFlag } from '@l.x/gating'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Flex, useIsDarkMode, useMedia } from 'ui/src'
import { ElementName } from 'uniswap/src/features/telemetry/constants'
import { logger } from 'utilities/src/logger/logger'
import ErrorBoundary from '~/components/ErrorBoundary'
import { BidDistributionChartTab } from '~/components/Toucan/Auction/AuctionChartShared'
import { ChartFooter } from '~/components/Toucan/Auction/BidDistributionChart/BidDistributionChartFooter'
import { BidDistributionChartHeader } from '~/components/Toucan/Auction/BidDistributionChart/BidDistributionChartHeader'
import { BidDistributionChartPlaceholder } from '~/components/Toucan/Auction/BidDistributionChart/BidDistributionChartPlaceholder'
import { WithdrawModal } from '~/components/Toucan/Auction/Bids/WithdrawModal/WithdrawModal'
import { useAuctionTokenColor } from '~/components/Toucan/Auction/hooks/useAuctionTokenColor'
import { useBidFormState } from '~/components/Toucan/Auction/hooks/useBidFormState'
import { useBidTokenInfo } from '~/components/Toucan/Auction/hooks/useBidTokenInfo'
import { useWithdrawButtonState } from '~/components/Toucan/Auction/hooks/useWithdrawButtonState'
import {
  AuctionDetails,
  AuctionDetailsLoadState,
  AuctionProgressState,
  BidTokenInfo,
} from '~/components/Toucan/Auction/store/types'
import { useAuctionStore } from '~/components/Toucan/Auction/store/useAuctionStore'
import { getClearingPrice } from '~/components/Toucan/Auction/utils/clearingPrice'
import { ToucanActionButton } from '~/components/Toucan/Shared/ToucanActionButton'
import { MobileScreen, MobileScreenConfig } from '~/pages/Explore/ToucanToken'

const PLACEHOLDER_HEIGHT = 400

enum AuctionChartName {
  ClearingPrice = 'ClearingPriceChart',
  BidDistribution = 'BidDistributionChart',
  BidDemand = 'BidDemandChart',
const CombinedChartErrorFallback = createChartErrorFallback(AuctionChartName.Combined)

const LazyClearingPriceChart = lazy(async () => {
  const module = await import('~/components/Charts/ToucanChart/clearingPrice/ClearingPriceChart')
  return { default: module.ClearingPriceChart }
})

const LazyBidDistributionChart = lazy(async () => {
  const module = await import('~/components/Toucan/Auction/BidDistributionChart/BidDistributionChart')
  return { default: module.BidDistributionChart }
})

  const isV2 = useFeatureFlag(FeatureFlags.AuctionDetailsV2)
  const { auctionDetails, auctionDetailsLoadState, auctionProgressState, isGraduated, currentBlockNumber } =
    useAuctionStore((state) => ({
      auctionDetails: state.auctionDetails,
      auctionDetailsLoadState: state.auctionDetailsLoadState,
      auctionProgressState: state.progress.state,
      isGraduated: state.progress.isGraduated,
      currentBlockNumber: state.currentBlockNumber,
    }))
  const { effectiveTokenColor } = useAuctionTokenColor()
  const media = useMedia()
  const { t } = useTranslation()
  const [groupingToggleDisabled, setGroupingToggleDisabled] = useState(true)
  const isDarkMode = useIsDarkMode()
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)

  const {
    bidTokenInfo,
    loading: bidTokenLoading,
    error: bidTokenError,
  } = useBidTokenInfo({
    bidTokenAddress: auctionDetails?.currency,
    chainId: auctionDetails?.chainId,
  })

  const { canPlaceBid, hasUserBids, showMobileWithdrawButton } = useBidFormState()

  // Withdraw button state for $lg inline button (not $sm - that uses fixed bottom button)
  const {
    label: withdrawLabel,
    isDisabled: isWithdrawDisabled,
    disabledTooltip: withdrawDisabledTooltip,
  } = useWithdrawButtonState({
    isGraduated,
    claimBlock: auctionDetails?.claimBlock,
    currentBlockNumber,
    chainId: auctionDetails?.chainId,
  })

  const renderPlaceholder = (text: string) => (
    <Flex maxWidth={780} width="100%" gap="$spacing16" alignItems="center" justifyContent="center" py="$spacing48">
      <BidDistributionChartPlaceholder height={PLACEHOLDER_HEIGHT}>{text}</BidDistributionChartPlaceholder>
    </Flex>
  )

  // Handle auction-level error states (before we need bid data)
  if (auctionDetailsLoadState === AuctionDetailsLoadState.NotFound) {
    return renderPlaceholder(t('toucan.auction.notFound'))
  }

  if (auctionDetailsLoadState === AuctionDetailsLoadState.Error) {
    return renderPlaceholder(t('toucan.auction.errorLoading'))
  }

  if (
    auctionDetailsLoadState === AuctionDetailsLoadState.Success &&
    auctionProgressState === AuctionProgressState.NOT_STARTED
  ) {
    return renderPlaceholder(t('toucan.auction.notStarted'))
  }

  if (bidTokenError) {
    return renderPlaceholder(t('toucan.auction.errorLoading'))
  }

  const isLoadingSharedDeps =
    auctionDetailsLoadState !== AuctionDetailsLoadState.Success || bidTokenLoading || !auctionDetails || !bidTokenInfo

  if (isLoadingSharedDeps) {
    return renderPlaceholder(t('common.loading'))
  }


function CombinedAuctionChartPanel({
  auctionDetails,
  bidTokenInfo,
  tokenColor,
}: {
  auctionDetails: AuctionDetails
  bidTokenInfo: BidTokenInfo
  tokenColor?: string
}): JSX.Element {
  return (
    <LazyCombinedAuctionChart auctionDetails={auctionDetails} bidTokenInfo={bidTokenInfo} tokenColor={tokenColor} />
  )
}
