import type { TieredNetworkOptions } from '@l.x/lx/src/components/network/NetworkFilterV2/types'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { PlatformSplitStubError } from '@l.x/utils/src/errors'

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
