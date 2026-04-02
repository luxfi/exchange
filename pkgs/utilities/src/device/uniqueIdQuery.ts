import { queryOptions } from '@tanstack/react-query'
import { getUniqueId } from '@l.x/utils/src/device/uniqueId'
import { ReactQueryCacheKey } from '@l.x/utils/src/reactQuery/cache'
import type { QueryOptionsResult } from '@l.x/utils/src/reactQuery/queryOptions'

type UniqueIdQueryOptions = QueryOptionsResult<string, Error, string, [ReactQueryCacheKey.UniqueId]>

export function uniqueIdQuery(): UniqueIdQueryOptions {
  return queryOptions({
    queryKey: [ReactQueryCacheKey.UniqueId],
    queryFn: getUniqueId,
    staleTime: Infinity,
    gcTime: Infinity,
  })
}
