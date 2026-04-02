import { Currency } from '@luxamm/sdk-core'
import { AssetType, CurrencyAsset } from 'lx/src/entities/assets'
import { currencyAddress } from 'lx/src/utils/currencyId'

export const currencyToAsset = (currency: Currency | undefined): CurrencyAsset | null => {
  if (!currency) {
    return null
  }

  return {
    address: currencyAddress(currency),
    chainId: currency.chainId,
    type: AssetType.Currency,
  }
}
