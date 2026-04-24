import { createDataServiceApiClient } from '@l.x/api'
import { lxUrls } from '@l.x/lx/src/constants/urls'
import { createLXFetchClient } from '@l.x/lx/src/data/apiClients/createLXFetchClient'

const DataServiceFetchClient = createLXFetchClient({
  baseUrl: lxUrls.dataApiServiceUrl,
})

export const DataServiceApiClient = createDataServiceApiClient({
  fetchClient: DataServiceFetchClient,
})
