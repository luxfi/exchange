import type { GasStrategy } from '@l.x/api'
import type { TransactionSettings } from '@l.x/lx/src/features/transactions/components/settings/types'
import type { EVMSwapInstructionsService } from '@l.x/lx/src/features/transactions/swap/review/services/swapTxAndGasInfoService/evm/evmSwapInstructionsService'
import { createGetEVMSwapTransactionRequestInfo } from '@l.x/lx/src/features/transactions/swap/review/services/swapTxAndGasInfoService/evm/utils'
import type { SwapTxAndGasInfoService } from '@l.x/lx/src/features/transactions/swap/review/services/swapTxAndGasInfoService/swapTxAndGasInfoService'
import {
  createGetPermitTxInfo,
  getClassicSwapTxAndGasInfo,
} from '@l.x/lx/src/features/transactions/swap/review/services/swapTxAndGasInfoService/utils'
import type { ClassicTrade } from '@l.x/lx/src/features/transactions/swap/types/trade'

export function createClassicSwapTxAndGasInfoService(ctx: {
  instructionService: EVMSwapInstructionsService
  gasStrategy: GasStrategy
  transactionSettings: TransactionSettings
}): SwapTxAndGasInfoService<ClassicTrade> {
  const getEVMSwapTransactionRequestInfo = createGetEVMSwapTransactionRequestInfo(ctx)
  const getPermitTxInfo = createGetPermitTxInfo(ctx)

  const service: SwapTxAndGasInfoService<ClassicTrade> = {
    async getSwapTxAndGasInfo(params) {
      const swapTxInfo = await getEVMSwapTransactionRequestInfo(params)
      const permitTxInfo = getPermitTxInfo(params.trade)

      return getClassicSwapTxAndGasInfo({ ...params, swapTxInfo, permitTxInfo })
    },
  }

  return service
}
