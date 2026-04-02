import { type Currency, type CurrencyAmount } from '@luxamm/sdk-core'
import { useTranslation } from 'react-i18next'
import { Flex, Text, TouchableArea } from '@luxfi/ui/src'
import { QuestionInCircleFilled } from '@luxfi/ui/src/components/icons/QuestionInCircleFilled'
import { Tooltip } from '@luxfi/ui/src/components/tooltip/Tooltip'
import { zIndexes } from '@luxfi/ui/src/theme'
import { useLocalizationContext } from 'lx/src/features/language/LocalizationContext'
import { NumberType } from '@luxfi/utilities/src/format/types'
import { useSliderRef } from '~/pages/Liquidity/CreateAuction/components/useSliderRef'
import { percentOfAmount } from '~/pages/Liquidity/CreateAuction/utils'

const QUICK_SELECT_PERCENTS = [10, 25, 50] as const
const NUM_BARS = 100
// Static array created once at module load — prevents DOM creation/destruction on every drag event
const BARS = Array.from({ length: NUM_BARS }, (_, i) => i)
// Each bar represents 0.5% of total supply; 50% fills the full bar
const MAX_SUPPLY_PERCENT = 50

export function BootstrapAuctionSupplySection({
  auctionSupplyPercent,
  totalTokenSupply,
  tokenSymbol,
  onSelectPercent,
}: {
  auctionSupplyPercent: number
  totalTokenSupply: CurrencyAmount<Currency>
  tokenSymbol: string
  onSelectPercent: (percent: number) => void
}) {
  const { t } = useTranslation()
  const { formatNumberOrString } = useLocalizationContext()
  const formatAmount = (amount: CurrencyAmount<Currency>): string =>
    formatNumberOrString({ value: amount.toExact(), type: NumberType.TokenNonTx, placeholder: '0' })
  const sliderRef = useSliderRef({
    onSelectPercent,
    min: 0,
    max: MAX_SUPPLY_PERCENT,
    scale: MAX_SUPPLY_PERCENT,
    step: 0.5,
  })

  const computedAmount = percentOfAmount(totalTokenSupply, auctionSupplyPercent)
  const maxAuctionAmount = percentOfAmount(totalTokenSupply, MAX_SUPPLY_PERCENT)

  const displayAmount = formatAmount(computedAmount)
  const maxAuctionFormatted = formatAmount(maxAuctionAmount)
  const totalSupplyFormatted = formatAmount(totalTokenSupply)

  return (
    <Flex gap="$spacing8">
      <Flex gap="$spacing4">
        <Text variant="subheading1" color="$neutral1">
          {t('toucan.createAuction.step.configureAuction.auctionSupply')}
        </Text>
        <Text variant="body3" color="$neutral2">
          {t('toucan.createAuction.step.configureAuction.auctionSupply.description')}
        </Text>
      </Flex>
      <Flex
        backgroundColor="$surface2"
        borderWidth="$spacing1"
        borderColor="$surface3"
        borderRadius="$rounded16"
        p="$spacing16"
        gap="$spacing4"
      >
        {/* Card header: "Amount" label */}
        <Flex row justifyContent="space-between" alignItems="center">
          <Text variant="body3" color="$neutral2">
            {t('toucan.createAuction.step.configureAuction.auctionSupply.amount')}
          </Text>
        </Flex>
        <Flex gap="$spacing16">
          {/* Amount display */}
          <Flex row justifyContent="space-between" alignItems="flex-end">
            <Flex row gap="$spacing4" alignItems="baseline">
              <Text variant="heading3" color="$neutral1">
                {displayAmount}
              </Text>
              <Text variant="heading3" color="$neutral2">
                {tokenSymbol}
              </Text>
            </Flex>
            <Flex alignSelf="flex-start">
              <Tooltip placement="bottom" delay={0}>
                <Tooltip.Trigger>
                  <Flex row alignItems="center" gap="$spacing4">
                    <Text variant="body4" color="$neutral2">
                      {t('toucan.createAuction.step.configureAuction.auctionSupply.max', {
                        amount: maxAuctionFormatted,
                        ticker: tokenSymbol,
                      })}
                    </Text>
                    <QuestionInCircleFilled size="$icon.16" color="$neutral2" />
                  </Flex>
                </Tooltip.Trigger>
                <Tooltip.Content zIndex={zIndexes.overlay}>
                  <Tooltip.Arrow />
                  <Text variant="body4" color="$neutral1">
                    {t('toucan.createAuction.step.configureAuction.auctionSupply.max.tooltip', {
                      amount: totalSupplyFormatted,
                      ticker: tokenSymbol,
                    })}
                  </Text>
                </Tooltip.Content>
              </Tooltip>
            </Flex>
          </Flex>

          {/* Segmented slider */}
          <Flex ref={sliderRef} height="$spacing24" position="relative" cursor="pointer" userSelect="none">
            {/* Full-width bar track — static array, so React never creates/destroys DOM nodes on drag */}
            <Flex
              position="absolute"
              left={0}
              right={0}
              top={0}
              height="$spacing24"
              row
              justifyContent="space-between"
              pointerEvents="none"
            >
              {BARS.map((i) => (
                <Flex
                  key={i}
                  width="$spacing4"
                  height="$spacing24"
                  borderRadius="$rounded8"
                  backgroundColor="$surface3"
                />
              ))}
            </Flex>

            {/* Solid fill — 50% of total supply fills the full bar (each bar = 0.5%) */}
            {auctionSupplyPercent > 0 && (
              <Flex
                position="absolute"
                left={0}
                top={0}
                width={`${Math.min((auctionSupplyPercent / MAX_SUPPLY_PERCENT) * 100, 100)}%`}
                height="$spacing24"
                borderRadius="$rounded4"
                backgroundColor="$statusSuccess"
                pointerEvents="none"
              >
                {/* Thumb: 8×20, 2px inset from right and top */}
                <Flex
                  position="absolute"
                  width={auctionSupplyPercent <= 0.5 ? '$spacing2' : '$spacing8'}
                  height="$spacing20"
                  top="$spacing2"
                  right="$spacing2"
                  borderRadius="$rounded4"
                  backgroundColor="$white"
                />
              </Flex>
            )}
          </Flex>

          {/* Quick selects */}
          <Flex row gap="$spacing8">
            {QUICK_SELECT_PERCENTS.map((pct) => {
              const isActive = auctionSupplyPercent === pct
              return (
                <TouchableArea
                  key={pct}
                  flex={1}
                  backgroundColor={isActive ? '$surface3' : '$surface1'}
                  borderWidth="$spacing1"
                  borderColor="$surface3"
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
        </Flex>
      </Flex>
    </Flex>
  )
}
