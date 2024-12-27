import { BigNumber } from '@ethersproject/bignumber'
import { CallStateResult, useSingleCallResult, useSingleContractMultipleData, useSingleCallResultForTable, useSingleContractMultipleDataForTable } from 'lib/hooks/multicall'
import { useMemo } from 'react'
import multicall from 'lib/state/multicall'
import { PositionDetails } from 'types/position'

import { useV3NFTPositionManagerContract, useV3NFTPositionManagerContractExtended } from './useContract'

export type { CallStateResult } from '@uniswap/redux-multicall' // re-export for convenience
export { NEVER_RELOAD } from '@uniswap/redux-multicall' // re-export for convenience
import { RPC_URLS } from 'constants/networks'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { SupportedChainId } from 'constants/chains'

interface UseV3PositionsResults {
  loading: boolean
  positions: PositionDetails[] | undefined
}

function useV3PositionsFromTokenIds(tokenIds: BigNumber[] | undefined): UseV3PositionsResults {
  const positionManager = useV3NFTPositionManagerContract()
  const inputs = useMemo(() => (tokenIds ? tokenIds.map((tokenId) => [BigNumber.from(tokenId)]) : []), [tokenIds])
  const results = useSingleContractMultipleData(positionManager, 'positions', inputs)

  const loading = useMemo(() => results.some(({ loading }) => loading), [results])
  const error = useMemo(() => results.some(({ error }) => error), [results])

  const positions = useMemo(() => {
    if (!loading && !error && tokenIds) {
      return results.map((call, i) => {
        const tokenId = tokenIds[i]
        const result = call.result as CallStateResult
        return {
          tokenId,
          fee: result.fee,
          feeGrowthInside0LastX128: result.feeGrowthInside0LastX128,
          feeGrowthInside1LastX128: result.feeGrowthInside1LastX128,
          liquidity: result.liquidity,
          nonce: result.nonce,
          operator: result.operator,
          tickLower: result.tickLower,
          tickUpper: result.tickUpper,
          token0: result.token0,
          token1: result.token1,
          tokensOwed0: result.tokensOwed0,
          tokensOwed1: result.tokensOwed1,
        }
      })
    }
    return undefined
  }, [loading, error, results, tokenIds])

  return {
    loading,
    positions: positions?.map((position, i) => ({ ...position, tokenId: inputs[i][0] })),
  }
}
function useV3PositionsFromTokenIdsWithchainId(tokenIds: BigNumber[] | undefined, chainId: number): UseV3PositionsResults {
  const positionManager = useV3NFTPositionManagerContractExtended(undefined,chainId);
  const inputs = useMemo(() => (tokenIds ? tokenIds.map((tokenId) => [BigNumber.from(tokenId)]) : []), [tokenIds])
  const results = useSingleContractMultipleDataForTable(chainId, positionManager, 'positions', inputs)

  const loading = useMemo(() => results.some(({ loading }) => loading), [results])
  const error = useMemo(() => results.some(({ error }) => error), [results])

  const positions = useMemo(() => {
    if (!loading && !error && tokenIds) {
      return results.map((call, i) => {
        const tokenId = tokenIds[i]
        const result = call.result as CallStateResult
        return {
          tokenId,
          fee: result.fee,
          feeGrowthInside0LastX128: result.feeGrowthInside0LastX128,
          feeGrowthInside1LastX128: result.feeGrowthInside1LastX128,
          liquidity: result.liquidity,
          nonce: result.nonce,
          operator: result.operator,
          tickLower: result.tickLower,
          tickUpper: result.tickUpper,
          token0: result.token0,
          token1: result.token1,
          tokensOwed0: result.tokensOwed0,
          tokensOwed1: result.tokensOwed1,
        }
      })
    }
    return undefined
  }, [loading, error, results, tokenIds])

  return {
    loading,
    positions: positions?.map((position, i) => ({ ...position, tokenId: inputs[i][0] })),
  }
}

interface UseV3PositionResults {
  loading: boolean
  position: PositionDetails | undefined
}

export function useV3PositionFromTokenId(tokenId: BigNumber | undefined): UseV3PositionResults {
  const position = useV3PositionsFromTokenIds(tokenId ? [tokenId] : undefined)
  return {
    loading: position.loading,
    position: position.positions?.[0],
  }
}

