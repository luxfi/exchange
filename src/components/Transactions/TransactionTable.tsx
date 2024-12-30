import { Trans } from '@lingui/macro';
import { PAGE_SIZE } from 'graphql/data/TopTokens';
import { validateUrlChainParam } from 'graphql/data/util';
import { AlertTriangle } from 'react-feather';
import { useParams } from 'react-router-dom';
import styled from 'styled-components/macro';

import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { ReactNode, useCallback, useEffect, useState, useRef } from 'react';
import { MAX_WIDTH_MEDIA_BREAKPOINT } from '../Tokens/constants';
import { HeaderRow, LoadedRow, LoadingRow } from './TransactionRow';

import { apolloClient } from 'graphql/data/apollo';
import { arbitrumNetClient, avalancheNetClient, baseNetClient, bnbNetClient, celoNetClient, ethereumNetClient, luxNetClient, optimismNetClient, polygonNetClient, zooNetClient } from 'graphql/thegraph/apollo';


const getTransactionsInfoQuery = gql`
query MyQuery {
  bundles {
    ethPriceUSD
  }
  transactions(first: 30, orderBy: timestamp, orderDirection: desc) {
    id
    swaps {
      amount0
      amount1
      token0 {
        id
        symbol
    		derivedETH
      }
      token1 {
        id
        symbol
      }
      sender
    }
    timestamp
    mints {
      amount0
      amount1
      token0 {
        id
        symbol
    		derivedETH
      }
      token1 {
        id
        symbol
    		derivedETH
      }
      owner
    }
    burns {
      amount0
      amount1
      token0 {
        id
        symbol
    		derivedETH
      }
      token1 {
        id
        symbol
    		derivedETH
      }
      owner
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

function LoadingTransactionsTable({ rowCount = PAGE_SIZE }: { rowCount?: number }) {
  return (
    <GridContainer>
      <HeaderRow />
      <TokenDataContainer>
        <LoadingRows rowCount={rowCount} />
      </TokenDataContainer>
    </GridContainer>
  );
}

export default function TransactionsTable() {
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
  
  const { data: luxData, loading: luxLoading, refetch } = useQuery(getTransactionsInfoQuery, {
    client: luxClient,
    pollInterval: 10000,
  });
  
  const ethPriceUSD = luxData?.bundles[0]?.ethPriceUSD;
  const [transformedTransactions, setTransformedTransactions] = useState<any[] | undefined>(undefined);

  const calculateTransformedTransactions = useCallback(() => {
    refetch();

    if (!luxData?.transactions) return [];

    return luxData?.transactions?.map((transaction: any) => {
      let transType = "Swap";
      let amountUSDValue = 0;
      let amount0Value = 0;
      let amount1Value = 0;
      let walletAddressValue = "0x000000";
      let token0SymbolValue = "format";
      let token1SymbolValue = "format";
      let token0AddressValue = "0x000000";
      let token1AddressValue = "0x000000";
      if (transaction.swaps[0] != null) {
        transType = "Swap";
        amount0Value = transaction?.swaps[0]?.amount0;
        amount1Value = transaction?.swaps[0]?.amount1;
        token0SymbolValue = transaction?.swaps[0]?.token0?.symbol;
        token1SymbolValue = transaction?.swaps[0]?.token1?.symbol;
        token0AddressValue = transaction?.swaps[0]?.token0?.id;
        token1AddressValue = transaction?.swaps[0]?.token1?.id;
        amountUSDValue = parseFloat(transaction?.swaps[0]?.amount0) * parseFloat(transaction?.swaps[0]?.token0?.derivedETH) * ethPriceUSD;
        walletAddressValue = transaction?.id;
      }
      else if (transaction.burns[0] != null) {
        transType = "Remove";
        amount0Value = transaction?.burns[0]?.amount0;
        amount1Value = transaction?.burns[0]?.amount1;
        token0SymbolValue = transaction?.burns[0]?.token0?.symbol;
        token1SymbolValue = transaction?.burns[0]?.token1?.symbol;
        token0AddressValue = transaction?.burns[0]?.token0?.id;
        token1AddressValue = transaction?.burns[0]?.token1?.id;
        amountUSDValue = (parseFloat(transaction?.burns[0]?.amount0) * parseFloat(transaction?.burns[0]?.token0?.derivedETH) + parseFloat(transaction?.burns[0]?.amount1) * parseFloat(transaction?.burns[0]?.token1?.derivedETH)) * ethPriceUSD;
        walletAddressValue = transaction?.id;
      }
      else if (transaction.mints[0] != null) {
        transType = "Add";
        amount0Value = transaction?.mints[0]?.amount0;
        amount1Value = transaction?.mints[0]?.amount1;
        token0SymbolValue = transaction?.mints[0]?.token0?.symbol;
        token1SymbolValue = transaction?.mints[0]?.token1?.symbol;
        token0AddressValue = transaction?.mints[0]?.token0?.id;
        token1AddressValue = transaction?.mints[0]?.token1?.id;
        amountUSDValue = (parseFloat(transaction?.mints[0]?.amount0) * parseFloat(transaction?.mints[0]?.token0?.derivedETH) + parseFloat(transaction?.mints[0]?.amount1) * parseFloat(transaction?.mints[0]?.token1?.derivedETH)) * ethPriceUSD;
        walletAddressValue = transaction?.id;
      }

      return {
        timestamp: transaction.timestamp,
        transactionType: transType,
        amountUSD: amountUSDValue,
        amount0: amount0Value,
        amount1: amount1Value,
        token0Address: token0AddressValue,
        token1Address: token1AddressValue,
        token0Symbol: token0SymbolValue,
        token1Symbol: token1SymbolValue,
        originAddress: walletAddressValue
      }
    });
  }, [luxData, ethPriceUSD, refetch]);

  useEffect(() => {
    setTransformedTransactions(calculateTransformedTransactions());
  }, [calculateTransformedTransactions]);

   // Use a ref for interval management
   const intervalRef = useRef<NodeJS.Timer | null>(null);

   // Set up the interval to recalculate transformed tokens every 12 seconds
   useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTransformedTransactions([]);
      const transformed = calculateTransformedTransactions();
      setTransformedTransactions(transformed);
    }, 12000);
  
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [calculateTransformedTransactions]);

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

  const renderTransactions = (transactions: any[]) => (
    <GridContainer>
      <HeaderRow />
      <TokenDataContainer>
        {transactions.map((transaction, index) =>
          transaction?.timestamp ? (
            <LoadedRow
              transactionListIndex={index}
              transactionListLength={transaction.length}
              transaction={transaction}
            />
          ) : null
        )}
      </TokenDataContainer>
    </GridContainer>
  );

  if (luxLoading || !transformedTransactions) return <LoadingTransactionsTable rowCount={PAGE_SIZE} />;
  if (!transformedTransactions || transformedTransactions.length == 0)
    return renderErrorOrEmptyState("No tokens found or an error occurred loading tokens.");
  return renderTransactions(transformedTransactions);
}