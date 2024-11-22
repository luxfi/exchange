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
import { useMemo, useEffect, useState, useCallback, useRef } from 'react'

import {
  CHAIN_NAME_TO_CHAIN_ID,
  isPricePoint,
  PollingInterval,
  PricePoint,
  toHistoryDuration,
  unwrapToken,
  usePollQueryWhileMounted,
} from '../../../graphql/data/util'
import { id } from 'make-plural';
import { TOKENS_LUX_LIST } from 'tokens-lux/tokens'

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
    tokenHourData(first: 365, orderBy: periodStartUnix, orderDirection: desc) {
      id
      periodStartUnix
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
      <LoadingRow key={index} first={index == 0} last={index == rowCount - 1} />
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

// Function to get today's timestamp (start of the day)
const getTodayDate = (): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset to start of the day
  return today.toISOString(); // Return the ISO string (timestamp)
};

// Function to get the timestamp rounded to the most recent hour
const getCurrentHourTimestamp = (): string => {
  const now = new Date();
  now.setMinutes(0, 0, 0); // Reset minutes, seconds, and milliseconds to 0
  return now.toISOString(); // Return the ISO string (timestamp)
};

// You can pass these date values as parameters to your transformed tokens calculation.
const todayDate = getTodayDate();
const currentHourTime = getCurrentHourTimestamp();
const tokenAddresses = TOKENS_LUX_LIST.tokens
  .filter((token) => token.chainId === 96369) // Filter by chainId
  .map((token) => token.address.toUpperCase()); // Extract the address

  console.log("tokenAddresses",tokenAddresses);

export default function TokenTable() {
  const chainName = validateUrlChainParam(useParams<{ chainName?: string }>().chainName);
  console.log("chainName", chainName);

  const { data: luxData, loading: luxLoading, refetch } = useQuery(getTokenInfoQuery, {
    client: luxClient,
    pollInterval: 5000,
  });

  const ethPriceUSD = luxData?.bundles[0]?.ethPriceUSD;
  const duration = toHistoryDuration(useAtomValue(filterTimeAtom));

  const [transformedTokens, setTransformedTokens] = useState<any[] | undefined>(undefined);

  // Helper function to calculate transformed tokens
  const calculateTransformedTokens = useCallback(() => {
    refetch();
    return luxData?.tokens
    ?.filter((token: any) => tokenAddresses.includes(token.id.toUpperCase())).map((token: any) => {
      const tokenDayData = token.tokenDayData || [];
      const tokenHourData = token.tokenHourData || [];
      let nowPrice = 0;
      let previousPrice = 0;
      let mostRecentData = null;

      if (duration == "HOUR") {
        // Process hourly duration logic
        mostRecentData = tokenHourData[0] || null;
        nowPrice = mostRecentData ? mostRecentData.priceUSD : 0;
        previousPrice = nowPrice;
        if ( tokenHourData[1]?.periodStartUnix && tokenHourData[1].periodStartUnix * 1000 <= new Date(currentHourTime).getTime() - 3600 * 1000 && tokenHourData[1].priceUSD != 0 )
          previousPrice = tokenHourData[1].priceUSD;
      } else {
        let i;
        let daysPer;

        mostRecentData = tokenDayData[0] || null;
        nowPrice = mostRecentData ? mostRecentData.priceUSD : 0;
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

        if (tokenDayData.length == 0) {
          previousPrice = nowPrice;
        } else {
          for (i = 0; i < tokenDayData.length; i++) {
            if (tokenDayData[i]?.date && tokenDayData[i].date * 1000 <= new Date(todayDate).getTime() - daysPer * 24 * 60 * 60 * 1000) {
              previousPrice = tokenDayData[i].priceUSD;
              break;
            }
          }
          if (previousPrice == 0) {
            for (i = tokenDayData.length - 1; i >= 0; i--) {
              if (tokenDayData[i].priceUSD != 0) {
                previousPrice = tokenDayData[i].priceUSD;
                break;
              }
            }
          }
        }
      }

      let priceChangePercent = previousPrice !== 0
        ? ((ethPriceUSD * parseFloat(token.derivedETH) - previousPrice) / previousPrice) * 100
        : 0;

      if (nowPrice == 0)
        priceChangePercent = 0;

      return {
        __typename: 'Token',
        id: `VG9rZW46RVRIRVJFVU1f${typeof token.id == 'string' ? Buffer.from(token.id).toString('base64') : token.id}`,
        name: token.name,
        chain: 'LUX',
        address: token.id,
        symbol: token.symbol,
        market: {
          __typename: 'TokenMarket',
          id: `VG9rZW5NYXJrZXQ6RVRIRVJFVU1f${typeof token.id == 'string' ? Buffer.from(token.id).toString('base64') : token.id}`,
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
  }, [luxData, ethPriceUSD, duration]);

  // Update transformed tokens when luxData, ethPriceUSD, or duration changes
  useEffect(() => {
    setTransformedTokens(calculateTransformedTokens());
  }, [calculateTransformedTokens]);

  // Use a ref for interval management
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  // Set up the interval to recalculate transformed tokens every 12 seconds
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setTransformedTokens(calculateTransformedTokens());
    }, 12000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [calculateTransformedTokens]);

  const transformedTokenVolumeRank = useMemo(
    () =>
      transformedTokens
        ?.sort((a, b) => {
          if (!a.market?.volume || !b.market?.volume) return 0
          return a.market.volume.value > b.market.volume.value ? -1 : 1
        })
        .reduce((acc, cur, i) => {
          if (!cur.address) return acc
          return {
            ...acc,
            [cur.address]: i + 1,
          }
        }, {}) ?? {},
    [transformedTokens]
  )

  const filterString = useAtomValue(filterStringAtom)

  const lowercaseFilterString = useMemo(() => filterString.toLowerCase(), [filterString])

  const filteredTokens = useMemo(() => {
    if (!transformedTokens) return undefined
    let returnTokens = transformedTokens
    if (lowercaseFilterString) {
      returnTokens = returnTokens?.filter((token) => {
        const addressIncludesFilterString = token?.address?.toLowerCase().includes(lowercaseFilterString)
        const nameIncludesFilterString = token?.name?.toLowerCase().includes(lowercaseFilterString)
        const symbolIncludesFilterString = token?.symbol?.toLowerCase().includes(lowercaseFilterString)
        return nameIncludesFilterString || symbolIncludesFilterString || addressIncludesFilterString
      })
    }
    return returnTokens
  }, [transformedTokens, lowercaseFilterString])

  const sortMethod = useAtomValue(sortMethodAtom);
  const sortAscending = useAtomValue(sortAscendingAtom);

  const sortedTokens = useMemo(() => {
    if (!filteredTokens) return undefined;
    let tokenArray = Array.from(filteredTokens);
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
  }, [filteredTokens, sortMethod, sortAscending]);

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
    if (tokens.length == 0) return <NoTokensState message={<Trans>No tokens found</Trans>} />;
    return renderTokens(tokens, tokenVolumeRank);
  } else {
    if (!sortedTokens || sortedTokens.length == 0)
      return renderErrorOrEmptyState("No tokens found or an error occurred loading tokens.");
    return renderTokens(sortedTokens, transformedTokenVolumeRank);
  }
}