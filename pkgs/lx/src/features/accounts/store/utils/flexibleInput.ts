import type { UniverseChainIdByPlatform } from '@l.x/lx/src/features/chains/types'
import type { Platform } from '@l.x/lx/src/features/platforms/types/Platform'
import { chainIdToPlatform } from '@l.x/lx/src/features/platforms/utils/chains'

export type FlexiblePlatformInput<P extends Platform = Platform> = P | UniverseChainIdByPlatform<P>

export function resolvePlatform<P extends Platform>(platformInput: FlexiblePlatformInput<P>): P {
  if (typeof platformInput === 'number') {
    return chainIdToPlatform(platformInput) as P
  }

  return platformInput
}
