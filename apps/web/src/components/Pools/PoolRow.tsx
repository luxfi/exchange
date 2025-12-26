import { Trans } from '@lingui/macro'
import { formatNumber, formatUSDPrice, NumberType } from '@uniswap/conedison/format'
import { CHAIN_NAME_TO_CHAIN_ID, getTokenDetailsURL } from 'graphql/data/util'
import { useAtomValue } from 'jotai/utils'
import QueryTokenLogo from 'components/Logo/QueryTokenLogo'
import { CSSProperties, ForwardedRef, forwardRef, ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import styled, { css } from 'styled-components/macro'
import { ClickableStyle } from 'theme'
import AssetLogo from '../Logo/AssetLogo'

import {
  LARGE_MEDIA_BREAKPOINT,
  MAX_WIDTH_MEDIA_BREAKPOINT,
  MEDIUM_MEDIA_BREAKPOINT,
  SMALL_MEDIA_BREAKPOINT,
} from '../Tokens/constants'
import { LoadingBubble } from '../Tokens/loading'
import {
  filterStringAtom,
  TokenSortMethod
} from '../Tokens/state'

const Cell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
const StyledPoolRow = styled.div<{
  first?: boolean
  last?: boolean
  loading?: boolean
}>`
  background-color: transparent;
  display: grid;
  font-size: 16px;
  grid-template-columns: 1fr 6fr 4fr 4fr 4fr 4fr;
  line-height: 24px;
  max-width: ${MAX_WIDTH_MEDIA_BREAKPOINT};
  min-width: 390px;
  ${({ first, last }) => css`
    height: ${first || last ? '72px' : '64px'};
    padding-top: ${first ? '8px' : '0px'};
    padding-bottom: ${last ? '8px' : '0px'};
  `}
  padding-left: 12px;
  padding-right: 12px;
  transition: ${({
  theme: {
    transition: { duration, timing },
  },
}) => css`background-color ${duration.medium} ${timing.ease}`};
  width: 100%;
  transition-duration: ${({ theme }) => theme.transition.duration.fast};

  &:hover {
    ${({ loading, theme }) =>
    !loading &&
    css`
        background-color: ${theme.hoverDefault};
      `}
    ${({ last }) =>
    last &&
    css`
        border-radius: 0px 0px 8px 8px;
      `}
  }

  @media only screen and (max-width: ${MAX_WIDTH_MEDIA_BREAKPOINT}) {
    grid-template-columns: 1fr 10fr 4fr 4fr 4fr 4fr;
  }

  @media only screen and (max-width: ${LARGE_MEDIA_BREAKPOINT}) {
    grid-template-columns: 1fr 10fr 4.5fr 4.5fr 4.5fr;
  }

  @media only screen and (max-width: ${MEDIUM_MEDIA_BREAKPOINT}) {
    grid-template-columns: 1fr 10fr 5fr 5fr;
  }

  @media only screen and (max-width: ${SMALL_MEDIA_BREAKPOINT}) {
    grid-template-columns: 1fr 3fr;
    min-width: unset;
    border-bottom: 0.5px solid ${({ theme }) => theme.backgroundModule};

    :last-of-type {
      border-bottom: none;
    }
  }
`

const ClickableContent = styled.div`
  display: flex;
  text-decoration: none;
  color: ${({ theme }) => theme.textPrimary};
  align-items: center;
  cursor: pointer;
`
const ClickableName = styled(ClickableContent)`
  gap: 8px;
  max-width: 100%;
`
const StyledHeaderRow = styled(StyledPoolRow)`
  border-bottom: 1px solid;
  border-color: ${({ theme }) => theme.backgroundOutline};
  border-radius: 8px 8px 0px 0px;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 14px;
  height: 48px;
  line-height: 16px;
  padding: 0px 12px;
  width: 100%;
  justify-content: center;

  &:hover {
    background-color: transparent;
  }

  @media only screen and (max-width: ${SMALL_MEDIA_BREAKPOINT}) {
    justify-content: space-between;
  }
`

const ListNumberCell = styled(Cell) <{ header: boolean }>`
  color: ${({ theme }) => theme.textSecondary};
  min-width: 32px;
  font-size: 14px;

  @media only screen and (max-width: ${SMALL_MEDIA_BREAKPOINT}) {
    display: none;
  }
`

const DataCell = styled(Cell) <{ sortable: boolean }>`
  justify-content: flex-end;
  min-width: 80px;
  user-select: ${({ sortable }) => (sortable ? 'none' : 'unset')};
  transition: ${({
  theme: {
    transition: { duration, timing },
  },
}) => css`background-color ${duration.medium} ${timing.ease}`};
`
const Token1Amount = styled(DataCell)`
  padding-right: 8px;
  @media only screen and (max-width: ${MEDIUM_MEDIA_BREAKPOINT}) {
    display: none;
  }
`
const TransType = styled(Cell)`
  justify-content: flex-start;
  padding: 0px 8px;
  min-width: 200px;
  gap: 8px;
`
const AmountUSD = styled(DataCell)`
  padding-right: 8px;
  @media only screen and (max-width: ${SMALL_MEDIA_BREAKPOINT}) {
    display: none;
  }
`
const Token0Amount = styled(DataCell)`
  padding-right: 8px;
  @media only screen and (max-width: ${SMALL_MEDIA_BREAKPOINT}) {
    display: none;
  }
`
const PercentChangeInfoCell = styled(Cell)`
  display: none;

  @media only screen and (max-width: ${SMALL_MEDIA_BREAKPOINT}) {
    display: flex;
    justify-content: flex-end;
    color: ${({ theme }) => theme.textSecondary};
    font-size: 12px;
    line-height: 16px;
  }
`
const TransTypeColor = styled.div`
  color: ${({ theme }) => theme.textSecondary};
  font-weight: 500;
`
const PriceInfoCell = styled(Cell)`
  justify-content: flex-end;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: inherit;
  white-space: nowrap;

  @media only screen and (max-width: ${SMALL_MEDIA_BREAKPOINT}) {
    flex-direction: column;
    align-items: flex-end;
  }
`

const HeaderCellWrapper = styled.span<{ onClick?: () => void }>`
  align-items: center;
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'unset')};
  display: flex;
  gap: 4px;
  justify-content: flex-end;
  width: 100%;

  &:hover {
    ${ClickableStyle}
  }
`
const StyledLink = styled(Link)`
  color: white;
  display: flex;
  gap: 8px;
  text-decoration: none;
  &:hover {
    opacity: 0.7; /* Make all children transparent */
  }
`
const TokenInfoCell = styled(Cell)`
  gap: 8px;
  line-height: 24px;
  font-size: 16px;
  max-width: inherit;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media only screen and (max-width: ${SMALL_MEDIA_BREAKPOINT}) {
    justify-content: flex-start;
    gap: 8px;
    width: max-content;
    font-weight: 500;
  }
`
const TokenName = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
`
const TokenSymbol = styled(Cell)`
  color: ${({ theme }) => theme.textTertiary};
  text-transform: uppercase;

  @media only screen and (max-width: ${SMALL_MEDIA_BREAKPOINT}) {
    font-size: 12px;
    height: 16px;
    justify-content: flex-start;
    width: 100%;
  }
`
const WalletAddress = styled(DataCell)`
  @media only screen and (max-width: ${LARGE_MEDIA_BREAKPOINT}) {
    display: none;
  }
  padding-right: 10px;
`
const SmallLoadingBubble = styled(LoadingBubble)`
  width: 25%;
`
const MediumLoadingBubble = styled(LoadingBubble)`
  width: 65%;
`
const LongLoadingBubble = styled(LoadingBubble)`
  width: 90%;
`
const IconLoadingBubble = styled(LoadingBubble)`
  border-radius: 50%;
  width: 24px;
`

const InfoIconContainer = styled.div`
  margin-left: 2px;
  display: flex;
  align-items: center;
  cursor: help;
`
export const DeltaText = styled.span<{ delta: number | undefined }>`
  color: ${({ theme, delta }) =>
    delta !== undefined ? (Math.sign(delta) < 0 ? theme.accentFailure : theme.accentSuccess) : theme.textPrimary};
`

export function formatDelta(delta: number | null | undefined): string {
  // Null-check not including zero
  if (delta === null || delta === undefined || delta === Infinity || isNaN(delta)) {
    return '-';
  }

  // If delta is greater than 0 but smaller than 0.000001, set it to 0.000001
  if (Math.abs(delta) > 0 && Math.abs(delta) < 0.001) {
    return 0.001 + '%';
  }

  const formattedDelta = Math.abs(delta).toFixed(3) + '%';
  return formattedDelta;
}


export const HEADER_DESCRIPTIONS: Record<TokenSortMethod, ReactNode | undefined> = {
  [TokenSortMethod.PRICE]: undefined,
  [TokenSortMethod.PERCENT_CHANGE]: undefined,
  [TokenSortMethod.TOTAL_VALUE_LOCKED]: (
    <Trans>Total value locked (TVL) is the amount of the asset that’s currently in a liquidity pool.</Trans>
  ),
  [TokenSortMethod.VOLUME]: (
    <Trans>Volume is the amount of the asset that has been traded during the selected time frame.</Trans>
  ),
}

/* Token Row: skeleton row component */
function PoolRow({
  header,
  listNumber,
  poolInfo,
  totalValueLockedUSD,
  hourVolume,
  dayVolume,
  APR,
  ...rest
}: {
  first?: boolean
  header: boolean
  listNumber: ReactNode
  loading?: boolean
  dayVolume: ReactNode
  totalValueLockedUSD: ReactNode
  hourVolume: ReactNode
  poolInfo: ReactNode
  APR: ReactNode
  last?: boolean
  style?: CSSProperties
}) {
  const rowCells = (
    <>
      <ListNumberCell header={header}>{listNumber}</ListNumberCell>
      <TransType data-testid="name-cell">{poolInfo}</TransType>
      <AmountUSD data-testid="price-cell" sortable={header}>
        {totalValueLockedUSD}
      </AmountUSD>
      <Token0Amount data-testid="percent-change-cell" sortable={header}>
        {hourVolume}
      </Token0Amount>
      <Token1Amount data-testid="tvl-cell" sortable={header}>
        {dayVolume}
      </Token1Amount>
      <WalletAddress data-testid="volume-cell" sortable={header}>
        {APR}
      </WalletAddress>
    </>
  )
  if (header) return <StyledHeaderRow data-testid="header-row">{rowCells}</StyledHeaderRow>
  return <StyledPoolRow {...rest}>{rowCells}</StyledPoolRow>
}

/* Header Row: top header row component for table */
export function HeaderRow() {
  return (
    <PoolRow
      header={true}
      listNumber="#"
      poolInfo="&nbsp;&nbsp;&nbsp;  Pools Info"
      totalValueLockedUSD=" ↑ TVL&nbsp;"
      hourVolume="Hour Volume&nbsp;"
      dayVolume="Day Volume&nbsp;"
      APR="APR&nbsp;"
    />
  )
}

/* Loading State: row component with loading bubbles */
export function LoadingRow(props: { first?: boolean; last?: boolean }) {
  return (
    <PoolRow
      header={false}
      listNumber={<SmallLoadingBubble />}
      loading
      poolInfo={
        <>
          <IconLoadingBubble />
          <MediumLoadingBubble />
        </>
      }
      totalValueLockedUSD={<MediumLoadingBubble />}
      hourVolume={<LoadingBubble />}
      dayVolume={<LoadingBubble />}
      APR={<LoadingBubble />}
      {...props}
    />
  )
}

interface LoadedRowProps {
  poolListIndex: number
  poolListLength: number
  pool: NonNullable<any>
}

export const shortenAddress = (address: string, chars = 4): string => {
  if (!address) return "";
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
};

/* Loaded State: row component with pool information */
export const LoadedRow = forwardRef((props: LoadedRowProps, ref: ForwardedRef<HTMLDivElement>) => {
  const { poolListIndex, poolListLength, pool } = props
  console.log("poolInfo", pool);
  const filterString = useAtomValue(filterStringAtom)

  const lowercaseChainName = useParams<{ chainName?: string }>().chainName?.toUpperCase() ?? 'ethereum'
  const filterNetwork = lowercaseChainName.toUpperCase()
  const chainId = CHAIN_NAME_TO_CHAIN_ID[filterNetwork]
  const delta = pool.feesUSD / pool.totalValueLockedUSD * 100
  const formattedDelta = formatDelta(delta)

  const now = Date.now();
  const dayVolume = Math.floor((now - pool.lastDate * 1000) / 1000 / 3600 / 24) > 1 ? 0 : pool.dayVolume;
  const hourVolume = Math.floor((now - pool.lastHour * 1000) / 1000 / 3600) > 1 ? 0 : pool.hourVolume;
  // TODO: currency logo sizing mobile (32px) vs. desktop (24px)
  return (
    <div ref={ref}>
      <PoolRow
        header={false}
        listNumber={poolListIndex}
        poolInfo={
          <TokenInfoCell>
            <TransTypeColor>
              {pool.poolType}&nbsp;
            </TransTypeColor>
            <StyledLink
              to={getTokenDetailsURL(pool.token0Address ?? '', filterNetwork)}
            >
              <AssetLogo
                isNative={(chainId == 200200 && pool.token0Symbol == 'WLUX') ? true : false} //must edit
                chainId={chainId}
                address={pool.token0Address}
                symbol={pool.token0Symbol}
                backupImg={null}
                hideL2Icon={false}
              />
              {pool.token0Symbol == 'WLUX' ? 'LUX' : pool.token0Symbol }
            </StyledLink>
            {" / "}
            <StyledLink
              to={getTokenDetailsURL(pool.token1Address ?? '', filterNetwork)}
            >
              <AssetLogo
                isNative={(chainId == 200200 && pool.token1Symbol == 'WLUX') ? true : false} //must edit
                chainId={chainId}
                address={pool.token1Address}
                symbol={pool.token1Symbol}
                backupImg={null}
                hideL2Icon={true}
              />
              {pool.token1Symbol == 'WLUX' ? 'LUX' : pool.token1Symbol }
            </StyledLink>
            {pool.feeTier / 10000 + "%"}
          </TokenInfoCell>
        }
        totalValueLockedUSD={
          <PriceInfoCell>
            {formatUSDPrice(pool.totalValueLockedUSD)}
          </PriceInfoCell>
        }
        hourVolume={
          <PriceInfoCell>
            {formatUSDPrice(hourVolume)}
          </PriceInfoCell>
        }
        dayVolume={
          <PriceInfoCell>
            {formatUSDPrice(dayVolume)}
          </PriceInfoCell>
        }
        APR={
          formattedDelta
        }
        first={poolListIndex === 0}
        last={poolListIndex === poolListLength - 1}
      />
    </div>
  )
})

LoadedRow.displayName = 'LoadedRow'
