import { getOverrideAdapter, getStatsigEnvName, StatsigOptions } from '@luxfi/gating'
import { luxUrls } from 'lx/src/constants/urls'

export const statsigBaseConfig: StatsigOptions = {
  networkConfig: { api: luxUrls.statsigProxyUrl },
  environment: {
    tier: getStatsigEnvName(),
  },
  overrideAdapter: getOverrideAdapter(),
}
