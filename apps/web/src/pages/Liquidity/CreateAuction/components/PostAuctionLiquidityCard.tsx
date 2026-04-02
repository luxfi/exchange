import { useTranslation } from 'react-i18next'
import { Flex, Text, TouchableArea } from '@luxfi/ui/src'
import { networkColors } from '@luxfi/ui/src/theme/color/colors'
import { PercentSlider } from '~/pages/Liquidity/CreateAuction/components/PercentSlider'
import { useSliderRef } from '~/pages/Liquidity/CreateAuction/components/useSliderRef'

const MIN_PERCENT = 25
const QUICK_SELECT_PERCENTS = [25, 50, 75, 100] as const

interface PostAuctionLiquidityCardProps {
  postAuctionLiquidityPercent: number
  onSelectPercent: (percent: number) => void
}

export function PostAuctionLiquidityCard({
  postAuctionLiquidityPercent,
  onSelectPercent,
}: PostAuctionLiquidityCardProps) {
  const { t } = useTranslation()

  const sliderRef = useSliderRef({ onSelectPercent, min: MIN_PERCENT, max: 100 })

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
          {t('toucan.createAuction.step.configureAuction.postAuctionLiquidity')}
        </Text>
        <Text variant="heading3" color="$neutral1">
          {`${postAuctionLiquidityPercent}%`}
        </Text>
      </Flex>

      {/* Quick selects */}
      <Flex row gap="$spacing2">
        {QUICK_SELECT_PERCENTS.map((pct) => {
          const isActive = postAuctionLiquidityPercent === pct
          return (
            <TouchableArea
              key={pct}
              flex={1}
              backgroundColor={isActive ? '$surface3' : 'transparent'}
              borderWidth="$spacing1"
              borderColor={isActive ? 'transparent' : '$surface3'}
              borderRadius="$rounded16"
              px="$spacing8"
              py="$spacing6"
              alignItems="center"
              justifyContent="center"
              onPress={onSelectPercent.bind(null, pct)}
            >
              <Text variant="buttonLabel4" color="$neutral1">
                {pct}%
              </Text>
            </TouchableArea>
          )
        })}
      </Flex>

      {/* Slider */}
      <PercentSlider
        fillPercent={postAuctionLiquidityPercent}
        fillColor={networkColors.ethereum.light}
        sliderRef={sliderRef}
      />
    </Flex>
  )
}
