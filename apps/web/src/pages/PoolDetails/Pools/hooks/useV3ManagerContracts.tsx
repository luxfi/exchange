import { NONFUNGIBLE_POSITION_MANAGER_ADDRESSES as V3NFT_ADDRESSES } from '@luxamm/sdk-core'
import NFTPositionManagerJSON from '@luxamm/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json'
import { NonfungiblePositionManager } from '@luxexchange/lx/src/abis/types/v3'
import { UniverseChainId } from '@luxexchange/lx/src/features/chains/types'
import { ContractMap, useContractMultichain } from '~/pages/PoolDetails/Pools/hooks/useContractMultichain'

export function useV3ManagerContracts(chainIds: UniverseChainId[]): ContractMap<NonfungiblePositionManager> {
  return useContractMultichain<NonfungiblePositionManager>({
    addressMap: V3NFT_ADDRESSES,
    ABI: NFTPositionManagerJSON.abi,
    chainIds,
  })
}
