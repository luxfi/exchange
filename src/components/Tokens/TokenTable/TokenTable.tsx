import { Trans } from '@lingui/macro'
import { PAGE_SIZE, useTopTokens } from 'graphql/data/TopTokens'
import { validateUrlChainParam } from 'graphql/data/util'
import { ReactNode } from 'react'
import { AlertTriangle } from 'react-feather'
import { useParams } from 'react-router-dom'
import styled from 'styled-components/macro'

import { MAX_WIDTH_MEDIA_BREAKPOINT } from '../constants'
import { HeaderRow, LoadedRow, LoadingRow } from './TokenRow'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { luxClient } from 'graphql/thegraph/apollo'

const MyQuery = gql`
query MyQuery {
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
  }
}
`

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: ${MAX_WIDTH_MEDIA_BREAKPOINT};
  background-color: ${({ theme }) => theme.backgroundSurface};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  margin-left: auto;
  margin-right: auto;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.backgroundOutline};
`

const TokenDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  height: 100%;
  width: 100%;
`

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
`

function NoTokensState({ message }: { message: ReactNode }) {
  return (
    <GridContainer>
      <HeaderRow />
      <NoTokenDisplay>{message}</NoTokenDisplay>
    </GridContainer>
  )
}

const LoadingRows = ({ rowCount }: { rowCount: number }) => (
  <>
    {Array(rowCount)
      .fill(null)
      .map((_, index) => {
        return <LoadingRow key={index} first={index === 0} last={index === rowCount - 1} />
      })}
  </>
)

function LoadingTokenTable({ rowCount = PAGE_SIZE }: { rowCount?: number }) {
  return (
    <GridContainer>
      <HeaderRow />
      <TokenDataContainer>
        <LoadingRows rowCount={rowCount} />
      </TokenDataContainer>
    </GridContainer>
  )
}

export default function TokenTable() {
  
  const chainName = validateUrlChainParam(useParams<{ chainName?: string }>().chainName)
  const { data: luxData, loading: luxLoading } = useQuery(MyQuery, {
    client: luxClient,
  })
  if (luxLoading) {
    console.log("Loading data...");
  } else {
    console.log("Data loaded:", luxData);
  }
  const transformedTokens = luxData?.tokens.map((token: any) => ({
      __typename: "Token",
      id: `VG9rZW46RVRIRVJFVU1f${typeof token.id === 'string' ? Buffer.from(token.id).toString("base64") : token.id}`, // Only apply Buffer if it's a string
      name: token.name, // You can adjust this based on your data
      chain: "LUX", // Assuming all tokens are from Ethereum
      address: token.id, // Assuming native token for now
      symbol: token.symbol, // Assuming ETH token, adjust if needed
      market: {
        __typename: "TokenMarket",
        id: `VG9rZW5NYXJrZXQ6RVRIRVJFVU1f${typeof token.id === 'string' ? Buffer.from(token.id).toString("base64") : token.id}`,
        totalValueLocked: {
          __typename: "Amount",
          id: `QW1vdW50OjE2MjA0NzYwNjkuOTA4MzkzMV9VU0Q=`, // Adjust ID for Amount
          value: parseFloat(token.totalValueLocked),
          currency: "USD",
        },
        price: {
          __typename: "Amount",
          id: `QW1vdW50OjI5MDguMTM4MTcwMjkzNjg0N19VU0Q=`,
          value: 2908.1381702936847,
          currency: "USD",
        },
        pricePercentChange: {
          __typename: "Amount",
          id: `QW1vdW50OjMuMDMxMTQxNzU0Nzc1OTEyN19VU0Q=`,
          value: 3.0311417547759127,
          currency: "USD",
        },
        volume: {
          __typename: "Amount",
          id: `QW1vdW50OjE0NTI2MTcwMzYuNjg3ODY2Ml9VU0Q=`,
          value: parseFloat(token.volume),
          currency: "USD",
        },
      },
      project: {
        __typename: "TokenProject",
        id: "VG9rZW5Qcm9qZWN0OkVUSEVSRVVNXzB4YzAyYWFhMzliMjIzZmU4ZDBhMGU1YzRmMjdlYWQ5MDgzYzc1NmNjMl9XRVRI",
        logoUrl: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
      },
      chainId: 1,
      decimals: 18,
      isNative: true,
      isToken: false,
    }));
  console.log("Transformed Tokens:", transformedTokens);
  
  const { tokens, tokenVolumeRank, loadingTokens, sparklines } = useTopTokens(chainName)

  if(chainName != "LUX") {
  /* loading and error state */
  if (loadingTokens && !tokens) {
    return <LoadingTokenTable rowCount={PAGE_SIZE} />
  } else if (!tokens) {
    return (
      <NoTokensState
        message={
          <>
            <AlertTriangle size={16} />
            <Trans>An error occurred loading tokens. Please try again.</Trans>
          </>
        }
      />
    )
  } else if (tokens?.length === 0) {
    return <NoTokensState message={<Trans>No tokens found</Trans>} />
  } else {
    return (
      <GridContainer>
        <HeaderRow />
        <TokenDataContainer>
          {tokens.map(
            (token, index) =>
              token?.address && (
                <LoadedRow
                  key={token.address}
                  tokenListIndex={index}
                  tokenListLength={tokens.length}
                  token={token}
                  // sparklineMap={sparklines}
                  volumeRank={tokenVolumeRank[token.address]}
                />
              )
          )}
        </TokenDataContainer>
      </GridContainer>
    )
  }
}
else {
  if (!transformedTokens) {
    return (
      <NoTokensState
        message={
          <>
            <AlertTriangle size={16} />
            <Trans>An error occurred loading tokens. Please try again.</Trans>
          </>
        }
      />
    )
  }
  else {
    return (
      <GridContainer>
        <HeaderRow />
        <TokenDataContainer>
          {transformedTokens?.map(
            (token: any, index: number) =>
              token?.address && (
                <LoadedRow
                  key={token.address}
                  tokenListIndex={index}
                  tokenListLength={transformedTokens.length}
                  token={token}
                  // sparklineMap={sparklines}
                  volumeRank={tokenVolumeRank[token.address]}
                />
              )
          )}
        </TokenDataContainer>
      </GridContainer>
    )
  }
}
}
