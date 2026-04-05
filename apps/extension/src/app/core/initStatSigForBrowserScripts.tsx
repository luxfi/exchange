<<<<<<< HEAD
import { StatsigClient, StatsigCustomAppValue, StatsigUser } from '@luxfi/gating'
import { config } from '@l.x/lx/src/config'
import { statsigBaseConfig } from '@l.x/lx/src/features/gating/statsigBaseConfig'
import { getUniqueId } from '@l.x/utils/src/device/uniqueId'
import { logger } from '@l.x/utils/src/logger/logger'
=======
import { StatsigClient, StatsigCustomAppValue, StatsigUser } from '@universe/gating'
import { config } from 'uniswap/src/config'
import { statsigBaseConfig } from 'uniswap/src/features/gating/statsigBaseConfig'
import { getUniqueId } from 'utilities/src/device/uniqueId'
import { logger } from 'utilities/src/logger/logger'
>>>>>>> upstream/main

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
