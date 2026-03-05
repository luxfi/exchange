import { createUniswapApiClient, type GasFeeResponse, type GasStrategy } from '@universe/api'
import { config } from 'lx/src/config'
import { uniswapUrls } from 'lx/src/constants/urls'
import { createUniswapFetchClient } from 'lx/src/data/apiClients/createUniswapFetchClient'
import { convertGasFeeToDisplayValue } from 'lx/src/features/gas/hooks'
import { estimateGasWithClientSideProvider, extractGasFeeParams } from 'lx/src/features/gas/utils'
import { isWebApp } from 'utilities/src/platform'

const UniswapFetchClient = createUniswapFetchClient({
  baseUrl: uniswapUrls.apiBaseUrl,
  additionalHeaders: {
    'x-api-key': config.uniswapApiKey,
  },
  includeBaseUniswapHeaders: !isWebApp,
})

export const UniswapApiClient = createUniswapApiClient({
  fetchClient: UniswapFetchClient,
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
