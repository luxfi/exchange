import { getChainInfo } from 'lx/src/features/chains/chainInfo'
import { UniverseChainId, UniverseChainIdByPlatform } from 'lx/src/features/chains/types'
import { Platform } from 'lx/src/features/platforms/types/Platform'

export function chainIdToPlatform(chainId: UniverseChainId): Platform {
  return getChainInfo(chainId).platform
}

export function isChainIdOnPlatform<P extends Platform>(
  chainId: UniverseChainId,
  platform: P,
): chainId is UniverseChainIdByPlatform<P> {
  return chainIdToPlatform(chainId) === platform
}

function createPlatformChecker<T extends Platform>(platform: T) {
  return (chainId: UniverseChainId): chainId is UniverseChainIdByPlatform<T> => isChainIdOnPlatform(chainId, platform)
}

export const isEVMChain = createPlatformChecker(Platform.EVM)
export const isSVMChain = createPlatformChecker(Platform.SVM)
