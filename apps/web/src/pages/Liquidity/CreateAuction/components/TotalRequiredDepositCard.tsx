import { type Currency, type CurrencyAmount } from '@luxamm/sdk-core'
import { useTranslation } from 'react-i18next'
import { Flex, Text } from '@luxfi/ui/src'
import { useLocalizationContext } from 'lx/src/features/language/LocalizationContext'
import { NumberType } from '@luxfi/utilities/src/format/types'
import { amountToPercent } from '~/pages/Liquidity/CreateAuction/utils'

const NUM_BARS = 100
const BAR_GAP_PX = 2
const BARS = Array.from({ length: NUM_BARS }, (_, i) => i)

interface TotalRequiredDepositCardProps {
  auctionSupplyAmount: CurrencyAmount<Currency>
  postAuctionLiquidityAmount: CurrencyAmount<Currency>
  tokenTotalSupply: CurrencyAmount<Currency>
  tokenSymbol: string
}

export function TotalRequiredDepositCard({
  auctionSupplyAmount,
  postAuctionLiquidityAmount,
  tokenTotalSupply,
  tokenSymbol,
}: TotalRequiredDepositCardProps) {
  const { t } = useTranslation()
  const { formatNumberOrString } = useLocalizationContext()
  const formatAmount = (amount: CurrencyAmount<Currency>): string =>
    formatNumberOrString({
      value: amount.toExact(),
      type: NumberType.TokenQuantityStats,
      placeholder: '0',
    })

  const totalDepositAmount = auctionSupplyAmount.add(postAuctionLiquidityAmount)

  const auctionSupplyPercent = amountToPercent(tokenTotalSupply, auctionSupplyAmount)
  const totalDepositPercent = Math.min(100, amountToPercent(tokenTotalSupply, totalDepositAmount))

  const auctionBarCount = Math.min(100, Math.ceil(auctionSupplyPercent))
  const totalDepositBarCount = Math.min(100, Math.ceil(totalDepositPercent))

  const totalSupplyFormatted = formatAmount(tokenTotalSupply)
  const totalDepositFormatted = formatAmount(totalDepositAmount)
  const auctionSupplyFormatted = formatAmount(auctionSupplyAmount)
  const lpReserveFormatted = formatAmount(postAuctionLiquidityAmount)

  return (
    <Flex gap="$spacing4">
      {/* Label */}
      <Text variant="body3" color="$neutral2">
        {t('toucan.createAuction.step.configureAuction.totalRequiredDeposit')}
      </Text>

      {/* Value row */}
      <Flex row justifyContent="space-between" alignItems="flex-end">
        <Flex row gap="$spacing4" alignItems="baseline">
          <Text variant="heading3" color="$neutral1">
            {totalDepositFormatted}
          </Text>
          <Text variant="heading3" color="$neutral2">
            {tokenSymbol}
          </Text>
        </Flex>
        <Text variant="body4" color="$neutral2">
          {t('toucan.createAuction.step.configureAuction.totalRequiredDeposit.totalSupply', {
            amount: totalSupplyFormatted,
          })}
        </Text>
      </Flex>

      {/* Segmented bar: solid fill for auction supply, individual bars for LP reserve */}
      <Flex height="$spacing24" position="relative" pointerEvents="none" mt="$spacing4">
        {/* Bar track — each bar colored based on zone */}
        <Flex position="absolute" left={0} right={0} top={0} height="$spacing24" row gap={BAR_GAP_PX}>
          {BARS.map((i) => {
            const isLpZone = i >= auctionBarCount && i < totalDepositBarCount
            return (
              <Flex
                key={i}
                flex={1}
                height="$spacing24"
                borderRadius="$rounded8"
                backgroundColor={isLpZone ? '$statusSuccess' : '$surface3'}
              />
            )
          })}
        </Flex>

        {/* Solid fill for auction supply zone */}
        {auctionSupplyPercent > 0 && (
          <Flex
            position="absolute"
            left={0}
            top={0}
            width={`calc(${auctionBarCount}% + ${(auctionBarCount * BAR_GAP_PX) / NUM_BARS - BAR_GAP_PX}px)`}
            height="$spacing24"
            borderRadius="$rounded4"
            backgroundColor="$statusSuccess"
            pointerEvents="none"
          />
        )}
      </Flex>

      {/* Legend */}
      <Flex row gap="$spacing16" mt="$spacing4">
        <Flex row gap="$spacing6" alignItems="center">
          <Flex width={8} height={8} borderRadius="$roundedFull" backgroundColor="$statusSuccess" />
          <Text variant="body4" color="$neutral2">
            {t('toucan.createAuction.step.configureAuction.totalRequiredDeposit.supplied', {
              amount: auctionSupplyFormatted,
            })}
          </Text>
        </Flex>
        <Flex row gap="$spacing6" alignItems="center">
          <Flex width={4} height={12} borderRadius="$rounded4" backgroundColor="$statusSuccess" />
          <Text variant="body4" color="$neutral2">
            {t('toucan.createAuction.step.configureAuction.totalRequiredDeposit.reservedForLp', {
              amount: lpReserveFormatted,
            })}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}
