import { CreateAuctionConfigKey, DynamicConfigs, useDynamicConfigValue } from '@luxexchange/gating'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { isUniverseChainIdArrayType } from 'lx/src/features/gating/typeGuards'

const DEFAULT_ALLOWED_NETWORKS = [UniverseChainId.Mainnet, UniverseChainId.Unichain, UniverseChainId.Base]

export function useCreateNewTokenAllowedNetworks(): UniverseChainId[] {
  const allowedNetworkIds = useDynamicConfigValue<
    DynamicConfigs.CreateAuction,
    CreateAuctionConfigKey.AllowedTokenCreationNetworks,
    UniverseChainId[]
  >({
    config: DynamicConfigs.CreateAuction,
    key: CreateAuctionConfigKey.AllowedTokenCreationNetworks,
    defaultValue: DEFAULT_ALLOWED_NETWORKS,
    customTypeGuard: isUniverseChainIdArrayType,
  })

  return allowedNetworkIds.filter((id): id is UniverseChainId =>
    Object.values(UniverseChainId).includes(id as UniverseChainId),
  )
}
