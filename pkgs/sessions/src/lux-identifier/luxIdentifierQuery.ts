import { queryOptions } from '@tanstack/react-query'
import type { LXIdentifierService } from '@l.x/sessions/src/lx-identifier/types'
import { ReactQueryCacheKey } from '@l.x/utils/src/reactQuery/cache'
import type { QueryOptionsResult } from '@l.x/utils/src/reactQuery/queryOptions'

type LXIdentifierQueryOptions = QueryOptionsResult<
  string | null,
  Error,
  string | null,
  [ReactQueryCacheKey.LXIdentifier]
>

export function lxIdentifierQuery(getService: () => LXIdentifierService): LXIdentifierQueryOptions {
  return queryOptions({
    queryKey: [ReactQueryCacheKey.LXIdentifier],
    queryFn: async () => getService().getLXIdentifier(),
    staleTime: Infinity,
    gcTime: Infinity,
  })
}
