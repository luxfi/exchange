import type { TieredNetworkOptions } from 'lx/src/components/network/NetworkFilterV2/types'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { PlatformSplitStubError } from 'utilities/src/errors'

export interface NetworkFilterV2Props {
  chainIds: UniverseChainId[]
  selectedChain: UniverseChainId | null
  onPressChain: (chainId: UniverseChainId | null) => void
  includeAllNetworks?: boolean
  tieredOptions?: TieredNetworkOptions
}

export function NetworkFilterV2(_: NetworkFilterV2Props): JSX.Element {
  throw new PlatformSplitStubError('NetworkFilterV2')
}
