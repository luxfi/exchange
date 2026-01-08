import { type Currency, type CurrencyAmount, TradeType as SdkTradeType } from '@luxamm/sdk-core'
import { type DiscriminatedQuoteResponse, type GasEstimate, TradingApi } from '@luxfi/api'
import { type QuoteCurrencyData } from 'lx/src/features/transactions/swap/hooks/useTrade/parseQuoteCurrencies'
import { getGasEstimate } from 'lx/src/features/transactions/swap/services/tradeService/transformations/estimateGas'
import {
  transformTradingApiResponseToTrade,
  validateTrade,
} from 'lx/src/features/transactions/swap/utils/tradingApi'
import { CurrencyField } from 'lx/src/types/currency'
import { inXMinutesUnix } from 'utilities/src/time/time'

const DEFAULT_SWAP_VALIDITY_TIME_MINS = 30

export type QuoteWithTradeAndGasEstimate =
  | (DiscriminatedQuoteResponse & {
      gasEstimate: GasEstimate | undefined
      trade: NonNullable<ReturnType<typeof validateTrade>> | null
    })
  | null

export function transformQuoteToTrade(input: {
  quote: DiscriminatedQuoteResponse | null
  amountSpecified: Maybe<CurrencyAmount<Currency>>
  quoteCurrencyData: QuoteCurrencyData
}): QuoteWithTradeAndGasEstimate {
  if (!input.quote) {
    return null
  }

  const quoteCurrencyData = input.quoteCurrencyData
  const { currencyIn, currencyOut, requestTradeType } = quoteCurrencyData
  const exactCurrencyField =
    requestTradeType === TradingApi.TradeType.EXACT_INPUT ? CurrencyField.INPUT : CurrencyField.OUTPUT
  const tradeType =
    requestTradeType === TradingApi.TradeType.EXACT_INPUT ? SdkTradeType.EXACT_INPUT : SdkTradeType.EXACT_OUTPUT
  const gasEstimate = getGasEstimate(input.quote)

  const formattedTrade =
    currencyIn && currencyOut
      ? transformTradingApiResponseToTrade({
          currencyIn,
          currencyOut,
          tradeType,
          deadline: inXMinutesUnix(DEFAULT_SWAP_VALIDITY_TIME_MINS), // TODO(MOB-3050): set deadline as `quoteRequestArgs.deadline`
          data: input.quote,
        })
      : null

  const trade = formattedTrade
    ? validateTrade({
        trade: formattedTrade,
        currencyIn,
        currencyOut,
        exactAmount: input.amountSpecified,
        exactCurrencyField,
      })
    : null

  return {
    ...input.quote,
    gasEstimate,
    trade,
  }
}
