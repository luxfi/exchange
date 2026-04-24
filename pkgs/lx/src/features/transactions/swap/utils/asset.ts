import { Currency } from '@luxamm/sdk-core'
import { AssetType, CurrencyAsset } from '@l.x/lx/src/entities/assets'
import { currencyAddress } from '@l.x/lx/src/utils/currencyId'

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
