<<<<<<< HEAD
import { Currency } from '@luxamm/sdk-core'
=======
import { Currency } from '@uniswap/sdk-core'
>>>>>>> upstream/main

export function formatCurrencySymbol(currency?: Currency): string | undefined {
  return currency && currency.symbol && currency.symbol.length > 20
    ? currency.symbol.slice(0, 4) + '...' + currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
    : currency?.symbol
}
