<<<<<<< HEAD
import { Currency } from '@luxamm/sdk-core'
import { Flex, FlexProps, Text } from '@l.x/ui/src'
import { Chevron } from '@l.x/ui/src/components/icons/Chevron'
import { iconSizes } from '@l.x/ui/src/theme'
import { PortfolioBalance } from '@l.x/lx/src/features/dataApi/types'
import { useLocalizationContext } from '@l.x/lx/src/features/language/LocalizationContext'
import { NumberType } from '@l.x/utils/src/format/types'
import CurrencyLogo from '~/components/Logo/CurrencyLogo'
import { ClickableGuiStyle } from '~/theme/components/styles'
=======
import { Currency } from '@uniswap/sdk-core'
import { Flex, FlexProps, Text } from 'ui/src'
import { Chevron } from 'ui/src/components/icons/Chevron'
import { iconSizes } from 'ui/src/theme'
import { PortfolioBalance } from 'uniswap/src/features/dataApi/types'
import { useLocalizationContext } from 'uniswap/src/features/language/LocalizationContext'
import { NumberType } from 'utilities/src/format/types'
import CurrencyLogo from '~/components/Logo/CurrencyLogo'
import { ClickableTamaguiStyle } from '~/theme/components/styles'
>>>>>>> upstream/main

export const SelectTokenPanel = ({
  currency,
  balance,
  ...rest
}: {
  currency?: Currency
  balance?: PortfolioBalance
} & FlexProps) => {
  const { convertFiatAmountFormatted, formatNumberOrString } = useLocalizationContext()

  return (
    <Flex
      row
      borderRadius="$rounded20"
      backgroundColor="$surface2"
      p="$spacing16"
      gap="$spacing12"
      alignItems="center"
<<<<<<< HEAD
      {...ClickableGuiStyle}
=======
      {...ClickableTamaguiStyle}
>>>>>>> upstream/main
      {...rest}
    >
      <CurrencyLogo currency={currency} size={iconSizes.icon40} />
      <Flex grow>
        <Text color="$neutral1" loading={!currency}>
          {currency?.symbol}
        </Text>
        {balance && (
          <Flex row alignItems="center" gap="$spacing4">
            <Text color="$neutral2">
              {formatNumberOrString({ value: balance.quantity, type: NumberType.TokenNonTx })}
            </Text>
            <Text color="$neutral3">({convertFiatAmountFormatted(balance.balanceUSD, NumberType.FiatStandard)})</Text>
          </Flex>
        )}
      </Flex>
      <Chevron rotate="180deg" size="$icon.20" />
    </Flex>
  )
}
