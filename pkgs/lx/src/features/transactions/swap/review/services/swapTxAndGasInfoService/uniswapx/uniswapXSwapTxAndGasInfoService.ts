import { SwapTxAndGasInfoService } from 'lx/src/features/transactions/swap/review/services/swapTxAndGasInfoService/swapTxAndGasInfoService'
import {
  getLXSwapTxAndGasInfo,
  processLXResponse,
} from 'lx/src/features/transactions/swap/review/services/swapTxAndGasInfoService/lx/utils'
import { LXTrade } from 'lx/src/features/transactions/swap/types/trade'

export function createLXSwapTxAndGasInfoService(): SwapTxAndGasInfoService<LXTrade> {
  const service: SwapTxAndGasInfoService<LXTrade> = {
    async getSwapTxAndGasInfo(params) {
      const permitData = params.trade.quote.permitData

      const swapTxInfo = processLXResponse({ permitData })
      return getLXSwapTxAndGasInfo({ ...params, swapTxInfo })
    },
  }

  return service
}
