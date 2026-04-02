import { JsonRpcProvider } from '@ethersproject/providers'
import {
  contentScriptToBackgroundMessageChannel,
  dappResponseMessageChannel,
} from 'src/background/messagePassing/messageChannels'
import { BaseMethodHandler } from 'src/contentScript/methodHandlers/BaseMethodHandler'
import { LuxMethods } from 'src/contentScript/methodHandlers/requestMethods'
import { PendingResponseInfo } from 'src/contentScript/methodHandlers/types'
import { getPendingResponseInfo } from 'src/contentScript/methodHandlers/utils'
import { WindowEthereumRequest } from 'src/contentScript/types'
import {
  LuxOpenSidebarRequest,
  LuxOpenSidebarRequestSchema,
} from 'src/contentScript/WindowEthereumRequestTypes'
import { DappRequestType, DappResponseType } from '@l.x/lx/src/features/dappRequests/types'
import { logger } from '@luxfi/utilities/src/logger/logger'

/**
 * Handles all lux-specific requests
 */

export class LuxMethodHandler extends BaseMethodHandler<WindowEthereumRequest> {
  private readonly requestIdToSourceMap: Map<string, PendingResponseInfo> = new Map()

  // eslint-disable-next-line max-params
  constructor({
    getChainId,
    getProvider,
    getConnectedAddresses,
    setChainIdAndMaybeEmit,
    setProvider,
    setConnectedAddressesAndMaybeEmit,
  }: {
    getChainId: () => string | undefined
    getProvider: () => JsonRpcProvider | undefined
    getConnectedAddresses: () => Address[] | undefined
    setChainIdAndMaybeEmit: (newChainId: string) => void
    setProvider: (newProvider: JsonRpcProvider) => void
    setConnectedAddressesAndMaybeEmit: (newConnectedAddresses: Address[]) => void
  }) {
    super(
      getChainId,
      getProvider,
      getConnectedAddresses,
      setChainIdAndMaybeEmit,
      setProvider,
      setConnectedAddressesAndMaybeEmit,
    )

    dappResponseMessageChannel.addMessageListener(DappResponseType.LuxOpenSidebarResponse, (message) => {
      const source = getPendingResponseInfo({
        requestIdToSourceMap: this.requestIdToSourceMap,
        requestId: message.requestId,
        type: DappResponseType.LuxOpenSidebarResponse,
      })?.source

      source?.postMessage({
        requestId: message.requestId,
      })
    })
  }

  async handleRequest(request: WindowEthereumRequest, source: MessageEventSource | null): Promise<void> {
    switch (request.method) {
      case LuxMethods.lux_openSidebar: {
        logger.debug("Handling 'lux_openSidebar' request", request.method, request.toString())
        const luxOpenTokensRequest = LuxOpenSidebarRequestSchema.parse(request)
        await this.handleLuxOpenSidebarRequest(luxOpenTokensRequest, source)
        break
      }
    }
  }

  private async handleLuxOpenSidebarRequest(
    request: LuxOpenSidebarRequest,
    source: MessageEventSource | null,
  ): Promise<void> {
    this.requestIdToSourceMap.set(request.requestId, {
      source,
      type: DappResponseType.LuxOpenSidebarResponse,
    })

    await contentScriptToBackgroundMessageChannel.sendMessage({
      type: DappRequestType.LuxOpenSidebar,
      requestId: request.requestId,
      tab: request.tab,
    })
  }
}
