import { MULTICALL_ADDRESSES } from '@luxamm/sdk-core'
import MulticallJSON from '@luxamm/v3-periphery/artifacts/contracts/lens/LxInterfaceMulticall.sol/LxInterfaceMulticall.json'
import { LuxInterfaceMulticall } from '@l.x/lx/src/abis/types/v3'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { ContractMap, useContractMultichain } from '~/pages/PoolDetails/Pools/hooks/useContractMultichain'

export function useInterfaceMulticallContracts(chainIds: UniverseChainId[]): ContractMap<LuxInterfaceMulticall> {
  return useContractMultichain<LuxInterfaceMulticall>({
    addressMap: MULTICALL_ADDRESSES,
    ABI: MulticallJSON.abi,
    chainIds,
  })
}
