<<<<<<< HEAD
import { CreateAuctionConfigKey, DynamicConfigs, useDynamicConfigValue } from '@l.x/gating'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { isUniverseChainIdArrayType } from 'lx/src/features/gating/typeGuards'
=======
import { CreateAuctionConfigKey, DynamicConfigs, useDynamicConfigValue } from '@universe/gating'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { isUniverseChainIdArrayType } from 'uniswap/src/features/gating/typeGuards'
>>>>>>> upstream/main

const DEFAULT_ALLOWED_NETWORKS = [
  UniverseChainId.Mainnet,
  UniverseChainId.Unichain,
  UniverseChainId.Base,
  UniverseChainId.ArbitrumOne,
]

export function useCreateAuctionAllowedNetworks(): UniverseChainId[] {
  const allowedNetworkIds = useDynamicConfigValue<
    DynamicConfigs.CreateAuction,
    CreateAuctionConfigKey.AllowedNetworks,
    UniverseChainId[]
  >({
    config: DynamicConfigs.CreateAuction,
    key: CreateAuctionConfigKey.AllowedNetworks,
    defaultValue: DEFAULT_ALLOWED_NETWORKS,
    customTypeGuard: isUniverseChainIdArrayType,
  })

  return allowedNetworkIds.filter((id): id is UniverseChainId =>
    Object.values(UniverseChainId).includes(id as UniverseChainId),
  )
}
