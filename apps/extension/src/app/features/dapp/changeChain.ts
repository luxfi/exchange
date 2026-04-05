import { JsonRpcProvider } from '@ethersproject/providers'
import { providerErrors, serializeError } from '@metamask/rpc-errors'
import { dappStore } from 'src/app/features/dapp/store'
import { ChangeChainResponse, ErrorResponse } from 'src/app/features/dappRequests/types/DappRequestTypes'
<<<<<<< HEAD
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { chainIdToHexadecimalString } from '@l.x/lx/src/features/chains/utils'
import { DappResponseType } from '@l.x/lx/src/features/dappRequests/types'
import { ExtensionEventName } from '@l.x/lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from '@l.x/lx/src/features/telemetry/send'
=======
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { chainIdToHexadecimalString } from 'uniswap/src/features/chains/utils'
import { DappResponseType } from 'uniswap/src/features/dappRequests/types'
import { ExtensionEventName } from 'uniswap/src/features/telemetry/constants'
import { sendAnalyticsEvent } from 'uniswap/src/features/telemetry/send'
>>>>>>> upstream/main

export function changeChain({
  activeConnectedAddress,
  dappUrl,
  provider,
  requestId,
  updatedChainId,
}: {
  activeConnectedAddress: Address | undefined
  dappUrl: string | undefined
  provider: JsonRpcProvider | undefined | null
  requestId: string
  updatedChainId: UniverseChainId | null
}): ChangeChainResponse | ErrorResponse {
  if (!updatedChainId) {
    return {
      type: DappResponseType.ErrorResponse,
      error: serializeError(
        providerErrors.custom({
          code: 4902,
<<<<<<< HEAD
          message: 'Lux Wallet does not support switching to this chain.',
=======
          message: 'Uniswap Wallet does not support switching to this chain.',
>>>>>>> upstream/main
        }),
      ),
      requestId,
    }
  }

  if (!provider) {
    return {
      type: DappResponseType.ErrorResponse,
      error: serializeError(providerErrors.unauthorized()),
      requestId,
    }
  }

  if (dappUrl) {
    dappStore.updateDappLatestChainId(dappUrl, updatedChainId)
    sendAnalyticsEvent(ExtensionEventName.DappChangeChain, {
      dappUrl,
      chainId: updatedChainId,
      activeConnectedAddress: activeConnectedAddress ?? '',
    })

    return {
      type: DappResponseType.ChainChangeResponse,
      requestId,
      providerUrl: provider.connection.url,
      chainId: chainIdToHexadecimalString(updatedChainId),
    }
  }

  return {
    type: DappResponseType.ErrorResponse,
    error: serializeError(providerErrors.unauthorized()),
    requestId,
  }
}
