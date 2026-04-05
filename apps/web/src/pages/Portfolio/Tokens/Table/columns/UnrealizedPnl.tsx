import { memo, useMemo } from 'react'
import { ColorTokens, Flex, Text } from 'ui/src'
import { Caret } from 'ui/src/components/icons/Caret'
import { MAX_REASONABLE_USD_VALUE } from 'uniswap/src/components/ProfitLoss/constants'
import { useAppFiatCurrencyInfo } from 'uniswap/src/features/fiatCurrency/hooks'
import { useLocalizationContext } from 'uniswap/src/features/language/LocalizationContext'
import { NumberType } from 'utilities/src/format/types'
import { EmptyTableCell } from '~/pages/Portfolio/EmptyTableCell'

interface UnrealizedPnlProps {
  value: number | undefined
  percent: number | undefined
  isStablecoin?: boolean
  showPercent?: boolean
}

export const UnrealizedPnl = memo(function UnrealizedPnl({
  value,
  percent,
  isStablecoin,
  showPercent = false,
}: UnrealizedPnlProps) {
  const { formatNumberOrString, formatPercent } = useLocalizationContext()
  const currency = useAppFiatCurrencyInfo()

  const hasReasonableValue = value !== undefined && Math.abs(value) <= MAX_REASONABLE_USD_VALUE
  const isPositive = hasReasonableValue ? value >= 0 : undefined
  const arrowColor: ColorTokens | undefined =
    isPositive === undefined ? undefined : isPositive ? '$statusSuccess' : '$statusCritical'

  const formattedValue = useMemo(() => {
    if (isStablecoin) {
      return formatNumberOrString({
        value: 0,
        type: NumberType.PortfolioBalance,
        currencyCode: currency.code,
      })
    }
    if (!hasReasonableValue) {
      return undefined
    }
    return formatNumberOrString({
      value,
      type: NumberType.PortfolioBalance,
      currencyCode: currency.code,
    })
  }, [isStablecoin, hasReasonableValue, value, formatNumberOrString, currency.code])

  const formattedPercent = useMemo(() => {
    if (!showPercent) {
      return undefined
    }
    if (isStablecoin) {
      return formatPercent(0)
    }
    if (!hasReasonableValue || percent === undefined) {
      return undefined
    }
    return formatPercent(Math.abs(percent))
  }, [showPercent, isStablecoin, hasReasonableValue, percent, formatPercent])

  if (!isStablecoin && !hasReasonableValue) {
    return <EmptyTableCell />
  }

  return (
    <Flex alignItems="flex-end">
      <Text variant="body3">{formattedValue}</Text>
      {formattedPercent && (
        <Flex row alignItems="center" gap="$spacing4">
          {isStablecoin ? (
            <Caret color="$neutral2" direction="n" size="$icon.16" />
          ) : (
            arrowColor && <Caret color={arrowColor} direction={isPositive ? 'n' : 's'} size="$icon.16" />
          )}
          <Text variant="body3" color="$neutral2">
            {formattedPercent}
          </Text>
        </Flex>
      )}
    </Flex>
  )
})
UnrealizedPnl.displayName = 'UnrealizedPnl'
