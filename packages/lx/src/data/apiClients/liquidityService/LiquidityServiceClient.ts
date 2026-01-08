import { createLiquidityServiceClient } from '@luxfi/api'
import { config } from 'lx/src/config'
import { uniswapUrls } from 'lx/src/constants/urls'
import { createUniswapFetchClient } from 'lx/src/data/apiClients/createUniswapFetchClient'

const LiquidityServiceFetchClient = createUniswapFetchClient({
  baseUrl: uniswapUrls.liquidityServiceUrl,
  additionalHeaders: {
    'x-api-key': config.tradingApiKey,
  },
})

export const LiquidityServiceClient = createLiquidityServiceClient({
  fetchClient: LiquidityServiceFetchClient,
})
