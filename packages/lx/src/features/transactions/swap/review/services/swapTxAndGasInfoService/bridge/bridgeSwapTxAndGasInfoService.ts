import type { GasStrategy } from '@luxfi/api'
import type { TransactionSettings } from 'lx/src/features/transactions/components/settings/types'
import type { EVMSwapInstructionsService } from 'lx/src/features/transactions/swap/review/services/swapTxAndGasInfoService/evm/evmSwapInstructionsService'
import { createGetEVMSwapTransactionRequestInfo } from 'lx/src/features/transactions/swap/review/services/swapTxAndGasInfoService/evm/utils'
import type { SwapTxAndGasInfoService } from 'lx/src/features/transactions/swap/review/services/swapTxAndGasInfoService/swapTxAndGasInfoService'
import { getBridgeSwapTxAndGasInfo } from 'lx/src/features/transactions/swap/review/services/swapTxAndGasInfoService/utils'
import type { BridgeTrade } from 'lx/src/features/transactions/swap/types/trade'

export function createBridgeSwapTxAndGasInfoService(ctx: {
  instructionService: EVMSwapInstructionsService
  gasStrategy: GasStrategy
  transactionSettings: TransactionSettings
  v4SwapEnabled: boolean
}): SwapTxAndGasInfoService<BridgeTrade> {
  const getEVMSwapTransactionRequestInfo = createGetEVMSwapTransactionRequestInfo(ctx)

  const service: SwapTxAndGasInfoService<BridgeTrade> = {
    async getSwapTxAndGasInfo(params) {
      const swapTxInfo = await getEVMSwapTransactionRequestInfo(params)
      return getBridgeSwapTxAndGasInfo({ ...params, swapTxInfo })
    },
  }

  return service
}
