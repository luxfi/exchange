import { useTranslation } from 'react-i18next'
import { Flex, IconButton, Popover, Text, TouchableArea } from 'ui/src'
import { CheckCircleFilled } from 'ui/src/components/icons/CheckCircleFilled'
import { RotatableChevron } from 'ui/src/components/icons/RotatableChevron'
import { PriceRangeStrategy } from '~/pages/Liquidity/CreateAuction/types'

const BAR_ICON_SIZE = 20
const BAR_WIDTH = 3
const BAR_GAP = 2

const CONCENTRATED_BAR_HEIGHTS = [0.45, 0.8, 0.6]
const FULL_RANGE_BAR_HEIGHTS = [0.6, 0.6, 0.6]

function ThreeBarsIcon({ strategy, barColor }: { strategy: PriceRangeStrategy; barColor: string }) {
  const heights =
    strategy === PriceRangeStrategy.CONCENTRATED_FULL_RANGE ? CONCENTRATED_BAR_HEIGHTS : FULL_RANGE_BAR_HEIGHTS
  return (
    <Flex row alignItems="flex-end" gap={BAR_GAP} height={BAR_ICON_SIZE} width={BAR_ICON_SIZE}>
      {heights.map((ratio, i) => (
        <Flex
          key={i}
          width={BAR_WIDTH}
          height={Math.round(ratio * BAR_ICON_SIZE)}
          backgroundColor={barColor}
          borderRadius={BAR_WIDTH / 2}
        />
      ))}
    </Flex>
  )
}

interface StrategyOptionProps {
  label: string
  strategy: PriceRangeStrategy
  isSelected: boolean
  onPress: () => void
  barColor: string
}

function StrategyOption({ label, strategy, isSelected, onPress, barColor }: StrategyOptionProps) {
  return (
    <Popover.Close asChild>
      <TouchableArea
        row
        alignItems="center"
        gap="$spacing8"
        p="$spacing8"
        backgroundColor="$transparent"
        onPress={onPress}
      >
        <ThreeBarsIcon strategy={strategy} barColor={barColor} />
        <Text variant="buttonLabel2" color="$neutral1" flex={1}>
          {label}
        </Text>
        {isSelected && <CheckCircleFilled color="$neutral1" size="$icon.20" />}
      </TouchableArea>
    </Popover.Close>
  )
}

interface PriceRangeStrategyPopoverProps {
  selectedStrategy: PriceRangeStrategy
  onStrategySelect: (strategy: PriceRangeStrategy) => void
  barColor: string
}

export function PriceRangeStrategyPopover({
  selectedStrategy,
  onStrategySelect,
  barColor,
}: PriceRangeStrategyPopoverProps) {
  const { t } = useTranslation()
  return (
    <Popover placement="bottom-end" offset={8}>
      <Popover.Trigger>
        <IconButton
          size="xsmall"
          emphasis="secondary"
          icon={<RotatableChevron direction="down" color="$neutral2" size="$icon.16" />}
        />
      </Popover.Trigger>
      <Popover.Content
        borderRadius="$rounded12"
        borderWidth="$spacing1"
        borderColor="$surface3"
        backgroundColor="$surface1"
        p="$spacing8"
        elevate
        animation={['fast', { opacity: { overshootClamping: true } }]}
        animateOnly={['transform', 'opacity']}
        enterStyle={{ scale: 0.95, opacity: 0 }}
        exitStyle={{ scale: 0.95, opacity: 0 }}
      >
        <Flex gap="$spacing4" minWidth={220}>
          <StrategyOption
            label={t('toucan.createAuction.step.customizePool.priceRange.concentratedFullRange.short')}
            strategy={PriceRangeStrategy.CONCENTRATED_FULL_RANGE}
            isSelected={selectedStrategy === PriceRangeStrategy.CONCENTRATED_FULL_RANGE}
            onPress={() => onStrategySelect(PriceRangeStrategy.CONCENTRATED_FULL_RANGE)}
            barColor={barColor}
          />
          <StrategyOption
            label={t('toucan.createAuction.step.customizePool.priceRange.fullRange')}
            strategy={PriceRangeStrategy.FULL_RANGE}
            isSelected={selectedStrategy === PriceRangeStrategy.FULL_RANGE}
            onPress={() => onStrategySelect(PriceRangeStrategy.FULL_RANGE)}
            barColor={barColor}
          />
        </Flex>
      </Popover.Content>
    </Popover>
  )
}
