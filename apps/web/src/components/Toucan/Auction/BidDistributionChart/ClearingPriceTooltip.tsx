import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text } from 'ui/src'
import { useLocalizationContext } from 'uniswap/src/features/language/LocalizationContext'
import { NumberType } from 'utilities/src/format/types'
import { CLEARING_PRICE_LINE } from '~/components/Toucan/Auction/BidDistributionChart/constants'
import { useConcentrationColor } from '~/components/Toucan/Auction/BidDistributionChart/hooks/useConcentrationColor'
import { formatTickForDisplay } from '~/components/Toucan/Auction/BidDistributionChart/utils/utils'
import type { BidTokenInfo } from '~/components/Toucan/Auction/store/types'
import { SubscriptZeroPrice } from '~/components/Toucan/Shared/SubscriptZeroPrice'
import { TooltipContainer } from '~/components/Toucan/Shared/TooltipContainer'

  // Use override positions when stacked, otherwise use default calculated positions.
  // When the clearing price line is near the top of the chart, flip the tooltip below
  // the line so translateY(-100%) doesn't push it off-screen.
  const finalLeft = overrideLeft ?? state.left
  const isNearTop = overrideTop == null && state.top < TOOLTIP_FLIP_THRESHOLD
  const finalTop =
    overrideTop ??
    (isNearTop ? state.top + CLEARING_PRICE_LINE.LABEL_OFFSET_Y : state.top - CLEARING_PRICE_LINE.LABEL_OFFSET_Y)

  const getTransform = () => {
    if (flipLeft) {
      return isNearTop ? 'translateX(-100%)' : 'translate(-100%, -100%)'
    }
    return isNearTop ? 'none' : 'translateY(-100%)'
  }

  return (
    <TooltipContainer
      ref={ref}
      zIndex={3}
      minWidth={215}
      py="$spacing6"
      px="$spacing8"
      gap="$spacing8"
      style={{
        left: `${finalLeft}px`,
        top: `${finalTop}px`,
        transform: getTransform(),
      }}
    >
      {/* Header row with triangle icon and title */}
      <Flex gap="$spacing2">
        <Flex row alignItems="center" gap="$spacing4">
          <TriangleIcon />
          <Text variant="body4" color="$neutral1">
            {isAuctionEnded ? t('toucan.statsBanner.finalClearingPrice') : t('toucan.statsBanner.clearingPrice')}
          </Text>
        </Flex>
      </Flex>

      {/* Divider line */}
      <Flex width="100%" height={1} backgroundColor="$surface3" />

      {/* Info section: FDV and price */}
      <Flex gap="$spacing2">
        {/* FDV row (e.g., "(96,293.95 ETH FDV)") */}
        <Text variant="body4" color="$neutral2" lineHeight={16}>
          ({fdvDisplay} {bidTokenInfo.symbol} FDV)
        </Text>

        {/* Price row: token price + fiat value */}
        <Flex row alignItems="center" gap="$spacing4">
          <SubscriptZeroPrice
            value={clearingPriceDecimal}
            symbol={bidTokenInfo.symbol}
            minSignificantDigits={2}
            maxSignificantDigits={4}
            variant="body4"
            color="$neutral1"
          />
          <Text variant="body4" color="$neutral2" lineHeight={16}>
            {fiatDisplay}
          </Text>
        </Flex>
      </Flex>

      {/* Meta section: volume info - only show if there's bid volume at this tick */}
      {volumeAtClearingPrice > 0 && (
        <Flex gap="$spacing2">
          {/* Bid volume row: dot + "Bid vol." on left, amount on right */}
          <Flex row alignItems="center" justifyContent="space-between">
            <Flex row alignItems="center" gap="$spacing4">
              <Flex width={8} height={8} borderRadius="$roundedFull" backgroundColor={concentrationColor} />
              <Text variant="body4" color="$neutral2" lineHeight={16}>
                {t('toucan.bidDistribution.bidVol')}
              </Text>
            </Flex>
            <Text variant="body4" color="$neutral1" lineHeight={16}>
              {volumeDisplay}
            </Text>
          </Flex>
          {/* Volume percentage row */}
          <Text variant="body4" color="$neutral2" lineHeight={16}>
            {volumePercentDisplay}
          </Text>
        </Flex>
      )}
    </TooltipContainer>
  )
})

/**
 * Small triangle icon that points right (rotated 90 degrees)
 */
function TriangleIcon() {
  return (
    <svg width="6" height="5" viewBox="0 0 6 5" fill="none" style={{ transform: 'rotate(90deg)', flexShrink: 0 }}>
      <path d="M3 0L5.59808 4.5H0.401924L3 0Z" fill="currentColor" stroke="currentColor" />
    </svg>
  )
}
