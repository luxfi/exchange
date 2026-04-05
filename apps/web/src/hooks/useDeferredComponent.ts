import { useEffect, useState } from 'react'
<<<<<<< HEAD
import { logger } from '@l.x/utils/src/logger/logger'
=======
import { logger } from 'utilities/src/logger/logger'
>>>>>>> upstream/main

export function useDeferredComponent<T extends React.ComponentType<any>>(importFn: () => Promise<{ default: T }>) {
  const [Component, setComponent] = useState<T | null>(null)

<<<<<<< HEAD
  // biome-ignore lint/correctness/useExhaustiveDependencies: Only runs once on mount to set up deferred loading
=======
  /* oxlint-disable react/exhaustive-deps -- Only runs once on mount to set up deferred loading */
>>>>>>> upstream/main
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(
        async () => {
          try {
            const mod = await importFn()
            setComponent(() => mod.default)
          } catch (error) {
            logger.error(error, {
              tags: {
                file: 'useDeferredComponent.tsx',
                function: 'requestIdleCallback',
              },
            })
          }
        },
        { timeout: 100 },
      )
    } else {
      setTimeout(async () => {
        try {
          const mod = await importFn()
          setComponent(() => mod.default)
        } catch (error) {
          logger.error(error, {
            tags: {
              file: 'useDeferredComponent.tsx',
              function: 'setTimeout',
            },
          })
        }
      }, 1)
    }
  }, [])

  return Component
}
