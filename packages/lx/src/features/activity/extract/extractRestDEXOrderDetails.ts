import {
  DEXOrderType,
  DEXTransaction,
  DEXTransactionStatus,
} from '@luxdex/client-data-api/dist/data/v1/types_pb'
import { TradeType } from '@luxamm/sdk-core'
import { TradingApi } from '@luxfi/api'

import {
  TransactionDetails,
  TransactionOriginType,
  TransactionStatus,
  TransactionType,
} from 'lx/src/features/transactions/types/transactionDetails'
import { buildCurrencyId } from 'lx/src/utils/currencyId'
import { logger } from 'utilities/src/logger/logger'

function mapDEXStatusToLocalTxStatus(status: DEXTransactionStatus): TransactionStatus {
  switch (status) {
    case DEXTransactionStatus.FILLED:
      return TransactionStatus.Success
    case DEXTransactionStatus.OPEN:
      return TransactionStatus.Pending
    case DEXTransactionStatus.CANCELLED:
      return TransactionStatus.Canceled
    case DEXTransactionStatus.INSUFFICIENT_FUNDS:
      return TransactionStatus.InsufficientFunds
    case DEXTransactionStatus.ERROR:
    case DEXTransactionStatus.EXPIRED:
      return TransactionStatus.Failed
    default:
      return TransactionStatus.Unknown
  }
}

/**
 * Parse a Lux X transaction from the REST API
 */
export default function extractRestDEXOrderDetails(transaction: DEXTransaction): TransactionDetails | null {
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
    } = transaction

    if (!orderHash || !chainId || !inputToken || !outputToken) {
      return null
    }

    const inputCurrencyId = buildCurrencyId(chainId, inputToken.address)
    const outputCurrencyId = buildCurrencyId(chainId, outputToken.address)

    return {
      id: orderHash,
      // TODO(CONS-722): update to only TradingApi.Routing.DUTCH_V2 once limit orders can be excluded from REST query
      routing: orderType === DEXOrderType.LIMIT ? TradingApi.Routing.DUTCH_LIMIT : TradingApi.Routing.DUTCH_V2,
      chainId,
      orderHash,
      encodedOrder: encodedOrder || undefined,
      addedTime: Number(timestampMillis),
      status: mapDEXStatusToLocalTxStatus(status),
      from: offerer, // This transaction is not on-chain, so use the offerer address as the from address
      // TODO(CONS-722): remove special limit typeInfo once limit orders can be excluded from REST query
      typeInfo:
        orderType === DEXOrderType.LIMIT
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
        file: 'extractRestDEXOrderDetails',
        function: 'extractRestDEXOrderDetails',
      },
    })
    return null
  }
}
