import { Currency } from '@luxamm/sdk-core'
import { Flex, Text } from '@luxfi/ui/src'
import { ArrowDownArrowUp } from '@luxfi/ui/src/components/icons/ArrowDownArrowUp'
import { useAppFiatCurrency } from '@luxexchange/lx/src/features/fiatCurrency/hooks'
import { useLocalizationContext } from '@luxexchange/lx/src/features/language/LocalizationContext'
import { NumberType } from '@luxfi/utilities/src/format/types'
import { ClickableGuiStyle } from '~/theme/components/styles'

export const AlternateCurrencyDisplay = ({
  inputCurrency,
  inputInFiat,
  exactAmountOut,
  disabled,
  onToggle,
}: {
  inputCurrency?: Currency
  inputInFiat: boolean
  exactAmountOut?: string
  disabled?: boolean
  onToggle: () => void
}) => {
  const { formatNumberOrString } = useLocalizationContext()
  const activeCurrency = useAppFiatCurrency()

  const formattedAlternateCurrency = inputInFiat
    ? `${formatNumberOrString({
        value: exactAmountOut || '0',
        type: NumberType.TokenNonTx,
      })} ${inputCurrency?.symbol}`
    : formatNumberOrString({
        value: exactAmountOut || '0',
        type: NumberType.PortfolioBalance,
        currencyCode: activeCurrency,
      })

  if (!inputCurrency) {
    return null
  }

  return (
    <Flex
      row
      alignItems="center"
      justifyContent="center"
      gap="$gap4"
      onPress={disabled ? undefined : onToggle}
      {...(!disabled ? ClickableGuiStyle : {})}
    >
      <Text variant="body2" color="$neutral2">
        {formattedAlternateCurrency}
      </Text>
      <ArrowDownArrowUp color="$neutral2" size="$icon.16" />
    </Flex>
  )
}
