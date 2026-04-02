import { useSwapFormStoreDerivedSwapInfo } from 'lx/src/features/transactions/swap/stores/swapFormStore/useSwapFormStore'
import type { TradeWithStatus } from 'lx/src/features/transactions/swap/types/trade'

const getIsIndicative = (trade: TradeWithStatus): boolean => {
  return !trade.trade && Boolean(trade.indicativeTrade || trade.isIndicativeLoading)
}

export const useIsTradeIndicative = (): boolean => {
  const trade = useSwapFormStoreDerivedSwapInfo((s) => s.trade)

  return getIsIndicative(trade)
}
