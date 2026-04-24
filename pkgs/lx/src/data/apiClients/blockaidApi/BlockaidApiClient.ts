import { type BlockaidApiClient as BlockaidApiClientType, createBlockaidApiClient } from '@l.x/api'
import { config } from '@l.x/lx/src/config'
import { createLXFetchClient } from '@l.x/lx/src/data/apiClients/createLXFetchClient'

const BlockaidFetchClient = createLXFetchClient({
  baseUrl: `${config.blockaidProxyUrl}`,
  additionalHeaders: {
    'x-api-key': config.tradingApiKey,
  },
})

export const BlockaidApiClient: BlockaidApiClientType = createBlockaidApiClient({
  fetchClient: BlockaidFetchClient,
})
