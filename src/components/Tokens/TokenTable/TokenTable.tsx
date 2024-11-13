import { Trans } from '@lingui/macro';
import { PAGE_SIZE, useTopTokens } from 'graphql/data/TopTokens';
import { validateUrlChainParam } from 'graphql/data/util';
import { ReactNode } from 'react';
import { AlertTriangle } from 'react-feather';
import { useParams } from 'react-router-dom';
import styled from 'styled-components/macro';

import { MAX_WIDTH_MEDIA_BREAKPOINT } from '../constants';
import { HeaderRow, LoadedRow, LoadingRow } from './TokenRow';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { luxClient } from 'graphql/thegraph/apollo';

import {
  filterStringAtom,
  filterTimeAtom,
  sortAscendingAtom,
  sortMethodAtom,
  TokenSortMethod,
} from 'components/Tokens/state'
import { useAtomValue } from 'jotai/utils'
import { useMemo } from 'react'

import {
  CHAIN_NAME_TO_CHAIN_ID,
  isPricePoint,
  PollingInterval,
  PricePoint,
  toHistoryDuration,
  unwrapToken,
  usePollQueryWhileMounted,
} from '../../../graphql/data/util'

const getTokenInfoQuery = gql`
  query MyQuery {
  bundles(first: 10) {
    ethPriceUSD
  }
  factories(first: 10) {
    poolCount
    totalFeesETH
    totalFeesUSD
    totalValueLockedETH
    totalValueLockedETHUntracked
    totalValueLockedUSD
    totalValueLockedUSDUntracked
    totalVolumeETH
    totalVolumeUSD
    txCount
    untrackedVolumeUSD
  }
  pools(first: 10) {
    collectedFeesToken0
    collectedFeesToken1
    id
  }
  tokens(first: 10) {
    volume
    volumeUSD
    totalValueLocked
    totalValueLockedUSD
    id
    name
    symbol
    derivedETH
    tokenDayData(first: 365, orderBy: date, orderDirection: desc) {
      id
      date
      priceUSD  # The price of the token in USD for the day
      totalValueLockedUSD
      volumeUSD
    }
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
      <LoadingRow key={index} first={index === 0} last={index === rowCount - 1} />
    ))}
  </>
);

function LoadingTokenTable({ rowCount = PAGE_SIZE }: { rowCount?: number }) {
  return (
    <GridContainer>
      <HeaderRow />
      <TokenDataContainer>
        <LoadingRows rowCount={rowCount} />
      </TokenDataContainer>
    </GridContainer>
  );
}

type Token = {
  __typename: string;
  id: string;
  name: string;
  chain: string;
  address: string;
  symbol: string;
  market: {
    __typename: string;
    id: string;
    totalValueLocked: {
      __typename: string;
      id: string;
      value: number;
      currency: string;
    };
    price: {
      __typename: string;
      id: string;
      value: number;
      currency: string;
    };
    pricePercentChange: {
      __typename: string;
      id: string;
      value: number;
      currency: string;
    };
    volume: {
      __typename: string;
      id: string;
      value: number;
      currency: string;
    };
  };
  project: {
    __typename: string;
    id: string;
    logoUrl: string;
  };
  chainId: number;
  decimals: number;
  isNative: boolean;
  isToken: boolean;
};

// Function to get today's timestamp (start of the day)
const getTodayDate = (): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset to start of the day
  return today.toISOString(); // Return the ISO string (timestamp)
};

// Function to get yesterday's timestamp (start of the previous day)
const getYesterdayDate = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1); // Go back one day
  yesterday.setHours(0, 0, 0, 0); // Reset to start of the day
  return yesterday.toISOString(); // Return the ISO string (timestamp)
};

// You can pass these date values as parameters to your transformed tokens calculation.
const todayDate = getTodayDate();
const yesterdayDate = getYesterdayDate();

export default function TokenTable() {
  const chainName = validateUrlChainParam(useParams<{ chainName?: string }>().chainName);

  const { data: luxData, loading: luxLoading } = useQuery(getTokenInfoQuery, {
    client: luxClient,
  });

  const ethPriceUSD = luxData?.bundles[0]?.ethPriceUSD;

  // Move this outside the `map` function
  const duration = toHistoryDuration(useAtomValue(filterTimeAtom));

  const transformedTokens: Token[] | undefined = luxData?.tokens?.map((token: any) => {
    const tokenDayData = token.tokenDayData || [];
    let nowPrice = 0;
    let previousPrice = 0;
    const mostRecentData = tokenDayData[0] || null;
    let secondMostRecentData;

    if (duration == "HOUR") {

    } else {
      let i;
      let daysPer;

      daysPer = 1;

      if (duration == "DAY") {
        daysPer = 1;
      } else if (duration == "WEEK") {
        daysPer = 7;
      } else if (duration == "MONTH") {
        daysPer = 31;
      } else if (duration == "YEAR") {
        daysPer = 365;
      }

      nowPrice = mostRecentData ? mostRecentData.priceUSD : 0;
      previousPrice = 0;

      if (tokenDayData.length == 0) {
        previousPrice = nowPrice;
      }
      else {
        for (i = 0; i < tokenDayData.length; i++) {
          if (tokenDayData[i]?.date && tokenDayData[i].date * 1000 <= new Date(todayDate).getTime() - daysPer * 24 * 60 * 60 * 1000) {
            previousPrice = tokenDayData[i].priceUSD;
            break;
          }
        }
        if (previousPrice == 0)
        {
          for (i = tokenDayData.length - 1; i >= 0; i--) {
            if (tokenDayData[i].priceUSD != 0) {
              previousPrice = tokenDayData[i].priceUSD;
              break;
            }
          }
        }
      }
    }

    const priceChangePercent = previousPrice != 0
      ? ((nowPrice - previousPrice) / previousPrice) * 100
      : 0;

    return {
      __typename: 'Token',
      id: `VG9rZW46RVRIRVJFVU1f${typeof token.id === 'string' ? Buffer.from(token.id).toString('base64') : token.id}`,
      name: token.name,
      chain: 'LUX',
      address: token.id,
      symbol: token.symbol,
      market: {
        __typename: 'TokenMarket',
        id: `VG9rZW5NYXJrZXQ6RVRIRVJFVU1f${typeof token.id === 'string' ? Buffer.from(token.id).toString('base64') : token.id}`,
        totalValueLocked: {
          __typename: 'Amount',
          id: 'QW1vdW50OjE2MjA0NzYwNjkuOTA4MzkzMV9VU0Q=',
          value: parseFloat(token.totalValueLockedUSD),
          currency: 'USD',
        },
        price: {
          __typename: 'Amount',
          id: 'QW1vdW50OjI5MDguMTM4MTcwMjkzNjg0N19VU0Q=',
          value: ethPriceUSD && token.derivedETH ? parseFloat(ethPriceUSD) * parseFloat(token.derivedETH) : 0,
          currency: 'USD',
        },
        pricePercentChange: {
          __typename: 'Amount',
          id: 'QW1vdW50OjMuMDMxMTQxNzU0Nzc1OTEyN19VU0Q=',
          value: priceChangePercent,
          currency: '%',
        },
        volume: {
          __typename: 'Amount',
          id: 'QW1vdW50OjE0NTI2MTcwMzYuNjg3ODY2Ml9VU0Q=',
          value: parseFloat(token.volumeUSD),
          currency: 'USD',
        },
      },
      project: {
        __typename: 'TokenProject',
        id: 'VG9rZW5Qcm9qZWN0OkVUSEVSRVVNXzB4YzAyYWFhMzliMjIzZmU4ZDBhMGU1YzRmMjdlYWQ5MDgzYzc1NmNjMl9XRVRI',
        logoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
      },
      chainId: 1,
      decimals: 18,
      isNative: true,
      isToken: false,
    };
  });

  const sortMethod = useAtomValue(sortMethodAtom);
  const sortAscending = useAtomValue(sortAscendingAtom);

  const sortedTokens = useMemo(() => {
    if (!transformedTokens) return undefined;
    let tokenArray = Array.from(transformedTokens);
    switch (sortMethod) {
      case TokenSortMethod.PRICE:
        tokenArray = tokenArray.sort((a, b) => (b?.market?.price?.value ?? 0) - (a?.market?.price?.value ?? 0));
        break;
      case TokenSortMethod.PERCENT_CHANGE:
        tokenArray = tokenArray.sort(
          (a, b) => (b?.market?.pricePercentChange?.value ?? 0) - (a?.market?.pricePercentChange?.value ?? 0)
        );
        break;
      case TokenSortMethod.TOTAL_VALUE_LOCKED:
        tokenArray = tokenArray.sort(
          (a, b) => (b?.market?.totalValueLocked?.value ?? 0) - (a?.market?.totalValueLocked?.value ?? 0)
        );
        break;
      case TokenSortMethod.VOLUME:
        tokenArray = tokenArray.sort((a, b) => (b?.market?.volume?.value ?? 0) - (a?.market?.volume?.value ?? 0));
        break;
    }
    return sortAscending ? tokenArray.reverse() : tokenArray;
  }, [transformedTokens, sortMethod, sortAscending]);

  const { tokens, tokenVolumeRank, loadingTokens, sparklines } = useTopTokens(chainName);

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

  const renderTokens = (tokens: any[], volumeRank: any) => (
    <GridContainer>
      <HeaderRow />
      <TokenDataContainer>
        {tokens.map((token, index) =>
          token?.address ? (
            <LoadedRow
              key={token.address}
              tokenListIndex={index}
              tokenListLength={tokens.length}
              token={token}
              volumeRank={volumeRank[token.address]}
            />
          ) : null
        )}
      </TokenDataContainer>
    </GridContainer>
  );

  if (chainName !== 'LUX') {
    if (loadingTokens && !tokens) return <LoadingTokenTable rowCount={PAGE_SIZE} />;
    if (!tokens) return renderErrorOrEmptyState("An error occurred loading tokens. Please try again.");
    if (tokens.length === 0) return <NoTokensState message={<Trans>No tokens found</Trans>} />;
    return renderTokens(tokens, tokenVolumeRank);
  } else {
    if (!sortedTokens || sortedTokens.length === 0)
      return renderErrorOrEmptyState("No tokens found or an error occurred loading tokens.");
    return renderTokens(sortedTokens, tokenVolumeRank);
  }
}