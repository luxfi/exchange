import { call, put, SagaGenerator } from 'typed-redux-saga'
import { TradingApiClient } from '@l.x/lx/src/data/apiClients/tradingApi/TradingApiClient'
import { InterfaceEventName, SwapEventName } from '@l.x/lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from '@l.x/lx/src/features/telemetry/send'
import { SwapTradeBaseProperties } from '@l.x/lx/src/features/telemetry/types'
import { HandledTransactionInterrupt } from '@l.x/lx/src/features/transactions/errors'
import { addTransaction } from '@l.x/lx/src/features/transactions/slice'
import {
  HandleSignatureStepParams,
  HandleDEXPlanSignatureStepParams,
} from '@l.x/lx/src/features/transactions/steps/types'
import { DEXSignatureStep } from '@l.x/lx/src/features/transactions/swap/steps/signOrder'
import { LxSwapTrade } from '@l.x/lx/src/features/transactions/swap/types/trade'
import { slippageToleranceToPercent } from '@l.x/lx/src/features/transactions/swap/utils/format'
import {
  QueuedOrderStatus,
  TransactionOriginType,
  TransactionStatus,
  DEXOrderDetails,
} from '@l.x/lx/src/features/transactions/types/transactionDetails'
import { popupRegistry } from '~/components/Popups/registry'
import { PopupType } from '~/components/Popups/types'
import { formatSwapSignedAnalyticsEventProperties } from '~/lib/utils/analytics'
import {
  addTransactionBreadcrumb,
  getSwapTransactionInfo,
  handleSignatureStep,
  TransactionBreadcrumbStatus,
} from '~/state/sagas/transactions/utils'

interface HandleDEXSignatureStepParams extends HandleSignatureStepParams<DEXSignatureStep> {
  trade: LxSwapTrade
  analytics: SwapTradeBaseProperties
}

export function* handleDEXSignatureStep(params: HandleDEXSignatureStepParams) {
  const { analytics, step, trade, address } = params
  const { quote, routing } = trade.quote
  const orderHash = quote.orderId
  const chainId = trade.inputAmount.currency.chainId

  const analyticsParams: Parameters<typeof formatSwapSignedAnalyticsEventProperties>[0] = {
    trade,
    allowedSlippage: slippageToleranceToPercent(trade.slippageTolerance),
    fiatValues: {
      amountIn: analytics.token_in_amount_usd,
      amountOut: analytics.token_out_amount_usd,
      feeUsd: analytics.fee_usd,
    },
    portfolioBalanceUsd: analytics.total_balances_usd,
    trace: { ...analytics },
  }

  sendAnalyticsEvent(
    InterfaceEventName.DEXSignatureRequested,
    formatSwapSignedAnalyticsEventProperties(analyticsParams),
  )

  const signature = yield* call(handleSignatureStep, params)

  checkDeadline(step.deadline)

  const swapInfo = getSwapTransactionInfo({
    trade,
    swapStartTimestamp: analytics.swap_start_timestamp,
    transactedUSDValue: analytics.token_in_amount_usd,
  })
  addTransactionBreadcrumb({ step, data: { routing, ...swapInfo }, status: TransactionBreadcrumbStatus.InProgress })
  sendAnalyticsEvent(
    SwapEventName.SwapSigned,
    formatSwapSignedAnalyticsEventProperties({
      trade,
      allowedSlippage: slippageToleranceToPercent(trade.slippageTolerance),
      fiatValues: {
        amountIn: analytics.token_in_amount_usd,
        amountOut: analytics.token_out_amount_usd,
        feeUsd: analytics.fee_usd,
      },
      portfolioBalanceUsd: analytics.total_balances_usd,
      trace: { ...analytics },
    }),
  )

  try {
    yield* call(TradingApiClient.submitOrder, { signature, quote, routing })
  } catch (error) {
    sendAnalyticsEvent(InterfaceEventName.DEXOrderPostError, {
      ...formatSwapSignedAnalyticsEventProperties(analyticsParams),
      detail: error.message,
    })
    throw error
  }

  sendAnalyticsEvent(
    InterfaceEventName.DEXOrderSubmitted,
    formatSwapSignedAnalyticsEventProperties(analyticsParams),
  )
  const transaction: DEXOrderDetails = {
    // Use orderHash as the ID to ensure consistency with orders fetched from remote
    // This prevents duplicate orders when the same order is fetched from GraphQL
    id: orderHash,
    routing,
    orderHash,
    chainId,
    from: address,
    typeInfo: swapInfo,
    status: TransactionStatus.Pending,
    queueStatus: QueuedOrderStatus.Waiting,
    transactionOriginType: TransactionOriginType.Internal,
    addedTime: Date.now(),
    expiry: step.deadline,
    encodedOrder: trade.quote.quote.encodedOrder,
  }

  yield* put(addTransaction(transaction))

  popupRegistry.addPopup({ type: PopupType.Order, orderHash }, orderHash)
}

export function* handleDEXPlanSignatureStep(params: HandleDEXPlanSignatureStepParams): SagaGenerator<string> {
  const { step, analytics } = params

  // Check before requiring user to sign an expired deadline
  checkDeadline(step.deadline)

  sendAnalyticsEvent(InterfaceEventName.DEXSignatureRequested, { ...analytics })

  const signature = yield* call(handleSignatureStep, params)

  // Check again after user has signed to ensure they didn't sign after the deadline
  checkDeadline(step.deadline)

  sendAnalyticsEvent(SwapEventName.SwapSigned, { ...analytics })

  return signature
}

/**
 * Helper function to check a signature deadline.
 *
 * @throws {HandledTransactionInterrupt} if the deadline has expired
 * @param deadline
 */
const checkDeadline = (deadlineSeconds: number) => {
  if (Date.now() / 1000 > deadlineSeconds) {
    throw new HandledTransactionInterrupt('User signed after deadline')
  }
}
