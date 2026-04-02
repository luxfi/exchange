import { FiatOnRampCurrency } from '@l.x/lx/src/features/fiatOnRamp/types'

export type FiatOnRampModalState = {
  prefilledCurrency?: FiatOnRampCurrency
  isOfframp?: boolean
  providers?: string[]
  prefilledAmount?: string
  prefilledIsTokenInputMode?: boolean
  currencyCode?: string
}
