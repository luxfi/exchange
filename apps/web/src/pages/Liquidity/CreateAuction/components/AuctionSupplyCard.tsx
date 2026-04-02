import { type Currency, type CurrencyAmount } from '@luxamm/sdk-core'
import { useTranslation } from 'react-i18next'
import { Flex, Text, TouchableArea } from '@luxfi/ui/src'
import { useLocalizationContext } from 'lx/src/features/language/LocalizationContext'
import { NumberType } from '@luxfi/utilities/src/format/types'
import { PercentSlider } from '~/pages/Liquidity/CreateAuction/components/PercentSlider'
import { useSliderRef } from '~/pages/Liquidity/CreateAuction/components/useSliderRef'
import { percentOfAmount } from '~/pages/Liquidity/CreateAuction/utils'

const QUICK_SELECT_PERCENTS = [1, 5, 10] as const

interface AuctionSupplyCardProps {
  auctionSupplyPercent: number
  /** LP amount as % of *auction* supply — used to derive the max allowed auction supply */
  postAuctionLiquidityPercent: number
  tokenTotalSupply: CurrencyAmount<Currency>
  onSelectPercent: (percent: number) => void
}

export function AuctionSupplyCard({
  auctionSupplyPercent,
  postAuctionLiquidityPercent,
  tokenTotalSupply,
  onSelectPercent,
}: AuctionSupplyCardProps) {
  const { t } = useTranslation()
  const { formatNumberOrString } = useLocalizationContext()
  const formatAmount = (amount: CurrencyAmount<Currency>): string =>
    formatNumberOrString({
      value: amount.toExact(),
      type: NumberType.TokenQuantityStats,
      placeholder: '0',
    })

  const maxAuctionSupplyPercent = 100 / (1 + postAuctionLiquidityPercent / 100)

  const sliderRef = useSliderRef({
    onSelectPercent,
    min: 0,
    max: maxAuctionSupplyPercent,
    scale: maxAuctionSupplyPercent,
  })

  const auctionSupplyAmount = percentOfAmount(tokenTotalSupply, auctionSupplyPercent)
  const maxAuctionAmount = percentOfAmount(tokenTotalSupply, maxAuctionSupplyPercent)
  const displayValue = formatAmount(auctionSupplyAmount)
  const maxAmountFormatted = formatAmount(maxAuctionAmount)

  const fillPercent = maxAuctionSupplyPercent > 0 ? (auctionSupplyPercent / maxAuctionSupplyPercent) * 100 : 0

  return (
    <Flex
      flex={1}
      flexBasis={0}
      backgroundColor="$surface2"
      borderWidth="$spacing1"
      borderColor="$surface3"
      borderRadius="$rounded16"
      p="$spacing12"
      gap="$spacing16"
    >
      <Flex gap="$spacing4">
        <Text variant="body3" color="$neutral2">
          {t('toucan.createAuction.step.configureAuction.auctionSupply')}
        </Text>
        <Text variant="heading3" color="$neutral1">
          {displayValue}
        </Text>
      </Flex>

      {/* Quick selects — amounts derived from fractions of max allowed supply */}
      <Flex row gap="$spacing2">
        {QUICK_SELECT_PERCENTS.map((pillPercent) => {
          const amount = percentOfAmount(tokenTotalSupply, pillPercent)
          const isActive = Math.abs(auctionSupplyPercent - pillPercent) < 0.5
          return (
            <TouchableArea
              key={pillPercent}
              flex={1}
              minWidth={0}
              backgroundColor={isActive ? '$surface3' : 'transparent'}
              borderWidth="$spacing1"
              borderColor="$surface3"
              borderRadius="$rounded16"
              px="$spacing8"
              py="$spacing6"
              alignItems="center"
              justifyContent="center"
              onPress={onSelectPercent.bind(null, pillPercent)}
            >
              <Text variant="buttonLabel4" color="$neutral1">
                {formatAmount(amount)}
              </Text>
            </TouchableArea>
          )
        })}
        <TouchableArea
          flex={1}
          backgroundColor={Math.abs(auctionSupplyPercent - maxAuctionSupplyPercent) < 0.5 ? '$surface3' : 'transparent'}
          borderWidth="$spacing1"
          borderColor="$surface3"
          borderRadius="$rounded16"
          px="$spacing8"
          py="$spacing6"
          alignItems="center"
          justifyContent="center"
          onPress={onSelectPercent.bind(null, maxAuctionSupplyPercent)}
        >
          <Text variant="buttonLabel4" color="$neutral1">
            {t('common.max')}: {maxAmountFormatted}
          </Text>
        </TouchableArea>
      </Flex>

      {/* Slider — full width = max allowed auction supply */}
      <PercentSlider fillPercent={fillPercent} fillColor="$statusSuccess" sliderRef={sliderRef} />
    </Flex>
  )
}
