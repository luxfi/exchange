import { useState } from 'react'
import { Flex, Text, TouchableArea } from '@l.x/ui/src'
import type { CurrencyInfo } from '@l.x/lx/src/features/dataApi/types'
import { useLocalizationContext } from '@l.x/lx/src/features/language/LocalizationContext'
import { useUSDCValue } from '@l.x/lx/src/features/transactions/hooks/useUSDCPriceWrapper'
import type { DerivedSwapInfo } from '@l.x/lx/src/features/transactions/swap/types/derivedSwapInfo'
import type { IndicativeTrade, Trade } from '@l.x/lx/src/features/transactions/swap/types/trade'
import { getTradeAmounts } from '@l.x/lx/src/features/transactions/swap/utils/getTradeAmounts'
import { calculateRateLine, getRateToDisplay } from '@l.x/lx/src/features/transactions/swap/utils/trade'

type SwapRateRatioProps = {
  trade: Trade | IndicativeTrade | undefined | null
  derivedSwapInfo: DerivedSwapInfo<CurrencyInfo, CurrencyInfo>
  styling?: 'primary' | 'secondary'
  initialInverse?: boolean
  justifyContent?: 'flex-end' | 'flex-start'
}
export function SwapRateRatio({
  trade,
  derivedSwapInfo,
  styling = 'primary',
  initialInverse = false,
  justifyContent = 'flex-start',
}: SwapRateRatioProps): JSX.Element | null {
  const formatter = useLocalizationContext()
  const [showInverseRate, setShowInverseRate] = useState(initialInverse)

  const { outputCurrencyAmount } = getTradeAmounts(derivedSwapInfo)
  const usdAmountOut = useUSDCValue(outputCurrencyAmount)

  const latestFiatPriceFormatted = calculateRateLine({
    usdAmountOut,
    outputCurrencyAmount,
    trade,
    showInverseRate,
    formatter,
  })

  const latestRate = trade ? getRateToDisplay({ formatter, trade, showInverseRate }) : null
  const rateAmountUSD = latestFiatPriceFormatted
  const isPrimary = styling === 'primary'

  if (!trade) {
    return null
  }

  return (
    <TouchableArea
      group
      flexDirection="row"
      justifyContent={justifyContent}
      flexGrow={1}
      onPress={() => setShowInverseRate(!showInverseRate)}
    >
      <Flex row width="max-content">
        <Text
          adjustsFontSizeToFit
          $group-hover={{ color: isPrimary ? '$neutral1Hovered' : '$neutral2Hovered' }}
          color={isPrimary ? '$neutral1' : '$neutral2'}
          numberOfLines={1}
          variant="body3"
        >
          {latestRate}
        </Text>
        <Text
          $group-hover={{ color: isPrimary ? '$neutral1Hovered' : '$neutral3Hovered' }}
          color={isPrimary ? '$neutral2' : '$neutral3'}
          variant="body3"
        >
          {rateAmountUSD && ` (${rateAmountUSD})`}
        </Text>
      </Flex>
    </TouchableArea>
  )
}
