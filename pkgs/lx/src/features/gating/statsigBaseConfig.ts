import { getOverrideAdapter, getStatsigEnvName, StatsigOptions } from '@luxexchange/gating'
import { lxUrls } from 'lx/src/constants/urls'

export const statsigBaseConfig: StatsigOptions = {
  networkConfig: { api: lxUrls.statsigProxyUrl },
  environment: {
    tier: getStatsigEnvName(),
  },
  overrideAdapter: getOverrideAdapter(),
}
