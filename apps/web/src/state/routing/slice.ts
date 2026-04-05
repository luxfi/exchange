import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
<<<<<<< HEAD
import { Protocol } from '@luxamm/router-sdk'
import ms from 'ms'
import { InterfaceEventName } from '@l.x/lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from '@l.x/lx/src/features/telemetry/send'
import { logSwapQuoteFetch } from '@l.x/lx/src/features/transactions/swap/analytics'
import { logger } from '@l.x/utils/src/logger/logger'
import { REQUEST_SOURCE } from '@l.x/utils/src/platform/requestSource'
=======
import { Protocol } from '@uniswap/router-sdk'
import ms from 'ms'
import { InterfaceEventName } from 'uniswap/src/features/telemetry/constants'
import { sendAnalyticsEvent } from 'uniswap/src/features/telemetry/send'
import { logSwapQuoteFetch } from 'uniswap/src/features/transactions/swap/analytics'
import { logger } from 'utilities/src/logger/logger'
import { REQUEST_SOURCE } from 'utilities/src/platform/requestSource'
>>>>>>> upstream/main
import {
  ClassicAPIConfig,
  GetQuoteArgs,
  INTERNAL_ROUTER_PREFERENCE_PRICE,
  QuoteIntent,
  QuoteMethod,
  QuoteState,
  RouterPreference,
  RoutingConfig,
  TradeResult,
<<<<<<< HEAD
  DEXConfig,
  DEXPriorityOrdersConfig,
  DEXv2Config,
  DEXv3Config,
=======
  UniswapXConfig,
  UniswapXPriorityOrdersConfig,
  UniswapXv2Config,
  UniswapXv3Config,
>>>>>>> upstream/main
  URAQuoteResponse,
  URAQuoteType,
} from '~/state/routing/types'
import { isExactInput, transformQuoteToTrade } from '~/state/routing/utils'

