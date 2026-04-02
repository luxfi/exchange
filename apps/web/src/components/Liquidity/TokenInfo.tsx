import { ProtocolVersion } from '@luxamm/client-data-api/dist/data/v1/poolTypes_pb'
import { Currency, CurrencyAmount } from '@luxamm/sdk-core'
import { Flex, Text } from '@luxfi/ui/src'
import { iconSizes } from '@luxfi/ui/src/theme'
import { useLocalizationContext } from '@l.x/lx/src/features/language/LocalizationContext'
import { getSymbolDisplayText } from '@l.x/lx/src/utils/currency'
import { NumberType } from '@luxfi/utilities/src/format/types'
import { getCurrencyForProtocol } from '~/components/Liquidity/utils/currency'
import CurrencyLogo from '~/components/Logo/CurrencyLogo'

export function TokenInfo({
  currencyAmount,
  currencyUSDAmount,
  isMigrating = false,
}: {
  currencyAmount: Maybe<CurrencyAmount<Currency>>
  currencyUSDAmount: Maybe<CurrencyAmount<Currency>>
  isMigrating?: boolean
}) {
  const { formatCurrencyAmount } = useLocalizationContext()
  const currency = isMigrating
    ? getCurrencyForProtocol(currencyAmount?.currency, ProtocolVersion.V4)
    : currencyAmount?.currency

  return (
    <Flex row alignItems="center">
      <Flex grow>
        <Text variant="heading2">
          {formatCurrencyAmount({
            value: currencyAmount,
            type: NumberType.TokenNonTx,
          })}{' '}
          {getSymbolDisplayText(currency?.symbol)}
        </Text>
        <Text variant="body3" color="$neutral2">
          {formatCurrencyAmount({
            value: currencyUSDAmount,
            type: NumberType.FiatStandard,
          })}
        </Text>
      </Flex>
      <CurrencyLogo currency={currency} size={iconSizes.icon36} />
    </Flex>
  )
}
