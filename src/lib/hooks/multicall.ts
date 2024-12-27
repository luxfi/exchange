import { useWeb3React } from '@web3-react/core'
import useBlockNumber from 'lib/hooks/useBlockNumber'
import multicall from 'lib/state/multicall'
import { SkipFirst } from 'types/tuple'

export type { CallStateResult } from 'redux-multicall' // re-export for convenience
export { NEVER_RELOAD } from 'redux-multicall' // re-export for convenience
import { RPC_URLS } from 'constants/networks'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { SupportedChainId } from 'constants/chains'

// Create wrappers for hooks so consumers don't need to get latest block themselves

type SkipFirstTwoParams<T extends (...args: any) => any> = SkipFirst<Parameters<T>, 2>

export function useMultipleContractSingleData(
  ...args: SkipFirstTwoParams<typeof multicall.hooks.useMultipleContractSingleData>
) {
  const { chainId, latestBlock } = useCallContext()
  return multicall.hooks.useMultipleContractSingleData(chainId, latestBlock, ...args)
}

export function useSingleCallResult(...args: SkipFirstTwoParams<typeof multicall.hooks.useSingleCallResult>) {
  const { chainId, latestBlock } = useCallContext()
  return multicall.hooks.useSingleCallResult(chainId, latestBlock, ...args)
}

export function useSingleCallResultForTable(
  chainId: number, 
  ...args: SkipFirstTwoParams<typeof multicall.hooks.useSingleCallResult>
) {
  const { latestBlock } = useCallContextWithChainId(chainId); // Only use `latestBlock` from context
  console.log("args2 = ", chainId, latestBlock, ...args);
  return multicall.hooks.useSingleCallResult(chainId, latestBlock, ...args)
}

export function useSingleContractMultipleData(
  ...args: SkipFirstTwoParams<typeof multicall.hooks.useSingleContractMultipleData>
) {
  const { chainId, latestBlock } = useCallContext()
  return multicall.hooks.useSingleContractMultipleData(chainId, latestBlock, ...args)
}


export function useSingleContractMultipleDataForTable(
  chainId: number, 
  ...args: SkipFirstTwoParams<typeof multicall.hooks.useSingleContractMultipleData>
) {
  const { latestBlock } = useCallContextWithChainId(chainId)
  console.log("args1 = ",...args);
  return multicall.hooks.useSingleContractMultipleData(chainId, latestBlock, ...args)
}

export function useSingleContractWithCallData(
  ...args: SkipFirstTwoParams<typeof multicall.hooks.useSingleContractWithCallData>
) {
  const { chainId, latestBlock } = useCallContext()
  return multicall.hooks.useSingleContractWithCallData(chainId, latestBlock, ...args)
}

function useCallContext() {
  const { chainId } = useWeb3React()
  const latestBlock = useBlockNumber()
  return { chainId, latestBlock }
}

function useCallContextWithChainId(chainId?: number) {
  const [latestBlock, setLatestBlock] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!chainId) return;

    const fetchLatestBlock = async () => {
      const rpcUrl = RPC_URLS[chainId as SupportedChainId]?.[0];
      console.log("rpcUrl",rpcUrl);
      if (!rpcUrl) {
        console.error(`No RPC URL found for chain ID: ${chainId}`);
        return;
      }

      try {
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
        const blockNumber = await provider.getBlockNumber();
        console.log("blockNumberResult",blockNumber);
        setLatestBlock(blockNumber);
      } catch (error) {
        console.error(`Failed to fetch block number for chain ID ${chainId}:`, error);
      }
    };

    fetchLatestBlock();
  }, [chainId]);

  return { chainId, latestBlock };
}
