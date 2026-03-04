import {
  type StatsigOptions,
  StatsigProvider,
  type StatsigUser,
  type StorageProvider,
  useClientAsyncInit,
} from '@luxfi/gating'
import { type ReactNode, useEffect, useMemo } from 'react'
import { config } from 'lx/src/config'
import { statsigBaseConfig } from 'lx/src/features/gating/statsigBaseConfig'
import { logger } from 'utilities/src/logger/logger'

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
  // Skip Statsig when no API key is configured (e.g. self-hosted deployments)
  if (!config.statsigApiKey) {
    onInit?.()
    return <>{children}</>
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
