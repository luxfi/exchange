import { Trans } from '@lingui/macro';
import { PAGE_SIZE, useTopTokens } from 'graphql/data/TopTokens';
import { validateUrlChainParam } from 'graphql/data/util';
import { ReactNode } from 'react';
import { AlertTriangle } from 'react-feather';
import { useParams } from 'react-router-dom';
import styled from 'styled-components/macro';

import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { MAX_WIDTH_MEDIA_BREAKPOINT } from '../constants';
import { HeaderRow, LoadedRow, LoadingRow } from './TokenRow';

import {
  filterStringAtom,
  filterTimeAtom,
  sortAscendingAtom,
  sortMethodAtom,
  TokenSortMethod,
} from 'components/Tokens/state';
import { luxNetClient, zooNetClient } from 'graphql/thegraph/apollo';
import { useAtomValue } from 'jotai/utils';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { TOKENS_LUX_LIST } from 'tokens-lux/tokens';
import {
  CHAIN_NAME_TO_CHAIN_ID,
  toHistoryDuration
} from '../../../graphql/data/util';

const getTokenInfoQuery = gql`
  query MyQuery {
  bundles {
    ethPriceUSD
  }
  factories {
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
  pools {
    collectedFeesToken0
    collectedFeesToken1
    id
  }
  tokens {
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
    tokenHourData(first: 24, orderBy: periodStartUnix, orderDirection: desc) {
      id
      periodStartUnix
      priceUSD  # The price of the token in USD for the day
      totalValueLockedUSD
      volumeUSD
    }
    token5MinData(first: 12, orderBy: periodStartUnix, orderDirection: desc) {
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

export default function TokenTable() {
  const chainName = validateUrlChainParam(useParams<{ chainName?: string }>().chainName);
  let luxClient;

  if (chainName == 'LUX') {
    luxClient = luxNetClient;
  } else {
    luxClient = zooNetClient;
  }
  const tokenAddresses = TOKENS_LUX_LIST.tokens
    .filter((token) => token.chainId === CHAIN_NAME_TO_CHAIN_ID[chainName]) // Filter by chainId
    .map((token) => token.address.toUpperCase()); // Extract the address
  const { data: luxData, loading: luxLoading, refetch } = useQuery(getTokenInfoQuery, {
    client: luxClient,
    pollInterval: 5000,
  });

  const ethPriceUSD = luxData?.bundles[0]?.ethPriceUSD;
  const duration = toHistoryDuration(useAtomValue(filterTimeAtom));

  const [transformedTokens, setTransformedTokens] = useState<any[] | undefined>(undefined);

  const getTokenNameByAddressAndChainId = (address: string, chainId: number) => {
    const token = TOKENS_LUX_LIST.tokens.find(
        (token) => token.address.toLowerCase() === address.toLowerCase() && token.chainId === chainId
    );
    return token ? token.name : null; // Return `null` if not found
};
  // Helper function to calculate transformed tokens
  const calculateTransformedTokens = useCallback(() => {
    refetch();
    return luxData?.tokens
      ?.filter((token: any) => tokenAddresses.includes(token.id.toUpperCase())  && parseFloat(token.totalValueLockedUSD) !== 0).map((token: any) => {
        const tokenDayData = token.tokenDayData || [];
        const tokenHourData = token.tokenHourData || [];
        const token5MinData = token.token5MinData || [];
        let nowPrice = 0;
        let previousPrice = 0;
        let mostRecentData = null;
        let volumeUSD = 0;
        let i;

        if (duration == "HOUR") {
          // Process hourly duration logic
          mostRecentData = tokenHourData[0] || null;
          nowPrice = mostRecentData ? mostRecentData.priceUSD : 0;
          previousPrice = nowPrice;
          if (tokenHourData[1]?.periodStartUnix && tokenHourData[1].periodStartUnix * 1000 <= new Date(currentHourTime).getTime() - 3600 * 1000 && tokenHourData[1].priceUSD != 0)
            previousPrice = tokenHourData[1].priceUSD;
          // Get Hour Volume USD
          for (i = 0; i < token5MinData.length; i++) {
            if (token5MinData[i]?.periodStartUnix && token5MinData[i].periodStartUnix * 1000 < new Date().getTime() -  60 * 60 * 1000) {
              break;
            }
            volumeUSD += parseFloat(token5MinData[i].volumeUSD);
          }
        } else {
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
            volumeUSD = 0;
          } else {
            if (duration == "DAY") {
              // Get Hour Volume USD
              for (i = 0; i < tokenHourData.length; i++) {
                if (tokenHourData[i]?.periodStartUnix && tokenHourData[i].periodStartUnix * 1000 < new Date(todayDate).getTime() -  24 * 60 * 60 * 1000) {
                  break;
                }
                volumeUSD += parseFloat(tokenHourData[i].volumeUSD);
              }
            } else {
              // Get Volume
              for (i = 0; i < tokenDayData.length; i++) {
                if (tokenDayData[i]?.date && tokenDayData[i].date * 1000 < new Date(todayDate).getTime() -  daysPer * 24 * 60 * 60 * 1000) {
                  break;
                }
                volumeUSD += parseFloat(tokenDayData[i].volumeUSD);
              }
              console.log("tokenDayData",duration, new Date(todayDate).getTime(), getTokenNameByAddressAndChainId(token.id, CHAIN_NAME_TO_CHAIN_ID[chainName]), i, tokenDayData, volumeUSD);
            }
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

        let tokenName = getTokenNameByAddressAndChainId(token.id, CHAIN_NAME_TO_CHAIN_ID[chainName]);
        let tokenSymbol = token.symbol;
        if (token.name == 'Wrapped LUX') {
          tokenSymbol = CHAIN_NAME_TO_CHAIN_ID[chainName] == 200200 ? 'ZOO' : 'LUX';
          tokenName = CHAIN_NAME_TO_CHAIN_ID[chainName] == 200200 ? 'Zoo Coin' : 'Lux Coin'
        }

        return {
          name: tokenName,//token.name,
          chain: chainName,
          address: token.id,
          symbol: tokenSymbol,//token.symbol,
          market: {
            totalValueLocked: {
              value: parseFloat(token.totalValueLockedUSD),
            },
            price: {
              value: ethPriceUSD && token.derivedETH ? parseFloat(ethPriceUSD) * parseFloat(token.derivedETH) : 0,
            },
            pricePercentChange: {
              value: priceChangePercent,
            },
            volume: {
              value: volumeUSD,
            },
          },
          chainId: CHAIN_NAME_TO_CHAIN_ID[chainName],
          decimals: 18,
          isNative: tokenSymbol !== 'LUX' && tokenSymbol != 'ZOO' ? false : true,
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
          if (!a.market?.totalValueLocked || !b.market?.totalValueLocked) return 0
          return a.market.totalValueLocked.value > b.market.totalValueLocked.value ? -1 : 1
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

  if (chainName != 'LUX' && chainName != 'ZOO') {
    if (loadingTokens && !tokens) return <LoadingTokenTable rowCount={PAGE_SIZE} />;
    if (!tokens) return renderErrorOrEmptyState("An error occurred loading tokens. Please try again.");
    if (tokens.length == 0) return <NoTokensState message={<Trans>No tokens found</Trans>} />;
    return renderTokens(tokens, tokenVolumeRank);
  } else if (chainName == 'LUX') {
    if (luxLoading || !sortedTokens) return <LoadingTokenTable rowCount={PAGE_SIZE} />;
    if (!sortedTokens || sortedTokens.length == 0)
      return renderErrorOrEmptyState("No tokens found or an error occurred loading tokens.");
    return renderTokens(sortedTokens, transformedTokenVolumeRank);
  } else { //chain = ZOO
    if (luxLoading && !sortedTokens) return <LoadingTokenTable rowCount={PAGE_SIZE} />;
    if (!sortedTokens || sortedTokens.length == 0)
      return renderErrorOrEmptyState("No tokens found or an error occurred loading tokens.");
    return renderTokens(sortedTokens, transformedTokenVolumeRank);
  }
}