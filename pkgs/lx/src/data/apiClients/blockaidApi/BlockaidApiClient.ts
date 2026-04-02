import { type BlockaidApiClient as BlockaidApiClientType, createBlockaidApiClient } from '@luxexchange/api'
import { config } from 'lx/src/config'
import { createLxFetchClient } from 'lx/src/data/apiClients/createLxFetchClient'

const BlockaidFetchClient = createLxFetchClient({
  baseUrl: `${config.blockaidProxyUrl}`,
  additionalHeaders: {
    'x-api-key': config.tradingApiKey,
  },
})

export const BlockaidApiClient: BlockaidApiClientType = createBlockaidApiClient({
  fetchClient: BlockaidFetchClient,
})
