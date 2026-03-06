import { createConnectTransportWithDefaults } from '@universe/api'
import { config } from 'lx/src/config'
import { luxUrls } from 'lx/src/constants/urls'

export const liquidityServiceTransport = createConnectTransportWithDefaults(
  {
    baseUrl: luxUrls.liquidityServiceUrl,
    additionalHeaders: {
      'x-api-key': config.tradingApiKey,
    },
  },
  {
    jsonOptions: {
      // Ensure boolean false values and other default values are included in JSON serialization
      // Required for fields like BidToExit.isExited which need to be sent even when false
      emitDefaultValues: true,
    },
  },
)
