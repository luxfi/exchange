<<<<<<< HEAD
import { MULTICALL_ADDRESSES } from '@luxamm/sdk-core'
import MulticallJSON from '@luxamm/v3-periphery/artifacts/contracts/lens/LXInterfaceMulticall.sol/LXInterfaceMulticall.json'
import { LXInterfaceMulticall } from '@l.x/lx/src/abis/types/v3'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { ContractMap, useContractMultichain } from '~/pages/PoolDetails/Pools/hooks/useContractMultichain'

export function useInterfaceMulticallContracts(chainIds: UniverseChainId[]): ContractMap<LXInterfaceMulticall> {
  return useContractMultichain<LXInterfaceMulticall>({
=======
import { MULTICALL_ADDRESSES } from '@uniswap/sdk-core'
import MulticallJSON from '@uniswap/v3-periphery/artifacts/contracts/lens/UniswapInterfaceMulticall.sol/UniswapInterfaceMulticall.json'
import { UniswapInterfaceMulticall } from 'uniswap/src/abis/types/v3'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { ContractMap, useContractMultichain } from '~/pages/PoolDetails/Pools/hooks/useContractMultichain'

export function useInterfaceMulticallContracts(chainIds: UniverseChainId[]): ContractMap<UniswapInterfaceMulticall> {
  return useContractMultichain<UniswapInterfaceMulticall>({
>>>>>>> upstream/main
    addressMap: MULTICALL_ADDRESSES,
    ABI: MulticallJSON.abi,
    chainIds,
  })
}
