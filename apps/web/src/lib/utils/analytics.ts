<<<<<<< HEAD
import { Currency, CurrencyAmount, Percent, Price, Token } from '@luxamm/sdk-core'
import { TradingApi } from '@l.x/api'
import { SwapTradeBaseProperties } from '@l.x/lx/src/features/telemetry/types'
import { getRouteAnalyticsData, tradeRoutingToFillType } from '@l.x/lx/src/features/transactions/swap/analytics'
import { planAnalyticsToSnakeCase } from '@l.x/lx/src/features/transactions/swap/plan/types'
=======
import { Currency, CurrencyAmount, Percent, Price, Token } from '@uniswap/sdk-core'
import { TradingApi } from '@universe/api'
import { SwapTradeBaseProperties } from 'uniswap/src/features/telemetry/types'
import { getRouteAnalyticsData, tradeRoutingToFillType } from 'uniswap/src/features/transactions/swap/analytics'
import { planAnalyticsToSnakeCase } from 'uniswap/src/features/transactions/swap/plan/types'
>>>>>>> upstream/main
import {
  BridgeTrade,
  ChainedActionTrade,
  ClassicTrade,
  PriorityOrderTrade,
<<<<<<< HEAD
  LXTrade,
  LXV2Trade,
  LXV3Trade,
} from '@l.x/lx/src/features/transactions/swap/types/trade'
import { isClassic } from '@l.x/lx/src/features/transactions/swap/utils/routing'
import {
  type PlanSwapTransactionInfoFields,
  TransactionOriginType,
} from '@l.x/lx/src/features/transactions/types/transactionDetails'
import { ITraceContext } from '@l.x/utils/src/telemetry/trace/TraceContext'
import { NATIVE_CHAIN_ID } from '~/constants/tokens'
import { InterfaceTrade, OffchainOrderType, QuoteMethod, SubmittableTrade } from '~/state/routing/types'
import { isClassicTrade, isSubmittableTrade, isLXTrade } from '~/state/routing/utils'
=======
  UniswapXTrade,
  UniswapXV2Trade,
  UniswapXV3Trade,
} from 'uniswap/src/features/transactions/swap/types/trade'
import { isClassic } from 'uniswap/src/features/transactions/swap/utils/routing'
import {
  type PlanSwapTransactionInfoFields,
  TransactionOriginType,
} from 'uniswap/src/features/transactions/types/transactionDetails'
import { ITraceContext } from 'utilities/src/telemetry/trace/TraceContext'
import { NATIVE_CHAIN_ID } from '~/constants/tokens'
import { InterfaceTrade, OffchainOrderType, QuoteMethod, SubmittableTrade } from '~/state/routing/types'
import { isClassicTrade, isSubmittableTrade, isUniswapXTrade } from '~/state/routing/utils'
>>>>>>> upstream/main
import { computeRealizedPriceImpact } from '~/utils/prices'

export const getDurationUntilTimestampSeconds = (futureTimestampInSecondsSinceEpoch?: number): number | undefined => {
  if (!futureTimestampInSecondsSinceEpoch) {
    return undefined
  }
  return futureTimestampInSecondsSinceEpoch - new Date().getTime() / 1000
}

export const formatToDecimal = (
  intialNumberObject: Percent | CurrencyAmount<Token | Currency>,
  decimalPlace: number,
): number => parseFloat(intialNumberObject.toFixed(decimalPlace))

export const getTokenAddress = (currency: Currency) => (currency.isNative ? NATIVE_CHAIN_ID : currency.address)

export const formatPercentInBasisPointsNumber = (percent: Percent): number => parseFloat(percent.toFixed(2)) * 100

const formatPercentNumber = (percent: Percent): number => parseFloat(percent.toFixed(2))

