import { Currency } from '@luxamm/sdk-core'
import { AssetLogoBaseProps } from 'components/Logo/AssetLogo'
import { CurrencyLogo as UniverseCurrencyLogo } from 'lx/src/components/CurrencyLogo/CurrencyLogo'
import { useCurrencyInfo } from 'lx/src/features/tokens/useCurrencyInfo'
import { buildCurrencyId, currencyAddress } from 'lx/src/utils/currencyId'

export default function CurrencyLogo(
  props: AssetLogoBaseProps & {
    currency?: Currency | null
  },
) {
  const { currency, ...rest } = props

  if (!currency) {
    return null
  }

  return <_CurrencyLogo currency={currency} {...rest} />
}

const _CurrencyLogo = (
  props: AssetLogoBaseProps & {
    currency: Currency
  },
) => {
  const currencyId = buildCurrencyId(props.currency.chainId, currencyAddress(props.currency))
  const currencyInfo = useCurrencyInfo(currencyId)
  return <UniverseCurrencyLogo currencyInfo={currencyInfo} {...props} />
}
