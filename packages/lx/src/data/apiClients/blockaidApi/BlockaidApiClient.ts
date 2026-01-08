import { type BlockaidApiClient as BlockaidApiClientType, createBlockaidApiClient } from '@luxfi/api'
import { config } from 'lx/src/config'
import { createUniswapFetchClient } from 'lx/src/data/apiClients/createUniswapFetchClient'

const BlockaidFetchClient = createUniswapFetchClient({
  baseUrl: `${config.blockaidProxyUrl}`,
  additionalHeaders: {
    'x-api-key': config.tradingApiKey,
  },
})

export const BlockaidApiClient: BlockaidApiClientType = createBlockaidApiClient({
  fetchClient: BlockaidFetchClient,
})