<<<<<<< HEAD
const LUX_GATEWAY_DNS_URL = process.env.REACT_APP_LUX_GATEWAY_DNS
if (LUX_GATEWAY_DNS_URL === undefined) {
  throw new Error(`LUX_GATEWAY_DNS_URL must be defined environment variables`)
=======
const UNISWAP_GATEWAY_DNS_URL = process.env.REACT_APP_UNISWAP_GATEWAY_DNS
if (UNISWAP_GATEWAY_DNS_URL === undefined) {
  throw new Error(`UNISWAP_GATEWAY_DNS_URL must be defined environment variables`)
>>>>>>> upstream/main
}

const protocols: Protocol[] = [Protocol.V2, Protocol.V3, Protocol.MIXED]

<<<<<<< HEAD
// routing API quote query params: https://github.com/Lux/routing-api/blob/main/lib/handlers/quote/schema/quote-schema.ts
=======
// routing API quote query params: https://github.com/Uniswap/routing-api/blob/main/lib/handlers/quote/schema/quote-schema.ts
>>>>>>> upstream/main
const DEFAULT_QUERY_PARAMS = {
  // this should be removed once BE fixes issue where enableUniversalRouter is required for fees to work
  enableUniversalRouter: true,
}

function getRoutingAPIConfig(args: GetQuoteArgs): RoutingConfig {
<<<<<<< HEAD
  const { account, dexForceSyntheticQuotes, routerPreference, protocolPreferences, routingType } = args

  const dex: DEXConfig = {
    useSyntheticQuotes: dexForceSyntheticQuotes,
=======
  const { account, uniswapXForceSyntheticQuotes, routerPreference, protocolPreferences, routingType } = args

  const uniswapX: UniswapXConfig = {
    useSyntheticQuotes: uniswapXForceSyntheticQuotes,
>>>>>>> upstream/main
    swapper: account,
    routingType: URAQuoteType.DUTCH_V1,
  }

<<<<<<< HEAD
  const dexPriorityOrders: DEXPriorityOrdersConfig = {
=======
  const uniswapXPriorityOrders: UniswapXPriorityOrdersConfig = {
>>>>>>> upstream/main
    routingType: URAQuoteType.PRIORITY,
    swapper: account,
  }

<<<<<<< HEAD
  const dexV2: DEXv2Config = {
    useSyntheticQuotes: dexForceSyntheticQuotes,
=======
  const uniswapXv2: UniswapXv2Config = {
    useSyntheticQuotes: uniswapXForceSyntheticQuotes,
>>>>>>> upstream/main
    swapper: account,
    routingType: URAQuoteType.DUTCH_V2,
  }

<<<<<<< HEAD
  const dexV3: DEXv3Config = {
    useSyntheticQuotes: dexForceSyntheticQuotes,
=======
  const uniswapXv3: UniswapXv3Config = {
    useSyntheticQuotes: uniswapXForceSyntheticQuotes,
>>>>>>> upstream/main
    swapper: account,
    routingType: URAQuoteType.DUTCH_V3,
  }

  const classic: ClassicAPIConfig = {
    ...DEFAULT_QUERY_PARAMS,
    protocols: protocolPreferences && protocolPreferences.length > 0 ? protocolPreferences : protocols,
    routingType: URAQuoteType.CLASSIC,
    recipient: account,
    enableFeeOnTransferFeeFetching: true,
  }

  if (
<<<<<<< HEAD
    // If the user has opted out of DEX during the opt-out transition period, we should respect that preference and only request classic quotes.
=======
    // If the user has opted out of UniswapX during the opt-out transition period, we should respect that preference and only request classic quotes.
>>>>>>> upstream/main
    routerPreference === RouterPreference.API ||
    routerPreference === INTERNAL_ROUTER_PREFERENCE_PRICE ||
    routingType === URAQuoteType.CLASSIC
  ) {
    return [classic]
  }

<<<<<<< HEAD
  let dexConfig: DEXConfig | DEXPriorityOrdersConfig | DEXv2Config | DEXv3Config
  switch (routingType) {
    case URAQuoteType.PRIORITY:
      dexConfig = dexPriorityOrders
      break
    case URAQuoteType.DUTCH_V3:
      dexConfig = dexV3
      break
    case URAQuoteType.DUTCH_V2:
      dexConfig = dexV2
      break
    default:
      dexConfig = dex
  }

  return [dexConfig, classic]
=======
  let uniswapXConfig: UniswapXConfig | UniswapXPriorityOrdersConfig | UniswapXv2Config | UniswapXv3Config
  switch (routingType) {
    case URAQuoteType.PRIORITY:
      uniswapXConfig = uniswapXPriorityOrders
      break
    case URAQuoteType.DUTCH_V3:
      uniswapXConfig = uniswapXv3
      break
    case URAQuoteType.DUTCH_V2:
      uniswapXConfig = uniswapXv2
      break
    default:
      uniswapXConfig = uniswapX
  }

  return [uniswapXConfig, classic]
>>>>>>> upstream/main
}

export const routingApi = createApi({
  reducerPath: 'routingApi',
  baseQuery: fetchBaseQuery(),
  endpoints: (build) => ({
    getQuote: build.query<TradeResult, GetQuoteArgs>({
<<<<<<< HEAD
      // eslint-disable-next-line max-params
=======
      // oxlint-disable-next-line max-params
>>>>>>> upstream/main
      async queryFn(args, _api, _extraOptions, fetch) {
        logSwapQuoteFetch({
          chainId: args.tokenInChainId,
          isUSDQuote: args.routerPreference === INTERNAL_ROUTER_PREFERENCE_PRICE,
          quoteSource: 'routing_api',
        })
        const {
          tokenInAddress: tokenIn,
          tokenInChainId,
          tokenOutAddress: tokenOut,
          tokenOutChainId,
          amount,
          tradeType,
          sendPortionEnabled,
        } = args
        const requestBody = {
          tokenInChainId,
          tokenIn,
          tokenOutChainId,
          tokenOut,
          amount,
          sendPortionEnabled,
          type: isExactInput(tradeType) ? 'EXACT_INPUT' : 'EXACT_OUTPUT',
          intent: args.routerPreference === INTERNAL_ROUTER_PREFERENCE_PRICE ? QuoteIntent.Pricing : QuoteIntent.Quote,
          configs: getRoutingAPIConfig(args),
<<<<<<< HEAD
          useDEX: args.routerPreference === RouterPreference.X,
=======
          useUniswapX: args.routerPreference === RouterPreference.X,
>>>>>>> upstream/main
          swapper: args.account,
        }
        try {
          const response = await fetch({
            method: 'POST',
<<<<<<< HEAD
            url: `${LUX_GATEWAY_DNS_URL}/quote`,
=======
            url: `${UNISWAP_GATEWAY_DNS_URL}/quote`,
>>>>>>> upstream/main
            body: JSON.stringify(requestBody),
            headers: {
              'x-request-source': REQUEST_SOURCE,
            },
          })

          if (response.error) {
            try {
              // cast as any here because we do a runtime check on it being an object before indexing into .errorCode
              const errorData = response.error.data as { errorCode?: string; detail?: string }
              // NO_ROUTE should be treated as a valid response to prevent retries.
              if (
                typeof errorData === 'object' &&
                (errorData.errorCode === 'NO_ROUTE' || errorData.detail === 'No quotes available')
              ) {
                sendAnalyticsEvent(InterfaceEventName.NoQuoteReceivedFromRoutingAPI, {
                  requestBody,
                  response,
                  routerPreference: args.routerPreference,
                })
                return {
                  data: { state: QuoteState.NOT_FOUND },
                }
              }
            } catch {
              throw response.error
            }
          }

          const uraQuoteResponse = response.data as URAQuoteResponse
          const tradeResult = await transformQuoteToTrade({
            args,
            data: uraQuoteResponse,
            quoteMethod: QuoteMethod.ROUTING_API,
          })
          return { data: { ...tradeResult } }
        } catch (error: any) {
          logger.warn(
            'routing/slice',
            'queryFn',
            `GetQuote failed on Unified Routing API, falling back to client: ${
              error?.message ?? error?.detail ?? error
            }`,
          )
        }

        return {
          data: { state: QuoteState.NOT_FOUND },
        }
      },
      keepUnusedDataFor: ms(`10s`),
      extraOptions: {
        maxRetries: 0,
      },
    }),
  }),
})

export const {
  useGetQuoteQuery,
  util: { resetApiState: resetRoutingApi },
} = routingApi
export const useGetQuoteQueryState = routingApi.endpoints.getQuote.useQueryState
