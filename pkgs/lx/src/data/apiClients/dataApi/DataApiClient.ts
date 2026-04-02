import { createDataServiceApiClient } from '@l.x/api'
import { lxUrls } from 'lx/src/constants/urls'
import { createLxFetchClient } from 'lx/src/data/apiClients/createLxFetchClient'

const DataServiceFetchClient = createLxFetchClient({
  baseUrl: lxUrls.dataApiServiceUrl,
})

export const DataServiceApiClient = createDataServiceApiClient({
  fetchClient: DataServiceFetchClient,
})
