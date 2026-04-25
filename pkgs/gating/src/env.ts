import { isBetaEnv, isProdEnv } from '@l.x/utils/src/environment/env'
import { isWebApp } from '@l.x/utils/src/platform'

export enum InsightsEnvName {
  Beta = 'beta',
  Development = 'development',
  Production = 'production',
  Staging = 'staging',
}

export function getInsightsEnvName(): InsightsEnvName {
  if (isBetaEnv()) {
    return isWebApp ? InsightsEnvName.Staging : InsightsEnvName.Beta
  }
  if (isProdEnv()) {
    return InsightsEnvName.Production
  }
  return InsightsEnvName.Development
}
