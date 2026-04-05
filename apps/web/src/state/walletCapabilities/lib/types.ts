<<<<<<< HEAD
import type { HexString } from '@l.x/utils/src/addresses/hex'
=======
import type { HexString } from 'utilities/src/addresses/hex'
>>>>>>> upstream/main

export interface ChainCapabilities {
  [capabilityName: string]:
    | {
        // atomic is the only capability we care about right now
        // it is: { status: 'supported' | 'ready' | 'unsupported' }
        [key: string]: unknown
      }
    | undefined
}
export interface GetCapabilitiesResult {
  [chainId: HexString]: ChainCapabilities
}
