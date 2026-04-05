import { JsonRpcProvider } from '@ethersproject/providers'
import { WindowEthereumRequest } from 'src/contentScript/types'

export abstract class BaseMethodHandler<T extends WindowEthereumRequest> {
<<<<<<< HEAD
  // eslint-disable-next-line max-params
=======
  // oxlint-disable-next-line max-params
>>>>>>> upstream/main
  constructor(
    protected readonly getChainId: () => string | undefined,
    protected readonly getProvider: () => JsonRpcProvider | undefined,
    protected readonly getConnectedAddresses: () => Address[] | undefined,
    protected readonly setChainIdAndMaybeEmit: (newChainId: string) => void,
    protected readonly setProvider: (newProvider: JsonRpcProvider) => void,
    protected readonly setConnectedAddressesAndMaybeEmit: (newConnectedAddresses: Address[]) => void,
  ) {}

  handleRequest(_request: T, _source: MessageEventSource | null): void {}
}
