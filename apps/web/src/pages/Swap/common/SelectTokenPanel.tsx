import { Currency } from '@luxamm/sdk-core'
import { Flex, FlexProps, Text } from '@luxfi/ui/src'
import { Chevron } from '@luxfi/ui/src/components/icons/Chevron'
import { iconSizes } from '@luxfi/ui/src/theme'
import { PortfolioBalance } from '@luxexchange/lx/src/features/dataApi/types'
import { useLocalizationContext } from '@luxexchange/lx/src/features/language/LocalizationContext'
import { NumberType } from '@luxfi/utilities/src/format/types'
import CurrencyLogo from '~/components/Logo/CurrencyLogo'
import { ClickableGuiStyle } from '~/theme/components/styles'

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
      {...ClickableGuiStyle}
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
