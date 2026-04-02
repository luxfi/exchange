import { queryOptions } from '@tanstack/react-query'
import type { LxIdentifierService } from '@l.x/sessions/src/lx-identifier/types'
import { ReactQueryCacheKey } from 'utilities/src/reactQuery/cache'
import type { QueryOptionsResult } from 'utilities/src/reactQuery/queryOptions'

type LxIdentifierQueryOptions = QueryOptionsResult<
  string | null,
  Error,
  string | null,
  [ReactQueryCacheKey.LxIdentifier]
>

export function lxIdentifierQuery(getService: () => LxIdentifierService): LxIdentifierQueryOptions {
  return queryOptions({
    queryKey: [ReactQueryCacheKey.LxIdentifier],
    queryFn: async () => getService().getLxIdentifier(),
    staleTime: Infinity,
    gcTime: Infinity,
  })
}
