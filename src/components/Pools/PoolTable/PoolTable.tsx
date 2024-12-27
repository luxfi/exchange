import { validateUrlChainParam } from 'graphql/data/util';
import { ReactNode } from 'react';
import { useParams } from 'react-router-dom';

import { MAX_WIDTH_MEDIA_BREAKPOINT } from '../constants';
import { HeaderRow, LoadedRow, LoadingRow } from './PoolRow';
import {
  CHAIN_NAME_TO_CHAIN_ID,
  toHistoryDuration,
  usePollQueryWhileMounted,
} from '../../../graphql/data/util'

import { Trans } from '@lingui/macro'
import { AutoColumn } from 'components/Column'
import { RowBetween, RowFixed } from 'components/Row'
import { SwitchLocaleLink } from 'components/SwitchLocaleLink'
import { isSupportedChain } from 'constants/chains'
import { useAllV3Positions1 } from 'hooks/useV3Positions'
import { AlertTriangle, BookOpen, ChevronDown, Inbox, Layers, PlusCircle } from 'react-feather'
import styled, { css, useTheme } from 'styled-components/macro'
import { HideSmall, ThemedText } from 'theme'
import { PositionDetails } from 'types/position'

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

const PoolDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  height: 100%;
  width: 100%;
`;

const NoPoolDisplay = styled.div`
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

const PageWrapper = styled(AutoColumn)`
  padding: 68px 8px 0px;
  max-width: 870px;
  width: 100%;

  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToMedium`
    max-width: 800px;
  `};

  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToSmall`
    max-width: 500px;
  `};

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    padding-top: 48px;
  }

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    padding-top: 20px;
  }
`
const TitleRow = styled(RowBetween)`
  color: ${({ theme }) => theme.textSecondary};
  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
  `};
`

const ErrorContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  max-width: 300px;
  min-height: 25vh;
`

const IconStyle = css`
  width: 48px;
  height: 48px;
  margin-bottom: 0.5rem;
`

const NetworkIcon = styled(AlertTriangle)`
  ${IconStyle}
`

const MainContentWrapper = styled.main`
  background-color: ${({ theme }) => theme.backgroundSurface};
  border: 1px solid ${({ theme }) => theme.backgroundOutline};
  padding: 0;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
`


function NoPoolsState({ message }: { message: ReactNode }) {
  return (
    <GridContainer>
      <HeaderRow />
      <NoPoolDisplay>{message}</NoPoolDisplay>
    </GridContainer>
  );
}

const LoadingRows1 = ({ rowCount }: { rowCount: number }) => (
  <>
    {Array.from({ length: rowCount }, (_, index) => (
      <LoadingRow key={index} first={index == 0} last={index == rowCount - 1} />
    ))}
  </>
);

function LoadingPoolTable({ rowCount = 20 }: { rowCount?: number }) {
  return (
    <GridContainer>
      <HeaderRow />
      <PoolDataContainer>
        <LoadingRows1 rowCount={rowCount} />
      </PoolDataContainer>
    </GridContainer>
  );
}

// Function to get the timestamp rounded to the most recent hour
const getCurrentHourTimestamp = (): string => {
  const now = new Date();
  now.setMinutes(0, 0, 0); // Reset minutes, seconds, and milliseconds to 0
  return now.toISOString(); // Return the ISO string (timestamp)
};

// You can pass these date values as parameters to your transformed tokens calculation.
const currentHourTime = getCurrentHourTimestamp();

export function PoolTable() {
  const chainName = validateUrlChainParam(useParams<{ chainName?: string }>().chainName);
  const chainId = CHAIN_NAME_TO_CHAIN_ID[chainName];
  

  const { positions, loading: positionsLoading } = useAllV3Positions1(chainId)


  console.log("checkpoint", positions);
  if (!isSupportedChain(chainId)) {
    return <WrongNetworkCard />
  }

  const [openPositions, closedPositions] = positions?.reduce<[PositionDetails[], PositionDetails[]]>(
    (acc, p) => {
      acc[p.liquidity?.isZero() ? 1 : 0].push(p)
      return acc
    },
    [[], []]
  ) ?? [[], []]

  const filteredPositions = [...openPositions]
  const renderErrorOrEmptyState = (message: ReactNode) => (
    <NoPoolsState
      message={
        <>
          <AlertTriangle size={16} />S
          <Trans>{message}</Trans>
        </>
      }
    />
  );

  const renderPools =  (positions: any[]) => (
    <GridContainer>
      <HeaderRow />
      <PoolDataContainer>
      {positions.map((p, index) => {
        // return <PositionListTableItem key={p.tokenId.toString()} positionDetails={p} />
        console.log("index = ",index, p);
        return <LoadedRow positionDetails={p} index={index + 1} />
      })}
      </PoolDataContainer>
    </GridContainer>
  );

    // if (luxLoading && !sortedPools) return <LoadingPoolTable rowCount={20} />;
    // console.log("length = ",filteredPositions.length, filteredPositions);
  // if (!filteredPositions || filteredPositions.length == 0)
  //   return renderErrorOrEmptyState("No tokens found or an error occurred loading tokens.");
  return renderPools(filteredPositions);
  // }
}

function WrongNetworkCard() {
  const theme = useTheme()

  return (
    <>
      <PageWrapper>
        <AutoColumn gap="lg" justify="center">
          <AutoColumn gap="lg" style={{ width: '100%' }}>
            <TitleRow padding="0">
              <ThemedText.LargeHeader>
                <Trans>Pools</Trans>
              </ThemedText.LargeHeader>
            </TitleRow>

            <MainContentWrapper>
              <ErrorContainer>
                <ThemedText.DeprecatedBody color={theme.textTertiary} textAlign="center">
                  <NetworkIcon strokeWidth={1.2} />
                  <div data-testid="pools-unsupported-err">
                    <Trans>Your connected network is unsupported.</Trans>
                  </div>
                </ThemedText.DeprecatedBody>
              </ErrorContainer>
            </MainContentWrapper>
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
      <SwitchLocaleLink />
    </>
  )
}