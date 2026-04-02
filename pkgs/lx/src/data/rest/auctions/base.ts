import { createConnectTransportWithDefaults, getEntryGatewayUrl } from '@l.x/api'

export const auctionsTransport = createConnectTransportWithDefaults({
  baseUrl: getEntryGatewayUrl(),
})
