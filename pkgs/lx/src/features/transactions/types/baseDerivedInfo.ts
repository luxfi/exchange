import { Currency, CurrencyAmount } from '@luxamm/sdk-core'
import { CurrencyInfo } from 'lx/src/features/dataApi/types'
import { CurrencyField } from 'lx/src/types/currency'

export type BaseDerivedInfo<TInput = CurrencyInfo> = {
  currencies: {
    [CurrencyField.INPUT]: Maybe<TInput>
  }
  currencyAmounts: {
    [CurrencyField.INPUT]: Maybe<CurrencyAmount<Currency>>
  }
  currencyBalances: {
    [CurrencyField.INPUT]: Maybe<CurrencyAmount<Currency>>
  }
  exactAmountFiat?: string
  exactAmountToken: string
  exactCurrencyField: CurrencyField
}
