import type { TransactionRequest } from '@ethersproject/providers'
import type { GasEstimate, GasStrategy } from '@luxfi/api'
import { config } from 'lx/src/config'
import { uniswapUrls } from 'lx/src/constants/urls'
import { createUniswapFetchClient } from 'lx/src/data/apiClients/createUniswapFetchClient'
import { convertGasFeeToDisplayValue } from 'lx/src/features/gas/hooks'
import type {
  GasFeeResponse,
  GasFeeResult,
  TransactionEip1559FeeParams,
  TransactionLegacyFeeParams,
} from 'lx/src/features/gas/types'
import { createEthersProvider } from 'lx/src/features/providers/createEthersProvider'
import { isWebApp } from 'utilities/src/platform'

const UniswapFetchClient = createUniswapFetchClient({
  baseUrl: uniswapUrls.apiBaseUrl,
  additionalHeaders: {
    'x-api-key': config.uniswapApiKey,
  },
  includeBaseUniswapHeaders: !isWebApp,
})

type FetchGasFn = ({
  tx,
  fallbackGasLimit,
}: {
  tx: TransactionRequest
  fallbackGasLimit?: number
}) => Promise<GasFeeResultWithoutState>

// TODO(WALL-6421): Remove this type once GasFeeResult shape is decoupled from state fields
export type GasFeeResultWithoutState = Omit<GasFeeResult, 'isLoading' | 'error'>
export function createFetchGasFee({
  gasStrategy,
  smartContractDelegationAddress,
}: {
  gasStrategy: GasStrategy
  smartContractDelegationAddress?: Address
}): FetchGasFn {
  const injectGasStrategies = (tx: TransactionRequest): TransactionRequest & { gasStrategies: GasStrategy[] } => {
    return { ...tx, gasStrategies: [gasStrategy] }
  }

  const injectSmartContractDelegationAddress = (tx: TransactionRequest): TransactionRequest => ({
    ...tx,
    ...(smartContractDelegationAddress ? { smartContractDelegationAddress } : {}),
  })

  const processGasFeeResponse = (gasFeeResponse: GasFeeResponse): GasFeeResultWithoutState => {
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
  }

  const tryClientSideFallback: FetchGasFn = async ({ tx, fallbackGasLimit }) => {
    try {
      if (!tx.chainId) {
        throw new Error('No chainId for clientside gas estimation')
      }
      const provider = createEthersProvider({ chainId: tx.chainId })
      if (!provider) {
        throw new Error('No provider for clientside gas estimation')
      }
      const gasUseEstimate = (await provider.estimateGas(tx)).toNumber() * 10e9

      return {
        value: gasUseEstimate.toString(),
        displayValue: gasUseEstimate.toString(),
      }
    } catch (_e) {
      // provider.estimateGas will error if the account doesn't have sufficient ETH balance, but we should show an estimated cost anyway
      return {
        value: fallbackGasLimit?.toString(),
        // These estimates don't inflate the gas limit, so we can use the same value for display
        displayValue: fallbackGasLimit?.toString(),
      }
    }
  }

  const fetchGasFee: FetchGasFn = async ({ tx, fallbackGasLimit }) => {
    const body = JSON.stringify(injectGasStrategies(injectSmartContractDelegationAddress(tx)))

    try {
      const gasFeeResponse = await UniswapFetchClient.post<GasFeeResponse>(uniswapUrls.gasServicePath, {
        body,
        headers: smartContractDelegationAddress
          ? {
              'x-viem-provider-enabled': 'true',
            }
          : {},
      })
      return processGasFeeResponse(gasFeeResponse)
    } catch (error) {
      if (isWebApp) {
        // Gas Fee API currently errors on gas estimations on disconnected state & insufficient funds
        // Fallback to clientside estimate using provider.estimateGas
        return tryClientSideFallback({ tx, fallbackGasLimit })
      }
      throw error
    }
  }

  return fetchGasFee
}

function extractGasFeeParams(estimate: GasEstimate): TransactionLegacyFeeParams | TransactionEip1559FeeParams {
  if ('maxFeePerGas' in estimate) {
    return {
      maxFeePerGas: estimate.maxFeePerGas,
      maxPriorityFeePerGas: estimate.maxPriorityFeePerGas,
      gasLimit: estimate.gasLimit,
    }
  } else {
    return {
      gasPrice: estimate.gasPrice,
      gasLimit: estimate.gasLimit,
    }
  }
}

export type ScreenResponse = {
  block: boolean
}

export type ScreenRequest = {
  address: string
}

export async function fetchTrmScreen(params: ScreenRequest): Promise<ScreenResponse> {
  return await UniswapFetchClient.post<ScreenResponse>(uniswapUrls.trmPath, {
    body: JSON.stringify(params),
  })
}
