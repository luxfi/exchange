import type { CurrencyInfo } from '@l.x/lx/src/features/dataApi/types'
import type { CurrencyField } from '@l.x/lx/src/types/currency'

export type TokenOptionItemProps = {
  currencyInfo: CurrencyInfo
  index: number
  numOptions: number
  currencyField: CurrencyField
}