export const getPriceUpdateBasisPoints = (
  prevPrice: Price<Currency, Currency>,
  newPrice: Price<Currency, Currency>,
): number => {
  const changeFraction = newPrice.subtract(prevPrice).divide(prevPrice)
  const changePercentage = new Percent(changeFraction.numerator, changeFraction.denominator)
  return formatPercentInBasisPointsNumber(changePercentage)
}

function getEstimatedNetworkFee(trade: InterfaceTrade) {
  if (isClassicTrade(trade)) {
    return trade.gasUseEstimateUSD
  }
<<<<<<< HEAD
  if (isLXTrade(trade)) {
=======
  if (isUniswapXTrade(trade)) {
>>>>>>> upstream/main
    return trade.classicGasUseEstimateUSD
  }
  return undefined
}

function tradeRoutingToOffchainOrderType(routing: TradingApi.Routing): OffchainOrderType | undefined {
  switch (routing) {
    case TradingApi.Routing.DUTCH_V2:
      return OffchainOrderType.DUTCH_V2_AUCTION
    case TradingApi.Routing.DUTCH_LIMIT:
    case TradingApi.Routing.LIMIT_ORDER:
      return OffchainOrderType.LIMIT_ORDER
    default:
      return undefined
  }
}

export function formatCommonPropertiesForTrade({
  trade,
  allowedSlippage,
  outputFeeFiatValue,
  isBatched,
  batchId,
  includedPermitTransactionStep,
}: {
<<<<<<< HEAD
  trade: InterfaceTrade | ClassicTrade | LXTrade | BridgeTrade | ChainedActionTrade
=======
  trade: InterfaceTrade | ClassicTrade | UniswapXTrade | BridgeTrade | ChainedActionTrade
>>>>>>> upstream/main
  allowedSlippage: Percent
  outputFeeFiatValue?: number
  isBatched?: boolean
  batchId?: string
  includedPermitTransactionStep?: boolean
}): SwapTradeBaseProperties {
  const isUniversalSwapFlow =
    trade instanceof ClassicTrade ||
<<<<<<< HEAD
    trade instanceof LXV2Trade ||
    trade instanceof LXV3Trade ||
=======
    trade instanceof UniswapXV2Trade ||
    trade instanceof UniswapXV3Trade ||
>>>>>>> upstream/main
    trade instanceof PriorityOrderTrade ||
    trade instanceof BridgeTrade ||
    trade instanceof ChainedActionTrade

  return {
    routing: isUniversalSwapFlow ? tradeRoutingToFillType(trade) : trade.fillType,
    type: trade.tradeType,
<<<<<<< HEAD
    ura_quote_id: isUniversalSwapFlow ? trade.quote.quote.quoteId : isLXTrade(trade) ? trade.quoteId : undefined,
=======
    ura_quote_id: isUniversalSwapFlow ? trade.quote.quote.quoteId : isUniswapXTrade(trade) ? trade.quoteId : undefined,
>>>>>>> upstream/main
    ura_request_id: isUniversalSwapFlow
      ? trade.quote.requestId
      : isSubmittableTrade(trade)
        ? trade.requestId
        : undefined,
    ura_quote_block_number: isUniversalSwapFlow
      ? isClassic(trade)
        ? trade.quote.quote.blockNumber
        : undefined
      : isClassicTrade(trade)
        ? (trade.blockNumber ?? undefined)
        : undefined,
    token_in_address: getTokenAddress(trade.inputAmount.currency),
    token_out_address: getTokenAddress(trade.outputAmount.currency),
    token_in_symbol: trade.inputAmount.currency.symbol,
    token_out_symbol: trade.outputAmount.currency.symbol,
    token_in_amount: formatToDecimal(trade.inputAmount, trade.inputAmount.currency.decimals),
    token_out_amount: formatToDecimal(trade.outputAmount, trade.outputAmount.currency.decimals),
    price_impact_basis_points:
      trade instanceof ClassicTrade || (!isUniversalSwapFlow && isClassicTrade(trade))
        ? formatPercentInBasisPointsNumber(computeRealizedPriceImpact(trade))
        : undefined,
    chain_id:
      trade.inputAmount.currency.chainId === trade.outputAmount.currency.chainId
        ? trade.inputAmount.currency.chainId
        : undefined,
    chain_id_in: trade.inputAmount.currency.chainId,
    chain_id_out: trade.outputAmount.currency.chainId,
    estimated_network_fee_usd: isUniversalSwapFlow
      ? trade instanceof ClassicTrade
        ? trade.quote.quote.gasFeeUSD
        : undefined
      : getEstimatedNetworkFee(trade)?.toString(),
    minimum_output_after_slippage:
      trade instanceof ClassicTrade
        ? trade.minAmountOut.toSignificant(6)
        : !isUniversalSwapFlow && isClassicTrade(trade)
          ? trade.minimumAmountOut(allowedSlippage).toSignificant(6)
          : undefined,
    allowed_slippage: formatPercentNumber(allowedSlippage),
    method: isUniversalSwapFlow ? undefined : getQuoteMethod(trade),
    fee_usd: outputFeeFiatValue,
    token_out_detected_tax: formatPercentNumber(trade.outputTax),
    token_in_detected_tax: formatPercentNumber(trade.inputTax),
    offchain_order_type: isUniversalSwapFlow
      ? tradeRoutingToOffchainOrderType(trade.routing)
<<<<<<< HEAD
      : isLXTrade(trade)
=======
      : isUniswapXTrade(trade)
>>>>>>> upstream/main
        ? trade.offchainOrderType
        : undefined,
    transactionOriginType: TransactionOriginType.Internal,
    is_batch: isBatched,
    batch_id: batchId,
    included_permit_transaction_step: includedPermitTransactionStep,
  }
}

export const formatSwapSignedAnalyticsEventProperties = ({
  trade,
  allowedSlippage,
  fiatValues,
  txHash,
  timeToSignSinceRequestMs,
  portfolioBalanceUsd,
  trace,
  isBatched,
  batchId,
  includedPermitTransactionStep,
  planAnalytics,
}: {
<<<<<<< HEAD
  trade: SubmittableTrade | ClassicTrade | LXTrade | BridgeTrade | ChainedActionTrade
=======
  trade: SubmittableTrade | ClassicTrade | UniswapXTrade | BridgeTrade | ChainedActionTrade
>>>>>>> upstream/main
  allowedSlippage: Percent
  fiatValues: { amountIn?: number; amountOut?: number; feeUsd?: number }
  txHash?: string
  timeToSignSinceRequestMs?: number
  portfolioBalanceUsd?: number
  trace: ITraceContext
  isBatched?: boolean
  batchId?: string
  includedPermitTransactionStep?: boolean
  planAnalytics?: PlanSwapTransactionInfoFields
}) => ({
  ...trace,
  total_balances_usd: portfolioBalanceUsd,
  transaction_hash: txHash,
  token_in_amount_usd: fiatValues.amountIn,
  token_out_amount_usd: fiatValues.amountOut,
  // measures the amount of time the user took to sign the permit message or swap tx in their wallet
  time_to_sign_since_request_ms: timeToSignSinceRequestMs,
  ...planAnalyticsToSnakeCase(planAnalytics),
  ...['routing' in trade ? getRouteAnalyticsData(trade) : undefined],
  ...formatCommonPropertiesForTrade({
    trade,
    allowedSlippage,
    outputFeeFiatValue: fiatValues.feeUsd,
    isBatched,
    batchId,
    includedPermitTransactionStep,
  }),
  // Override routing with per-step routing for plan steps
  ...(planAnalytics?.stepRouting ? { routing: planAnalytics.stepRouting } : {}),
})

function getQuoteMethod(trade: InterfaceTrade) {
<<<<<<< HEAD
  if (isLXTrade(trade)) {
=======
  if (isUniswapXTrade(trade)) {
>>>>>>> upstream/main
    return QuoteMethod.ROUTING_API
  }

  return trade.quoteMethod
}
