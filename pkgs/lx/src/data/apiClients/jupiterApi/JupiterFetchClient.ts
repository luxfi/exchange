import { createJupiterApiClient, JupiterApiClient as JupiterApiClientType } from '@l.x/api'
import { config } from 'lx/src/config'
import { createLxFetchClient } from 'lx/src/data/apiClients/createLxFetchClient'

const JupiterFetchClient = createLxFetchClient({
  baseUrl: `${config.jupiterProxyUrl}/ultra/v1`,
  additionalHeaders: {
    'x-api-key': config.tradingApiKey,
  },
})

export const JupiterApiClient: JupiterApiClientType = createJupiterApiClient({
  fetchClient: JupiterFetchClient,
})
