import { Trans } from '@lingui/macro';
import { PAGE_SIZE } from 'graphql/data/TopTokens';
import { validateUrlChainParam } from 'graphql/data/util';
import { AlertTriangle, Percent } from 'react-feather';
import { useParams } from 'react-router-dom';
import styled from 'styled-components/macro';

import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { ReactNode, useCallback, useEffect, useState, useRef } from 'react';
import { MAX_WIDTH_MEDIA_BREAKPOINT } from '../Tokens/constants';
import { HeaderRow, LoadedRow, LoadingRow } from './PoolRow';

import { apolloClient } from 'graphql/data/apollo';
import { arbitrumNetClient, avalancheNetClient, baseNetClient, bnbNetClient, celoNetClient, ethereumNetClient, luxNetClient, optimismNetClient, polygonNetClient, zooNetClient } from 'graphql/thegraph/apollo';

const getPoolsInfoQuery = gql`
query MyQuery {
  bundles {
    ethPriceUSD
  }
  pools(first: 20, orderBy: totalValueLockedUSD, orderDirection: desc) {
    liquidity
    poolDayData(first: 1, orderBy: date, orderDirection: desc) {
      volumeUSD
      date
    }
    poolHourData(first: 1, orderBy: periodStartUnix, orderDirection: desc) {
      volumeUSD
      periodStartUnix
    }
    token0 {
      id
      symbol
    }
    token1 {
      id
      symbol
    }
    feeTier
    feesUSD
    totalValueLockedUSD
    collectedFeesUSD
    volumeUSD
  }
}
`;

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: ${MAX_WIDTH_MEDIA_BREAKPOINT};
  background-color: ${({ theme }) => theme.backgroundSurface};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  margin: 0 auto;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.backgroundOutline};
`;

const TokenDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  height: 100%;
  width: 100%;
`;

const NoTokenDisplay = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 60px;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 16px;
  font-weight: 500;
  align-items: center;
  padding: 0px 28px;
  gap: 8px;
`;

function NoTokensState({ message }: { message: ReactNode }) {
  return (
    <GridContainer>
      <HeaderRow />
      <NoTokenDisplay>{message}</NoTokenDisplay>
    </GridContainer>
  );
}

const LoadingRows = ({ rowCount }: { rowCount: number }) => (
  <>
    {Array.from({ length: rowCount }, (_, index) => (
      <LoadingRow key={index} first={index == 0} last={index == rowCount - 1} />
    ))}
  </>
);

function LoadingPoolsTable({ rowCount = PAGE_SIZE }: { rowCount?: number }) {
  return (
    <GridContainer>
      <HeaderRow />
      <TokenDataContainer>
        <LoadingRows rowCount={rowCount} />
      </TokenDataContainer>
    </GridContainer>
  );
}

type PoolData = {
  totalValueLockedUSD: number;
  hourVolume: number;
  dayVolume: number;
  APR: number;
  dayTvlPercentage: number;
  token0Symbol: string;
  token1Symbol: string;
  token0Address: string;
  token1Address: string;
  feeTier: number;
  feesUSD: number;
  collectedFeesUSD: number;
  lastDate: number;
  lastHour: number;
};

export default function PoolsTable() {
  const chainName = validateUrlChainParam(useParams<{ chainName?: string }>().chainName);
  const luxClient =
    chainName == 'LUX' ? luxNetClient :
    chainName == 'ZOO' ? zooNetClient :
    chainName == 'ARBITRUM' ? arbitrumNetClient :
    chainName == 'POLYGON' ? polygonNetClient :
    chainName == 'ETHEREUM' ? ethereumNetClient :
    chainName == 'OPTIMISM' ? optimismNetClient :
    chainName == 'CELO' ? celoNetClient :
    chainName == 'BASE' ? baseNetClient :
    chainName == 'BNB' ? bnbNetClient :
    chainName == 'AVALANCHE' ? avalancheNetClient :
    chainName == 'ZORA' ? apolloClient :
    apolloClient;
  
  const { data: luxData, loading: luxLoading, refetch } = useQuery(getPoolsInfoQuery, {
    client: luxClient,
    pollInterval: 10000,
  });
  
  const ethPriceUSD = luxData?.bundles[0]?.ethPriceUSD;
  const [transformedPools, setTransformedPools] = useState<any[] | undefined>(undefined);

  const calculateTransformedPools = useCallback((): PoolData[] => {
    refetch();
    if (!luxData?.pools) return [];

    // Apply a filter before mapping
  const filteredPools = luxData.pools.filter((pool: any) => {
    return pool.volumeUSD > 0;
  });

    return filteredPools.map((pool: any) => ({
      totalValueLockedUSD: pool.totalValueLockedUSD || 0,
      hourVolume: pool.poolHourData?.[0]?.volumeUSD || 0,
      dayVolume: pool.poolDayData?.[0]?.volumeUSD || 0,
      APR: pool.poolDayData?.volumeUSD || 0,
      dayTvlPercentage: pool.poolDayData?.[0]?.volumeUSD || 0,
      token0Symbol: pool.token0?.symbol || '',
      token1Symbol: pool.token1?.symbol || '',
      token0Address: pool.token0?.id || '0x000000',
      token1Address: pool.token1?.id || '0x000000',
      feeTier: pool.feeTier || 0,
      feesUSD: pool.feesUSD || 0,
      collectedFeesUSD: pool.feesUSD || 0,
      lastDate: pool.poolDayData?.[0]?.date || 0,
      lastHour: pool.poolHourData?.[0]?.periodStartUnix || 0,

    }));
  }, [luxData, refetch]);

  useEffect(() => {
    setTransformedPools(calculateTransformedPools());
  }, [calculateTransformedPools]);


   // Use a ref for interval management
   const intervalRef = useRef<NodeJS.Timer | null>(null);

   // Set up the interval to recalculate transformed tokens every 12 seconds
   useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTransformedPools([]);
      const transformed = calculateTransformedPools();
      setTransformedPools(transformed);
    }, 12000);
  
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [calculateTransformedPools]);

  const renderErrorOrEmptyState = (message: ReactNode) => (
    <NoTokensState
      message={
        <>
          <AlertTriangle size={16} />
          <Trans>{message}</Trans>
        </>
      }
    />
  );

  const renderPools = (pools: any[]) => (
    <GridContainer>
      <HeaderRow />
      <TokenDataContainer>
        {pools.map((pool, index) =>
          <LoadedRow
            poolListIndex={ index+1 }
            poolListLength={pool.length}
            pool={pool}
          />
        )}
      </TokenDataContainer>
    </GridContainer>
  );

  if (luxLoading || !transformedPools) return <LoadingPoolsTable rowCount={PAGE_SIZE} />;
  if (!transformedPools || transformedPools.length == 0)
    return renderErrorOrEmptyState("No tokens found or an error occurred loading tokens.");
  return renderPools(transformedPools);
}