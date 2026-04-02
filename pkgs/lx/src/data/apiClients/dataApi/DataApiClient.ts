import { createDataServiceApiClient } from '@l.x/api'
import { lxUrls } from 'lx/src/constants/urls'
import { createLXFetchClient } from 'lx/src/data/apiClients/createLXFetchClient'

const DataServiceFetchClient = createLXFetchClient({
  baseUrl: lxUrls.dataApiServiceUrl,
})

export const DataServiceApiClient = createDataServiceApiClient({
  fetchClient: DataServiceFetchClient,
})
