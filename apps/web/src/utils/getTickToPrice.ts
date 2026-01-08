import { Currency, Price, Token } from '@luxamm/sdk-core'
import { tickToPrice } from '@luxamm/v3-sdk'
import { tickToPrice as tickToPriceV4 } from '@luxamm/v4-sdk'

export function getTickToPrice({
  baseToken,
  quoteToken,
  tick,
}: {
  baseToken: Maybe<Token>
  quoteToken: Maybe<Token>
  tick?: Maybe<number>
}): Price<Token, Token> | undefined {
  if (!baseToken || !quoteToken || typeof tick !== 'number') {
    return undefined
  }
  // Type assertion needed because @luxamm/v3-sdk uses @uniswap/sdk-core internally
  return tickToPrice(baseToken, quoteToken, tick) as unknown as Price<Token, Token>
}

export function getV4TickToPrice({
  baseCurrency,
  quoteCurrency,
  tick,
}: {
  baseCurrency?: Maybe<Currency>
  quoteCurrency?: Maybe<Currency>
  tick?: Maybe<number>
}): Price<Currency, Currency> | undefined {
  if (!baseCurrency || !quoteCurrency || typeof tick !== 'number') {
    return undefined
  }
  // Type assertion needed because @luxamm/v4-sdk uses @uniswap/sdk-core internally
  return tickToPriceV4(baseCurrency, quoteCurrency, tick) as unknown as Price<Currency, Currency>
}
