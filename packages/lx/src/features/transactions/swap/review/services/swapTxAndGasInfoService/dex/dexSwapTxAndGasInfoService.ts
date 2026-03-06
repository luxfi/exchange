import { SwapTxAndGasInfoService } from 'lx/src/features/transactions/swap/review/services/swapTxAndGasInfoService/swapTxAndGasInfoService'
import {
  getDEXSwapTxAndGasInfo,
  processDEXResponse,
} from 'lx/src/features/transactions/swap/review/services/swapTxAndGasInfoService/dex/utils'
import { DEXTrade } from 'lx/src/features/transactions/swap/types/trade'

export function createDEXSwapTxAndGasInfoService(): SwapTxAndGasInfoService<DEXTrade> {
  const service: SwapTxAndGasInfoService<DEXTrade> = {
    async getSwapTxAndGasInfo(params) {
      const permitData = params.trade.quote.permitData

      const swapTxInfo = processDEXResponse({ permitData })
      return getDEXSwapTxAndGasInfo({ ...params, swapTxInfo })
    },
  }

  return service
}
