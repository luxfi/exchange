import type { CurrencyInfo } from 'lx/src/features/dataApi/types'
import type { CurrencyField } from 'lx/src/types/currency'

export type TokenOptionItemProps = {
  currencyInfo: CurrencyInfo
  index: number
  numOptions: number
  currencyField: CurrencyField
}
