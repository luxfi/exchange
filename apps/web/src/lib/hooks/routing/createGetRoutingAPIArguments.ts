import { SkipToken } from '@reduxjs/toolkit/query/react'
<<<<<<< HEAD
import { Protocol } from '@luxamm/router-sdk'
import { Currency, CurrencyAmount, TradeType } from '@luxamm/sdk-core'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
=======
import { Protocol } from '@uniswap/router-sdk'
import { Currency, CurrencyAmount, TradeType } from '@uniswap/sdk-core'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
>>>>>>> upstream/main
import { GetQuoteArgs, INTERNAL_ROUTER_PREFERENCE_PRICE, RouterPreference, URAQuoteType } from '~/state/routing/types'
import { currencyAddressForSwapQuote } from '~/state/routing/utils'

interface RoutingAPIContext {
<<<<<<< HEAD
  canUseDEX: boolean
=======
  canUseUniswapX: boolean
>>>>>>> upstream/main
  isPriorityOrdersEnabled: boolean
  isDutchV3Enabled: boolean
}

export interface RoutingAPIInput {
  account?: string
  tokenIn?: Currency
  tokenOut?: Currency
  amount?: CurrencyAmount<Currency>
  tradeType: TradeType
  routerPreference: RouterPreference | typeof INTERNAL_ROUTER_PREFERENCE_PRICE
  protocolPreferences?: Protocol[]
}

interface RoutingAPIInputValidated {
  account: string
  tokenIn: Currency
  tokenOut: Currency
  amount: CurrencyAmount<Currency>
  tradeType: TradeType
  routerPreference: RouterPreference | typeof INTERNAL_ROUTER_PREFERENCE_PRICE
  protocolPreferences?: Protocol[]
}

export function createGetRoutingAPIArguments(ctx: RoutingAPIContext) {
<<<<<<< HEAD
  const { canUseDEX, isPriorityOrdersEnabled, isDutchV3Enabled } = ctx
=======
  const { canUseUniswapX, isPriorityOrdersEnabled, isDutchV3Enabled } = ctx
>>>>>>> upstream/main

  return function getRoutingAPIArguments(input: RoutingAPIInput): GetQuoteArgs | SkipToken {
    if (!validateRoutingAPIInput(input)) {
      throw new Error(`Invalid routing API input: ${JSON.stringify(input)}`)
    }

    const { account, tokenIn, tokenOut, amount, tradeType, routerPreference, protocolPreferences } = input

    // Don't enable fee logic if this is a quote for pricing
    const sendPortionEnabled = routerPreference !== INTERNAL_ROUTER_PREFERENCE_PRICE

    const isPriorityOrder = routerPreference === RouterPreference.X && isPriorityOrdersEnabled
    const isArbitrum = tokenIn.chainId === UniverseChainId.ArbitrumOne

    const routingType = getRoutingType({
<<<<<<< HEAD
      canUseDEX,
=======
      canUseUniswapX,
>>>>>>> upstream/main
      isPriorityOrder,
      isArbitrum,
      isDutchV3Enabled,
    })

    return {
      account,
      amount: amount.quotient.toString(),
      tokenInAddress: currencyAddressForSwapQuote(tokenIn),
      tokenInChainId: tokenIn.chainId,
      tokenInDecimals: tokenIn.wrapped.decimals,
      tokenInSymbol: tokenIn.wrapped.symbol,
      tokenOutAddress: currencyAddressForSwapQuote(tokenOut),
      tokenOutChainId: tokenOut.wrapped.chainId,
      tokenOutDecimals: tokenOut.wrapped.decimals,
      tokenOutSymbol: tokenOut.wrapped.symbol,
      routerPreference,
      protocolPreferences,
      tradeType,
<<<<<<< HEAD
      dexForceSyntheticQuotes: false,
=======
      uniswapXForceSyntheticQuotes: false,
>>>>>>> upstream/main
      sendPortionEnabled,
      routingType,
    }
  }
}

export function validateRoutingAPIInput(input: RoutingAPIInput): input is RoutingAPIInputValidated {
  return (
    !!input.tokenIn &&
    !!input.tokenOut &&
    !!input.amount &&
    !input.tokenIn.equals(input.tokenOut) &&
    !input.tokenIn.wrapped.equals(input.tokenOut.wrapped)
  )
}

function getRoutingType(input: {
<<<<<<< HEAD
  canUseDEX: boolean
=======
  canUseUniswapX: boolean
>>>>>>> upstream/main
  isPriorityOrder: boolean
  isArbitrum: boolean
  isDutchV3Enabled: boolean
}): URAQuoteType {
<<<<<<< HEAD
  const { canUseDEX, isPriorityOrder, isArbitrum, isDutchV3Enabled } = input

  if (!canUseDEX) {
=======
  const { canUseUniswapX, isPriorityOrder, isArbitrum, isDutchV3Enabled } = input

  if (!canUseUniswapX) {
>>>>>>> upstream/main
    return URAQuoteType.CLASSIC
  }

  if (isPriorityOrder) {
    return URAQuoteType.PRIORITY
  }

  if (isArbitrum) {
    return isDutchV3Enabled ? URAQuoteType.DUTCH_V3 : URAQuoteType.DUTCH_V1
  }

  return URAQuoteType.DUTCH_V2
}
