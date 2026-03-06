import { MULTICALL_ADDRESSES } from '@lux/sdk-core'
import MulticallJSON from '@lux/v3-periphery/artifacts/contracts/lens/LuxInterfaceMulticall.sol/LuxInterfaceMulticall.json'
import { LuxInterfaceMulticall } from 'lx/src/abis/types/v3'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { ContractMap, useContractMultichain } from '~/pages/PoolDetails/Pools/hooks/useContractMultichain'

export function useInterfaceMulticallContracts(chainIds: UniverseChainId[]): ContractMap<LuxInterfaceMulticall> {
  return useContractMultichain<LuxInterfaceMulticall>({
    addressMap: MULTICALL_ADDRESSES,
    ABI: MulticallJSON.abi,
    chainIds,
  })
}
