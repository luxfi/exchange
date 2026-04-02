import { createJupiterApiClient, JupiterApiClient as JupiterApiClientType } from '@l.x/api'
import { config } from 'lx/src/config'
import { createLXFetchClient } from 'lx/src/data/apiClients/createLXFetchClient'

const JupiterFetchClient = createLXFetchClient({
  baseUrl: `${config.jupiterProxyUrl}/ultra/v1`,
  additionalHeaders: {
    'x-api-key': config.tradingApiKey,
  },
})

export const JupiterApiClient: JupiterApiClientType = createJupiterApiClient({
  fetchClient: JupiterFetchClient,
})
