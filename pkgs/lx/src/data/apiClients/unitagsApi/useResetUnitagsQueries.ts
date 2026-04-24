import { useQueryClient } from '@tanstack/react-query'
import { logger } from '@l.x/utils/src/logger/logger'
import { useEvent } from '@l.x/utils/src/react/hooks'
import { ReactQueryCacheKey } from '@l.x/utils/src/reactQuery/cache'

export function useResetUnitagsQueries(): () => void {
  const queryClient = useQueryClient()

  return useEvent(() => {
    queryClient.resetQueries({ queryKey: [ReactQueryCacheKey.UnitagsApi] }).catch((error) => {
      logger.error(error, {
        tags: {
          file: 'useResetUnitagsQueries.ts',
          function: 'queryClient.resetQueries',
        },
      })
    })
  })
}
