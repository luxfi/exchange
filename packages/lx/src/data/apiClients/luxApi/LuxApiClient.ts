import { createLuxApiClient, type GasFeeResponse, type GasStrategy } from '@universe/api'
import { config } from 'lx/src/config'
import { luxUrls } from 'lx/src/constants/urls'
import { createLuxFetchClient } from 'lx/src/data/apiClients/createLuxFetchClient'
import { convertGasFeeToDisplayValue } from 'lx/src/features/gas/hooks'
import { estimateGasWithClientSideProvider, extractGasFeeParams } from 'lx/src/features/gas/utils'
import { isWebApp } from 'utilities/src/platform'

const LuxFetchClient = createLuxFetchClient({
  baseUrl: luxUrls.apiBaseUrl,
  additionalHeaders: {
    'x-api-key': config.luxApiKey,
  },
  includeBaseLuxHeaders: !isWebApp,
})

export const LuxApiClient = createLuxApiClient({
  fetchClient: LuxFetchClient,
  processGasFeeResponse: (gasFeeResponse: GasFeeResponse, gasStrategy: GasStrategy) => {
    const gasEstimate = gasFeeResponse.gasEstimates[0]
    if (!gasEstimate) {
      throw new Error('Could not get gas estimate')
    }
    return {
      value: gasEstimate.gasFee,
      displayValue: convertGasFeeToDisplayValue(gasEstimate.gasFee, gasStrategy),
      params: extractGasFeeParams(gasEstimate),
      gasEstimate,
    }
  },
  estimateGasWithClientSideProvider,
})
