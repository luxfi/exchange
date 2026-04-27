import {
  type StatsigOptions,
  StatsigProvider,
  type StatsigUser,
  type StorageProvider,
  useClientAsyncInit,
} from '@l.x/gating'
import { type ReactNode, useEffect, useMemo } from 'react'
import { config } from '@l.x/lx/src/config'
import { statsigBaseConfig } from '@l.x/lx/src/features/gating/statsigBaseConfig'
import { logger } from '@l.x/utils/src/logger/logger'

type StatsigProviderWrapperProps = {
  user: StatsigUser
  children: ReactNode
  onInit?: () => void
  options?: Partial<StatsigUser>
  storageProvider?: StorageProvider
}

export function StatsigProviderWrapper({
  children,
  options,
  user,
  storageProvider,
  onInit,
}: StatsigProviderWrapperProps): ReactNode {
  // White-label brands without their own Statsig project ship with an
  // empty key. Bypass the provider entirely so feature gates default to
  // off and the app still renders. Throwing here previously broke first
  // paint on every brand that didn't have Statsig provisioned.
  if (!config.statsigApiKey) {
    return children
  }

  const statsigOptions = useMemo<StatsigOptions>(
    () => ({
      ...statsigBaseConfig,
      storageProvider,
      ...options,
    }),
    [storageProvider, options],
  )

  const { client, isLoading: isStatsigLoading } = useClientAsyncInit(config.statsigApiKey, user, statsigOptions)

  useEffect(() => {
    if (isStatsigLoading) {
      return
    }

    onInit?.()
  }, [isStatsigLoading, onInit])

  useEffect(() => {
    const errorHandler = (event: unknown): void => {
      logger.error('StatsigProviderWrapper', {
        tags: { file: 'StatsigProviderWrapper', function: 'error' },
        extra: {
          event,
        },
      })
    }
    client.on('error', errorHandler)
    client.on('initialization_failure', errorHandler)
    return () => {
      client.off('error', errorHandler)
      client.off('initialization_failure', errorHandler)
    }
  }, [client])

  return <StatsigProvider client={client}>{children}</StatsigProvider>
}
