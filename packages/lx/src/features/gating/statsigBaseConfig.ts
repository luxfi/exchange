import { getOverrideAdapter, getStatsigEnvName, StatsigOptions } from '@luxfi/gating'
import { uniswapUrls } from 'lx/src/constants/urls'

export const statsigBaseConfig: StatsigOptions = {
  networkConfig: { api: uniswapUrls.statsigProxyUrl },
  environment: {
    tier: getStatsigEnvName(),
  },
  overrideAdapter: getOverrideAdapter(),
}
