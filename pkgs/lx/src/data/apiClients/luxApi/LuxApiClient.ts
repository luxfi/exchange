import { createLuxApiClient, type GasFeeResponse, type GasStrategy } from '@l.x/api'
import { config } from '@l.x/lx/src/config'
import { lxUrls } from '@l.x/lx/src/constants/urls'
import { createLXFetchClient } from '@l.x/lx/src/data/apiClients/createLXFetchClient'
import { convertGasFeeToDisplayValue } from '@l.x/lx/src/features/gas/hooks'
import { estimateGasWithClientSideProvider, extractGasFeeParams } from '@l.x/lx/src/features/gas/utils'
import { isWebApp } from '@l.x/utils/src/platform'

const LxFetchClient = createLXFetchClient({
  baseUrl: lxUrls.apiBaseUrl,
  additionalHeaders: {
    'x-api-key': config.lxApiKey,
  },
  includeBaseLxHeaders: !isWebApp,
})

export const LuxApiClient = createLuxApiClient({
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
