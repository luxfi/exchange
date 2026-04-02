import { createLxApiClient, type GasFeeResponse, type GasStrategy } from '@l.x/api'
import { config } from 'lx/src/config'
import { lxUrls } from 'lx/src/constants/urls'
import { createLxFetchClient } from 'lx/src/data/apiClients/createLxFetchClient'
import { convertGasFeeToDisplayValue } from 'lx/src/features/gas/hooks'
import { estimateGasWithClientSideProvider, extractGasFeeParams } from 'lx/src/features/gas/utils'
import { isWebApp } from 'utilities/src/platform'

const LxFetchClient = createLxFetchClient({
  baseUrl: lxUrls.apiBaseUrl,
  additionalHeaders: {
    'x-api-key': config.lxApiKey,
  },
  includeBaseLxHeaders: !isWebApp,
})

export const LxApiClient = createLxApiClient({
  fetchClient: LxFetchClient,
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
