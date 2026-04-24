import { useSelector } from 'react-redux'
import { selectHasDismissedBridgingWarning } from '@l.x/lx/src/features/behaviorHistory/selectors'
import type { DerivedSwapInfo } from '@l.x/lx/src/features/transactions/swap/types/derivedSwapInfo'

export function useNeedsBridgingWarning(derivedSwapInfo: DerivedSwapInfo): boolean {
  const trade = derivedSwapInfo.trade.trade
  const isCrossChainTrade = trade !== null && trade.inputAmount.currency.chainId !== trade.outputAmount.currency.chainId
  const hasDismissedBridgingWarning = useSelector(selectHasDismissedBridgingWarning)
  return isCrossChainTrade && !hasDismissedBridgingWarning
}
