import { createDataServiceApiClient } from '@luxfi/api'
import { luxUrls } from 'lx/src/constants/urls'
import { createLuxFetchClient } from 'lx/src/data/apiClients/createLuxFetchClient'

const DataServiceFetchClient = createLuxFetchClient({
  baseUrl: luxUrls.dataApiServiceUrl,
})

export const DataServiceApiClient = createDataServiceApiClient({
  fetchClient: DataServiceFetchClient,
})
