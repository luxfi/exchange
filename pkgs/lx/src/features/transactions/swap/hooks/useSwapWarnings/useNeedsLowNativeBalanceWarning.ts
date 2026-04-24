import { useSelector } from 'react-redux'

import { selectHasDismissedLowNetworkTokenWarning } from '@l.x/lx/src/features/behaviorHistory/selectors'

import { DerivedSwapInfo } from '@l.x/lx/src/features/transactions/swap/types/derivedSwapInfo'
import { CurrencyField } from '@l.x/lx/src/types/currency'

export function useNeedsLowNativeBalanceWarning({
  derivedSwapInfo,
  isMax,
}: {
  derivedSwapInfo: DerivedSwapInfo
  isMax: boolean
}): boolean {
  const needsLowNativeBalanceWarning = isMax && derivedSwapInfo.currencyAmounts[CurrencyField.INPUT]?.currency.isNative
  const hasDismissedLowNetworkTokenWarning = useSelector(selectHasDismissedLowNetworkTokenWarning)
  return !!needsLowNativeBalanceWarning && !hasDismissedLowNetworkTokenWarning
}
