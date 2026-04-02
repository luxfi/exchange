import { TradingApi } from '@luxfi/api'
import { Dispatch } from 'redux'
import { TradingApiClient } from '@luxexchange/lx/src/data/apiClients/tradingApi/TradingApiClient'
import { isUniverseChainId } from '@luxexchange/lx/src/features/chains/utils'
import { transactionActions } from '@luxexchange/lx/src/features/transactions/slice'
import {
  QueuedOrderStatus,
  TransactionOriginType,
  TransactionType,
  DEXOrderDetails,
} from '@luxexchange/lx/src/features/transactions/types/transactionDetails'
import {
  convertOrderStatusToTransactionStatus,
  convertOrderTypeToRouting,
} from '@luxexchange/lx/src/features/transactions/utils/dexUtils'
import { buildCurrencyId } from '@luxexchange/lx/src/utils/currencyId'
import { logger } from '@luxfi/utilities/src/logger/logger'
import { ONE_SECOND_MS } from '@luxfi/utilities/src/time/time'
import { sleep } from '@luxfi/utilities/src/time/timing'

/**
 * Factory function that creates a handler for externally submitted DEX orders.
 * This pattern allows for better dependency injection and testability.
 */
export function createExternallySubmittedDEXOrder(ctx: {
  addTxToWatcher: (txDetails: DEXOrderDetails) => void
  fetchLatestOpenOrder: (address: string) => Promise<TradingApi.GetOrdersResponse>
  /**
   * Wait for the order to be submitted to the backend. In the case the order is not ready
   * the worst that will happen is the last order will be submitted to the transaction watcher
   * which will be ignored.
   */
  waitForOrder: (ms: number) => Promise<void>
}) {
  return async function (address: string): Promise<void> {
    await ctx.waitForOrder(ONE_SECOND_MS * 2)

    try {
      const res = await ctx.fetchLatestOpenOrder(address)
      const tx = res.orders[0]

      if (!tx) {
        // TODO consider a retry mechanism if we see this fail often. We would need a way to identify that the latest order is the one we submitted.
        return
      }

      if (!isUniverseChainId(tx.chainId)) {
        logger.error(new Error(`Invalid UniverseChainId: ${tx.chainId}`), {
          tags: { file: 'handleExternallySubmittedDEXOrder', function: 'handleExternallySubmittedDEXOrder' },
        })
        return
      }

      const universeChainId = tx.chainId

      const inputToken = tx.input
      const outputToken = tx.outputs?.[0]

      const transactionDetail: DEXOrderDetails = {
        routing: convertOrderTypeToRouting(tx.type),
        chainId: universeChainId,
        id: tx.orderId,
        from: address,
        typeInfo: {
          type: TransactionType.Swap,
          inputCurrencyId: buildCurrencyId(universeChainId, inputToken?.token ?? ''),
          outputCurrencyId: buildCurrencyId(universeChainId, outputToken?.token ?? ''),
          inputCurrencyAmountRaw: inputToken?.startAmount ?? '0',
          outputCurrencyAmountRaw: outputToken?.startAmount ?? '0',
          quoteId: tx.quoteId ?? '',
          tradeType: 0,
        },
        status: convertOrderStatusToTransactionStatus(tx.orderStatus),
        queueStatus: QueuedOrderStatus.Submitted,
        addedTime: Date.now(),
        orderHash: tx.orderId,
        transactionOriginType: TransactionOriginType.External,
      }
      ctx.addTxToWatcher(transactionDetail)
    } catch (error) {
      logger.error(error, {
        tags: { file: 'handleExternallySubmittedDEXOrder', function: 'handleExternallySubmittedDEXOrder' },
      })
    }
  }
}

/**
 * In the case of the extension, because the dex order is not initiated by the
 * extension, we need to fetch the submitted order and then manually submit it to the
 * transaction watcher to update the status.
 **/
export const handleExternallySubmittedDEXOrder = (address: string, dispatch: Dispatch): Promise<void> =>
  createExternallySubmittedDEXOrder({
    addTxToWatcher: (txDetails) => dispatch(transactionActions.addTransaction(txDetails)),
    fetchLatestOpenOrder: (address) =>
      TradingApiClient.fetchOrdersWithoutIds({ swapper: address, limit: 1, orderStatus: TradingApi.OrderStatus.OPEN }),
    waitForOrder: async (ms: number = ONE_SECOND_MS * 2): Promise<void> => {
      await sleep(ms)
    },
  })(address)
