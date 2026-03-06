import { queryOptions } from '@tanstack/react-query'
import type { LuxIdentifierService } from '@universe/sessions/src/lux-identifier/types'
import { ReactQueryCacheKey } from 'utilities/src/reactQuery/cache'
import type { QueryOptionsResult } from 'utilities/src/reactQuery/queryOptions'

type LuxIdentifierQueryOptions = QueryOptionsResult<
  string | null,
  Error,
  string | null,
  [ReactQueryCacheKey.LuxIdentifier]
>

export function luxIdentifierQuery(getService: () => LuxIdentifierService): LuxIdentifierQueryOptions {
  return queryOptions({
    queryKey: [ReactQueryCacheKey.LuxIdentifier],
    queryFn: async () => getService().getLuxIdentifier(),
    staleTime: Infinity,
    gcTime: Infinity,
  })
}
