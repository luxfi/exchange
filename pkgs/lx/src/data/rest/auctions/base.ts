import { createConnectTransportWithDefaults, getEntryGatewayUrl } from '@luxexchange/api'

export const auctionsTransport = createConnectTransportWithDefaults({
  baseUrl: getEntryGatewayUrl(),
})
