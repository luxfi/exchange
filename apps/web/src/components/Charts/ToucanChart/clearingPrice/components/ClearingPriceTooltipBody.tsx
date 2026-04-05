import { useMemo } from 'react'
<<<<<<< HEAD
import { Flex, Text } from '@l.x/ui/src'
import { useLocalizationContext } from '@l.x/lx/src/features/language/LocalizationContext'
import { NumberType } from '@l.x/utils/src/format/types'
import type { ClearingPriceChartPoint } from '~/components/Charts/ToucanChart/clearingPrice/types'
import type { BidTokenInfo } from '~/components/Toucan/Auction/store/types'
=======
import { useTranslation } from 'react-i18next'
import { Flex, Text } from 'ui/src'
import { useLocalizationContext } from 'uniswap/src/features/language/LocalizationContext'
import { NumberType } from 'utilities/src/format/types'
import type { ClearingPriceChartPoint } from '~/components/Charts/ToucanChart/clearingPrice/types'
import { formatTickForDisplay } from '~/components/Toucan/Auction/BidDistributionChart/utils/utils'
import type { BidTokenInfo } from '~/components/Toucan/Auction/store/types'
import { formatCompactFromRaw } from '~/components/Toucan/Auction/utils/fixedPointFdv'
import { formatTimestampToDate } from '~/components/Toucan/Auction/utils/formatting'
>>>>>>> upstream/main
import { SubscriptZeroPrice } from '~/components/Toucan/Shared/SubscriptZeroPrice'

interface ClearingPriceTooltipBodyProps {
  data: ClearingPriceChartPoint
  bidTokenInfo: BidTokenInfo
<<<<<<< HEAD
  maxFractionDigits: number
  scaleFactor: number
=======
  scaleFactor: number
  totalSupply?: string
  auctionTokenDecimals?: number
>>>>>>> upstream/main
}

/**
 * Tooltip content for the clearing price chart.
<<<<<<< HEAD
 * Displays the price in bid token (with subscript notation for small values)
 * and its fiat equivalent.
=======
 * Displays the date, price in bid token (with subscript notation for small values),
 * its fiat equivalent, and FDV when available.
>>>>>>> upstream/main
 */
export function ClearingPriceTooltipBody({
  data,
  bidTokenInfo,
  scaleFactor,
<<<<<<< HEAD
}: ClearingPriceTooltipBodyProps): JSX.Element {
=======
  totalSupply,
  auctionTokenDecimals,
}: ClearingPriceTooltipBodyProps): JSX.Element {
  const { t } = useTranslation()
>>>>>>> upstream/main
  const { convertFiatAmountFormatted } = useLocalizationContext()

  // Unscale the value (chart data is scaled for Y-axis display)
  const originalValue = data.value / scaleFactor

  const fiatValue = useMemo(() => {
    const fiatAmount = originalValue * bidTokenInfo.priceFiat
    return convertFiatAmountFormatted(fiatAmount, NumberType.FiatTokenPrice)
  }, [originalValue, bidTokenInfo.priceFiat, convertFiatAmountFormatted])

<<<<<<< HEAD
  return (
    <Flex flexDirection="column" gap="$gap2">
      <SubscriptZeroPrice
        value={originalValue}
        symbol={bidTokenInfo.symbol}
        minSignificantDigits={2}
        maxSignificantDigits={4}
        subscriptThreshold={4}
        variant="body3"
        color="$neutral1"
      />
      <Text variant="body4" color="$neutral2">
        {fiatValue}
      </Text>
=======
  const dateStr = formatTimestampToDate(BigInt(data.time))

  // FDV: price per auction token * total supply
  const fdvDisplay = useMemo(() => {
    if (!totalSupply || auctionTokenDecimals == null) {
      return null
    }
    const formattedFiat = formatTickForDisplay({
      tickValue: originalValue,
      bidTokenInfo,
      totalSupply,
      auctionTokenDecimals,
      formatter: (amount) => convertFiatAmountFormatted(amount, NumberType.FiatTokenStats),
    })

    const supply = Number(totalSupply) / 10 ** auctionTokenDecimals
    if (!supply || !Number.isFinite(supply)) {
      return null
    }
    const fdvInBidToken = originalValue * supply
    const fdvRaw = BigInt(Math.round(fdvInBidToken * 10 ** bidTokenInfo.decimals))
    const formattedBidToken = `${formatCompactFromRaw({ raw: fdvRaw, decimals: bidTokenInfo.decimals, maxFractionDigits: 1 })} ${bidTokenInfo.symbol}`

    return { fiat: formattedFiat, bidToken: formattedBidToken }
  }, [originalValue, totalSupply, auctionTokenDecimals, bidTokenInfo, convertFiatAmountFormatted])

  return (
    <Flex flexDirection="column" gap="$gap4">
      {/* Date */}
      <Text variant="body4" color="$neutral1">
        {dateStr}
      </Text>

      {/* Divider */}
      <Flex width="100%" height={1} backgroundColor="$surface3" />

      {/* Price line: "Price: $X.XX (0.00004 ETH)" */}
      <Flex row alignItems="baseline" gap="$gap4">
        <Text variant="body4" color="$neutral2">
          {t('toucan.bidDistribution.tabs.clearingPriceChart')}:
        </Text>
        <Text variant="body4" color="$neutral1">
          {fiatValue}
        </Text>
        <SubscriptZeroPrice
          prefix="("
          value={originalValue}
          symbol={`${bidTokenInfo.symbol})`}
          minSignificantDigits={2}
          maxSignificantDigits={4}
          subscriptThreshold={4}
          variant="body4"
          color="$neutral2"
        />
      </Flex>

      {/* FDV line */}
      {fdvDisplay && (
        <Flex row alignItems="baseline" gap="$gap4">
          <Text variant="body4" color="$neutral2">
            {t('stats.fdv')}:
          </Text>
          <Text variant="body4" color="$neutral1">
            {fdvDisplay.fiat}
          </Text>
          <Text variant="body4" color="$neutral2">
            ({fdvDisplay.bidToken})
          </Text>
        </Flex>
      )}
>>>>>>> upstream/main
    </Flex>
  )
}
