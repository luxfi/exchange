import { GetQuoteRequestResult } from '@l.x/lx/src/features/transactions/swap/hooks/useTrade/createGetQuoteRequestArgs'
import { canonicalStringify } from '@l.x/utils/src/format/canonicalJson'

/**
 * For the given QuoteRequestResult, return an ID which can be
 * used to compare whether the user's quote request args has changed.
 */
export function getIdentifierForQuote(input?: GetQuoteRequestResult): string {
  return canonicalStringify(input)
}
