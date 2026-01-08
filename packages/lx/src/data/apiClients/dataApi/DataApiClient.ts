import { createDataServiceApiClient } from '@luxfi/api'
import { uniswapUrls } from 'lx/src/constants/urls'
import { createUniswapFetchClient } from 'lx/src/data/apiClients/createUniswapFetchClient'

const DataServiceFetchClient = createUniswapFetchClient({
  baseUrl: uniswapUrls.dataApiServiceUrl,
})

export const DataServiceApiClient = createDataServiceApiClient({
  fetchClient: DataServiceFetchClient,
})
