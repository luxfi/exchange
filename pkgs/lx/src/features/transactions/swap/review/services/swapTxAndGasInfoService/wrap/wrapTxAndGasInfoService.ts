import type { GasStrategy } from '@l.x/api'
import type { TransactionSettings } from '@l.x/lx/src/features/transactions/components/settings/types'
import type { EVMSwapInstructionsService } from '@l.x/lx/src/features/transactions/swap/review/services/swapTxAndGasInfoService/evm/evmSwapInstructionsService'
import { createGetEVMSwapTransactionRequestInfo } from '@l.x/lx/src/features/transactions/swap/review/services/swapTxAndGasInfoService/evm/utils'
import type { SwapTxAndGasInfoService } from '@l.x/lx/src/features/transactions/swap/review/services/swapTxAndGasInfoService/swapTxAndGasInfoService'
import { getWrapTxAndGasInfo } from '@l.x/lx/src/features/transactions/swap/review/services/swapTxAndGasInfoService/utils'
import type { UnwrapTrade, WrapTrade } from '@l.x/lx/src/features/transactions/swap/types/trade'

export function createWrapTxAndGasInfoService(ctx: {
  instructionService: EVMSwapInstructionsService
  gasStrategy: GasStrategy
  transactionSettings: TransactionSettings
  v4SwapEnabled: boolean
}): SwapTxAndGasInfoService<WrapTrade | UnwrapTrade> {
  const getEVMSwapTransactionRequestInfo = createGetEVMSwapTransactionRequestInfo(ctx)

  const service: SwapTxAndGasInfoService<WrapTrade | UnwrapTrade> = {
    async getSwapTxAndGasInfo(params) {
      const swapTxInfo = await getEVMSwapTransactionRequestInfo(params)
      return getWrapTxAndGasInfo({ ...params, swapTxInfo })
    },
  }

  return service
}