export function useV3Positions(account: string | null | undefined): UseV3PositionsResults {
  const positionManager = useV3NFTPositionManagerContract()

  const { loading: balanceLoading, result: balanceResult } = useSingleCallResult(positionManager, 'balanceOf', [
    account ?? undefined,
  ])

  // we don't expect any account balance to ever exceed the bounds of max safe int
  const accountBalance: number | undefined = balanceResult?.[0]?.toNumber()

  const tokenIdsArgs = useMemo(() => {
    if (accountBalance && account) {
      const tokenRequests = []
      for (let i = 0; i < accountBalance; i++) {
        tokenRequests.push([account, i])
      }
      return tokenRequests
    }
    return []
  }, [account, accountBalance])

  const tokenIdResults = useSingleContractMultipleData(positionManager, 'tokenOfOwnerByIndex', tokenIdsArgs)
  const someTokenIdsLoading = useMemo(() => tokenIdResults.some(({ loading }) => loading), [tokenIdResults])

  const tokenIds = useMemo(() => {
    if (account) {
      return tokenIdResults
        .map(({ result }) => result)
        .filter((result): result is CallStateResult => !!result)
        .map((result) => BigNumber.from(result[0]))
    }
    return []
  }, [account, tokenIdResults])

  const { positions, loading: positionsLoading } = useV3PositionsFromTokenIds(tokenIds)

  return {
    loading: someTokenIdsLoading || balanceLoading || positionsLoading,
    positions,
  }
}
export function useAllV3Positions(): UseV3PositionsResults {
  const positionManager = useV3NFTPositionManagerContract();

  // Get the total supply of NFTs (total number of positions ever created)
  const { loading: totalSupplyLoading, result: totalSupplyResult } = useSingleCallResult(positionManager, 'totalSupply');
  const totalSupply: number | undefined = totalSupplyResult?.[0]?.toNumber();

  // Generate token ID arguments for querying positions
  const tokenIdsArgs = useMemo(() => {
    if (totalSupply) {
      const tokenRequests = [];
      for (let i = 0; i < 20; i++) {
        tokenRequests.push([i]);
      }
      return tokenRequests;
    }
    return [];
  }, [totalSupply]);

  // Query the owner of each token ID
  const ownerResults = useSingleContractMultipleData(positionManager, 'ownerOf', tokenIdsArgs);
  const someOwnersLoading = useMemo(() => ownerResults.some(({ loading }) => loading), [ownerResults]);

  // Extract valid token IDs that have owners
  const tokenIds = useMemo(() => {
    return ownerResults
      .map(({ result }, index) => (result && result[0] ? BigNumber.from(index) : null))
      .filter((id): id is BigNumber => id !== null);
  }, [ownerResults]);

  // Fetch positions from the valid token IDs
  const { positions, loading: positionsLoading } = useV3PositionsFromTokenIds(tokenIds);

  return {
    loading: totalSupplyLoading || someOwnersLoading || positionsLoading,
    positions,
  };
}

export function useAllV3Positions1(chainId: any): UseV3PositionsResults {
  const positionManager = useV3NFTPositionManagerContractExtended(undefined,chainId);
  console.log("positionManager = ", positionManager);
  // Get the total supply of NFTs (total number of positions ever created)
  // const { loading: totalSupplyLoading, result: totalSupplyResult } = useSingleCallResultForTable(chainId, positionManager, 'totalSupply');
  const { latestBlock } = useCallContextWithChainId(chainId); // Only use `latestBlock` from context

  let { loading: totalSupplyLoading, result: totalSupplyResult } = multicall.hooks.useSingleCallResult(chainId, latestBlock, positionManager, 'totalSupply');
  
  const totalSupply: number | undefined = totalSupplyResult?.[0]?.toNumber();

  console.log("ownerResult = ", chainId, latestBlock, positionManager, 'totalSupply', totalSupplyResult);
  // Generate token ID arguments for querying positions
  const tokenIdsArgs = useMemo(() => {

    if (totalSupply) {
      const tokenRequests = [];
      for (let i = 0; i < 100; i++) {
        tokenRequests.push([i]);
      }
      return tokenRequests;
    }
    return [];
  }, [totalSupply]);


  // Query the owner of each token ID
  const ownerResults = useSingleContractMultipleDataForTable(chainId, positionManager, 'ownerOf', tokenIdsArgs);

  const someOwnersLoading = useMemo(() => ownerResults.some(({ loading }) => loading), [ownerResults]);

  // Extract valid token IDs that have owners
  const tokenIds = useMemo(() => {
    return ownerResults
      .map(({ result }, index) => (result && result[0] ? BigNumber.from(index) : null))
      .filter((id): id is BigNumber => id !== null);
  }, [ownerResults]);

  // Fetch positions from the valid token IDs
  const { positions, loading: positionsLoading } = useV3PositionsFromTokenIdsWithchainId(tokenIds, chainId);

  return {
    loading: totalSupplyLoading || someOwnersLoading || positionsLoading,
    positions,
  };
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
