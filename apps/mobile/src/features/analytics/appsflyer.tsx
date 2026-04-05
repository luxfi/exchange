import appsFlyer from 'react-native-appsflyer'
<<<<<<< HEAD
import { config } from '@l.x/lx/src/config'
import { isBetaEnv, isDevEnv } from '@l.x/utils/src/environment/env'
import { logger } from '@l.x/utils/src/logger/logger'
=======
import { config } from 'uniswap/src/config'
import { isBetaEnv, isDevEnv } from 'utilities/src/environment/env'
import { logger } from 'utilities/src/logger/logger'
>>>>>>> upstream/main

export function initAppsFlyer(): void {
  appsFlyer.initSdk(
    {
      devKey: config.appsflyerApiKey,
      isDebug: isDevEnv() || isBetaEnv(),
      appId: config.appsflyerAppId,
      onInstallConversionDataListener: false,
      onDeepLinkListener: false,
      timeToWaitForATTUserAuthorization: 10,
      // Ensures we have to manually start the SDK to respect any opting out
      manualStart: true,
    },
    (result) => {
      logger.debug('appsflyer', 'initAppsFlyer', 'Result:', result)
    },
    (error) => {
      logger.error(error, { tags: { file: 'appsflyer', function: 'initAppsFlyer' } })
    },
  )
}
