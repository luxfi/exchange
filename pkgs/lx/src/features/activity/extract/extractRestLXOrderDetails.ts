import {
  LxSwapOrderType,
  LXTransaction,
  LxSwapTransactionStatus,
} from '@luxamm/client-data-api/dist/data/v1/types_pb'
import { TradeType } from '@luxamm/sdk-core'
import { TradingApi } from '@l.x/api'

import {
  TransactionDetails,
  TransactionOriginType,
  TransactionStatus,
  TransactionType,
} from 'lx/src/features/transactions/types/transactionDetails'
import { buildCurrencyId } from 'lx/src/utils/currencyId'
import { logger } from 'utilities/src/logger/logger'

function mapLXStatusToLocalTxStatus(status: LxSwapTransactionStatus): TransactionStatus {
  switch (status) {
    case LxSwapTransactionStatus.FILLED:
      return TransactionStatus.Success
    case LxSwapTransactionStatus.OPEN:
      return TransactionStatus.Pending
    case LxSwapTransactionStatus.CANCELLED:
      return TransactionStatus.Canceled
    case LxSwapTransactionStatus.INSUFFICIENT_FUNDS:
      return TransactionStatus.InsufficientFunds
    case LxSwapTransactionStatus.ERROR:
    case LxSwapTransactionStatus.EXPIRED:
      return TransactionStatus.Failed
    default:
      return TransactionStatus.Unknown
  }
}

/**
 * Parse a Lx X transaction from the REST API
 */
export default function extractRestLxSwapOrderDetails(transaction: LXTransaction): TransactionDetails | null {
  try {
    const {
      chainId,
      offerer,
      orderHash,
      timestampMillis,
      inputToken,
      inputTokenAmount,
      outputToken,
      outputTokenAmount,
      status,
      orderType,
      encodedOrder,
      expiryMillis,
    } = transaction

    if (!orderHash || !chainId || !inputToken || !outputToken) {
      return null
    }

    const inputCurrencyId = buildCurrencyId(chainId, inputToken.address)
    const outputCurrencyId = buildCurrencyId(chainId, outputToken.address)

    return {
      id: orderHash,
      // TODO(CONS-722): update to only TradingApi.Routing.DUTCH_V2 once limit orders can be excluded from REST query
      routing: orderType === LxSwapOrderType.LIMIT ? TradingApi.Routing.DUTCH_LIMIT : TradingApi.Routing.DUTCH_V2,
      chainId,
      orderHash,
      encodedOrder: encodedOrder || undefined,
      addedTime: Number(timestampMillis),
      status: mapLXStatusToLocalTxStatus(status),
      from: offerer, // This transaction is not on-chain, so use the offerer address as the from address
      expiry: expiryMillis ? Number(expiryMillis) / 1000 : undefined,
      // TODO(CONS-722): remove special limit typeInfo once limit orders can be excluded from REST query
      typeInfo:
        orderType === LxSwapOrderType.LIMIT
          ? {
              type: TransactionType.Swap,
              tradeType: TradeType.EXACT_INPUT, // Limit orders are always exact input
              inputCurrencyId,
              outputCurrencyId,
              inputCurrencyAmountRaw: inputTokenAmount?.raw ?? '0',
              expectedOutputCurrencyAmountRaw: outputTokenAmount?.raw ?? '0',
              minimumOutputCurrencyAmountRaw: outputTokenAmount?.raw ?? '0', // For limit orders, expected and minimum are the same
            }
          : {
              type: TransactionType.Swap,
              inputCurrencyId,
              outputCurrencyId,
              inputCurrencyAmountRaw: inputTokenAmount?.raw ?? '0',
              outputCurrencyAmountRaw: outputTokenAmount?.raw ?? '0',
            },
      transactionOriginType: TransactionOriginType.Internal,
    }
  } catch (error) {
    logger.error(error, {
      tags: {
        file: 'extractRestLxSwapOrderDetails',
        function: 'extractRestLxSwapOrderDetails',
      },
    })
    return null
  }
}
