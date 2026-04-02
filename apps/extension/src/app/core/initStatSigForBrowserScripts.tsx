import { StatsigClient, StatsigCustomAppValue, StatsigUser } from '@luxfi/gating'
import { config } from '@luxexchange/lx/src/config'
import { statsigBaseConfig } from '@luxexchange/lx/src/features/gating/statsigBaseConfig'
import { getUniqueId } from '@luxfi/utilities/src/device/uniqueId'
import { logger } from '@luxfi/utilities/src/logger/logger'

export function makeStatsigUser(userID: string): StatsigUser {
  return {
    userID,
    appVersion: process.env.VERSION,
    custom: {
      app: StatsigCustomAppValue.Extension,
    },
  }
}

export async function initStatSigForBrowserScripts(): Promise<void> {
  const uniqueId = await getUniqueId()
  const statsigClient = new StatsigClient(config.statsigApiKey, makeStatsigUser(uniqueId), statsigBaseConfig)
  await statsigClient.initializeAsync().catch((error) => {
    logger.error(error, {
      tags: { file: 'initStatSigForBrowserScripts.tsx', function: 'initStatSigForBrowserScripts' },
    })
  })
}
