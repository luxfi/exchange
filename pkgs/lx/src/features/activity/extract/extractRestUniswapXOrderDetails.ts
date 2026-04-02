import {
  LXOrderType,
  LXTransaction,
  LXTransactionStatus,
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

function mapLXStatusToLocalTxStatus(status: LXTransactionStatus): TransactionStatus {
  switch (status) {
    case LXTransactionStatus.FILLED:
      return TransactionStatus.Success
    case LXTransactionStatus.OPEN:
      return TransactionStatus.Pending
    case LXTransactionStatus.CANCELLED:
      return TransactionStatus.Canceled
    case LXTransactionStatus.INSUFFICIENT_FUNDS:
      return TransactionStatus.InsufficientFunds
    case LXTransactionStatus.ERROR:
    case LXTransactionStatus.EXPIRED:
      return TransactionStatus.Failed
    default:
      return TransactionStatus.Unknown
  }
}

/**
 * Parse an LX order transaction from the REST API
 */
export default function extractRestLXOrderDetails(transaction: LXTransaction): TransactionDetails | null {
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
      routing: orderType === LXOrderType.LIMIT ? TradingApi.Routing.DUTCH_LIMIT : TradingApi.Routing.DUTCH_V2,
      chainId,
      orderHash,
      encodedOrder: encodedOrder || undefined,
      addedTime: Number(timestampMillis),
      status: mapLXStatusToLocalTxStatus(status),
      from: offerer,
      expiry: expiryMillis ? Number(expiryMillis) / 1000 : undefined,
      typeInfo:
        orderType === LXOrderType.LIMIT
          ? {
              type: TransactionType.Swap,
              tradeType: TradeType.EXACT_INPUT,
              inputCurrencyId,
              outputCurrencyId,
              inputCurrencyAmountRaw: inputTokenAmount?.raw ?? '0',
              expectedOutputCurrencyAmountRaw: outputTokenAmount?.raw ?? '0',
              minimumOutputCurrencyAmountRaw: outputTokenAmount?.raw ?? '0',
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
        file: 'extractRestLXOrderDetails',
        function: 'extractRestLXOrderDetails',
      },
    })
    return null
  }
}
