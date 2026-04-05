<<<<<<< HEAD
import { FiatOnRampCurrency } from '@l.x/lx/src/features/fiatOnRamp/types'
=======
import { FiatOnRampCurrency } from 'uniswap/src/features/fiatOnRamp/types'
>>>>>>> upstream/main

export type FiatOnRampModalState = {
  prefilledCurrency?: FiatOnRampCurrency
  isOfframp?: boolean
  providers?: string[]
  prefilledAmount?: string
  prefilledIsTokenInputMode?: boolean
  currencyCode?: string
}
