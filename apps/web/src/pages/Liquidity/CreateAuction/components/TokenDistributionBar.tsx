import { type Currency, type CurrencyAmount } from '@uniswap/sdk-core'
import { useTranslation } from 'react-i18next'
import { Flex, Text } from 'ui/src'
import { useLocalizationContext } from 'uniswap/src/features/language/LocalizationContext'
import { NumberType } from 'utilities/src/format/types'
import { amountToPercent } from '~/pages/Liquidity/CreateAuction/utils'

const BAR_GAP_PX = 2

interface TokenDistributionBarProps {
  label?: string
  auctionSupplyAmount: CurrencyAmount<Currency>
  postAuctionLiquidityAmount: CurrencyAmount<Currency>
  tokenSymbol: string
  raiseTokenSymbol: string
  color?: string
}

export function TokenDistributionBar({
  label,
  auctionSupplyAmount,
  postAuctionLiquidityAmount,
  tokenSymbol,
  raiseTokenSymbol,
  color,
}: TokenDistributionBarProps) {
  const { t } = useTranslation()
  const { formatNumberOrString } = useLocalizationContext()
  const barColor = color ?? '$statusSuccess'
  const formatAmount = (amount: CurrencyAmount<Currency>): string =>
    formatNumberOrString({
      value: amount.toExact(),
      type: NumberType.TokenQuantityStats,
      placeholder: '0',
    })

  // postAuctionLiquidityAmount covers both LP sides combined; split evenly between token-kept and raise-sold
  const lpHalfAmount = postAuctionLiquidityAmount.divide(2)
  const fundraiseAmount = auctionSupplyAmount.subtract(postAuctionLiquidityAmount)
  const fundraisePercent = amountToPercent(auctionSupplyAmount, fundraiseAmount)
  const lpHalfPercent = amountToPercent(auctionSupplyAmount, lpHalfAmount)

  const fundraiseFormatted = formatAmount(fundraiseAmount)
  const lpHalfFormatted = formatAmount(lpHalfAmount)

  const showFundraise = fundraisePercent > 0
  const showLp = lpHalfPercent > 0

  return (
    <Flex gap="$spacing8">
      {/* Label */}
      {label && (
        <Text variant="body3" color="$neutral2">
          {label}
        </Text>
      )}

      {/* Segmented bar */}
      <Flex row height="$spacing12" gap={BAR_GAP_PX}>
        {showFundraise && (
          <Flex flex={fundraisePercent} height="$spacing12" borderRadius="$rounded4" backgroundColor={barColor} />
        )}
        {showLp && (
          <Flex
            flex={lpHalfPercent}
            height="$spacing12"
            borderRadius="$rounded4"
            backgroundColor={barColor}
            overflow="hidden"
            position="relative"
          >
            <Flex
              position="absolute"
              left={0}
              right={0}
              top={0}
              bottom={0}
              backgroundColor="rgba(255, 255, 255, 0.64)"
            />
          </Flex>
        )}
        {showLp && (
          <Flex
            flex={lpHalfPercent}
            height="$spacing12"
            borderRadius="$rounded4"
            backgroundColor={barColor}
            overflow="hidden"
            position="relative"
          >
            <Flex position="absolute" left={0} right={0} top={0} bottom={0} backgroundColor="rgba(0, 0, 0, 0.54)" />
          </Flex>
        )}
      </Flex>

      {/* Legend */}
      <Flex row gap="$spacing16" flexWrap="wrap">
        {showFundraise && (
          <Flex row gap="$spacing6" alignItems="center">
            <Flex width={8} height={8} borderRadius="$roundedFull" backgroundColor={barColor} />
            <Text variant="body4" color="$neutral2">
              {t('toucan.createAuction.step.configureAuction.distribution.fundraise', {
                amount: fundraiseFormatted,
                raiseToken: raiseTokenSymbol,
              })}
            </Text>
          </Flex>
        )}
        {showLp && (
          <>
            <Flex row gap="$spacing6" alignItems="center">
              <Flex
                width={8}
                height={8}
                borderRadius="$roundedFull"
                backgroundColor={barColor}
                overflow="hidden"
                position="relative"
              >
                <Flex
                  position="absolute"
                  left={0}
                  right={0}
                  top={0}
                  bottom={0}
                  backgroundColor="rgba(255, 255, 255, 0.64)"
                />
              </Flex>
              <Text variant="body4" color="$neutral2">
                {t('toucan.createAuction.step.configureAuction.distribution.tokenLp', {
                  amount: lpHalfFormatted,
                  token: tokenSymbol,
                })}
              </Text>
            </Flex>
            <Flex row gap="$spacing6" alignItems="center">
              <Flex
                width={8}
                height={8}
                borderRadius="$roundedFull"
                backgroundColor={barColor}
                overflow="hidden"
                position="relative"
              >
                <Flex position="absolute" left={0} right={0} top={0} bottom={0} backgroundColor="rgba(0, 0, 0, 0.54)" />
              </Flex>
              <Text variant="body4" color="$neutral2">
                {t('toucan.createAuction.step.configureAuction.distribution.tokenLp', {
                  amount: lpHalfFormatted,
                  token: raiseTokenSymbol,
                })}
              </Text>
            </Flex>
          </>
        )}
      </Flex>
    </Flex>
  )
}
