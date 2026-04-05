<<<<<<< HEAD
import { Currency } from '@luxamm/sdk-core'
import { Flex, Text } from '@l.x/ui/src'
import { ArrowDownArrowUp } from '@l.x/ui/src/components/icons/ArrowDownArrowUp'
import { useAppFiatCurrency } from '@l.x/lx/src/features/fiatCurrency/hooks'
import { useLocalizationContext } from '@l.x/lx/src/features/language/LocalizationContext'
import { NumberType } from '@l.x/utils/src/format/types'
import { ClickableGuiStyle } from '~/theme/components/styles'
=======
import { Currency } from '@uniswap/sdk-core'
import { Flex, Text } from 'ui/src'
import { ArrowDownArrowUp } from 'ui/src/components/icons/ArrowDownArrowUp'
import { useAppFiatCurrency } from 'uniswap/src/features/fiatCurrency/hooks'
import { useLocalizationContext } from 'uniswap/src/features/language/LocalizationContext'
import { NumberType } from 'utilities/src/format/types'
import { ClickableTamaguiStyle } from '~/theme/components/styles'
>>>>>>> upstream/main

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
<<<<<<< HEAD
      {...(!disabled ? ClickableGuiStyle : {})}
=======
      {...(!disabled ? ClickableTamaguiStyle : {})}
>>>>>>> upstream/main
    >
      <Text variant="body2" color="$neutral2">
        {formattedAlternateCurrency}
      </Text>
      <ArrowDownArrowUp color="$neutral2" size="$icon.16" />
    </Flex>
  )
}
