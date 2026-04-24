import { Warning, WarningAction, WarningLabel, WarningSeverity } from '@l.x/lx/src/components/modals/WarningModal/types'
import { DerivedSwapInfo } from '@l.x/lx/src/features/transactions/swap/types/derivedSwapInfo'
import { CurrencyField } from '@l.x/lx/src/types/currency'

function isFormIncomplete(derivedSwapInfo: DerivedSwapInfo): boolean {
  const { currencyAmounts, currencies, exactCurrencyField } = derivedSwapInfo

  return (
    !currencies[CurrencyField.INPUT] ||
    !currencies[CurrencyField.OUTPUT] ||
    (exactCurrencyField === CurrencyField.INPUT && !currencyAmounts[CurrencyField.INPUT]) ||
    (exactCurrencyField === CurrencyField.OUTPUT && !currencyAmounts[CurrencyField.OUTPUT])
  )
}

export function getFormIncompleteWarning(derivedSwapInfo: DerivedSwapInfo): Warning | undefined {
  if (!isFormIncomplete(derivedSwapInfo)) {
    return undefined
  }

  return {
    type: WarningLabel.FormIncomplete,
    severity: WarningSeverity.None,
    action: WarningAction.DisableReview,
  }
}
