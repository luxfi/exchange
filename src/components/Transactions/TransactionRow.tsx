import { Trans } from '@lingui/macro'
import { formatNumber, formatUSDPrice, NumberType } from '@uniswap/conedison/format'
import { useAtomValue } from 'jotai/utils'
import QueryTokenLogo from 'components/Logo/QueryTokenLogo'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import { sendAnalyticsEvent } from '@uniswap/analytics'
import { InterfaceEventName } from '@uniswap/analytics-events'
import { CSSProperties, ForwardedRef, forwardRef, ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import styled, { css } from 'styled-components/macro'
import { CHAIN_NAME_TO_CHAIN_ID, getTokenDetailsURL } from 'graphql/data/util'
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
const StyledTransactionRow = styled.div<{
  first?: boolean
  last?: boolean
  loading?: boolean
}>`
  background-color: transparent;
  display: grid;
  font-size: 16px;

  grid-template-columns: 2fr 6fr 4fr 4fr 4fr 4fr;

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
    grid-template-columns: 2fr 6fr 4fr 4fr 4fr 4fr;
  }

  @media only screen and (max-width: ${LARGE_MEDIA_BREAKPOINT}) {
    grid-template-columns: 2fr 7.5fr 4.5fr 4.5fr 4.5fr;
  }

  @media only screen and (max-width: ${MEDIUM_MEDIA_BREAKPOINT}) {
    grid-template-columns: 2fr 10fr 5fr 5fr;

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
const StyledHeaderRow = styled(StyledTransactionRow)`
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

const TimestampCell = styled(Cell)<{ header: boolean }>`
  color: ${({ theme }) => theme.textSecondary};
  justify-content: flex-start;
  min-width: 70px;
  font-size: 15px;
  padding-left: 10px;
`

const DataCell = styled(Cell)<{ sortable: boolean }>`
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
function TransactionRow({
  header,
  time,
  transType,
  amountUSD,
  transaction0Amount,
  transaction1Amount,
  walletAddress,
  ...rest
}: {
  first?: boolean
  header: boolean
  time: ReactNode
  loading?: boolean
  transaction1Amount: ReactNode
  amountUSD: ReactNode
  transaction0Amount: ReactNode
  transType: ReactNode
  walletAddress: ReactNode
  last?: boolean
  style?: CSSProperties
}) {
  const rowCells = (
    <>
      <TimestampCell header={header}>{time}</TimestampCell>
      <TransType data-testid="name-cell">{transType}</TransType>
      <AmountUSD data-testid="price-cell" sortable={header}>
        {amountUSD}
      </AmountUSD>
      <Token0Amount data-testid="percent-change-cell" sortable={header}>
        {transaction0Amount}
      </Token0Amount>
      <Token1Amount data-testid="tvl-cell" sortable={header}>
        {transaction1Amount}
      </Token1Amount>
      <WalletAddress data-testid="volume-cell" sortable={header}>
        {walletAddress}
      </WalletAddress>
    </>
  )
  if (header) return <StyledHeaderRow data-testid="header-row">{rowCells}</StyledHeaderRow>
  return <StyledTransactionRow {...rest}>{rowCells}</StyledTransactionRow>
}

/* Header Row: top header row component for table */
export function HeaderRow() {
  return (
    <TransactionRow
      header={true}
      time={
        <div style={{ color: "white" }}>
          ↓&nbsp;Time
        </div>
      }
      transType="&nbsp;⇅ Type"
      amountUSD="USD&nbsp;"
      transaction0Amount="Token amount&nbsp;"
      transaction1Amount="Token amount&nbsp;"
      walletAddress="Wallet&nbsp;"
    />
  )
}

/* Loading State: row component with loading bubbles */
export function LoadingRow(props: { first?: boolean; last?: boolean }) {
  return (
    <TransactionRow
      header={false}
      time={<SmallLoadingBubble />}
      loading
      transType={
        <>
          <IconLoadingBubble />
          <MediumLoadingBubble />
        </>
      }
      amountUSD={<MediumLoadingBubble />}
      transaction0Amount={<LoadingBubble />}
      transaction1Amount={<LoadingBubble />}
      walletAddress={<LoadingBubble />}
      {...props}
    />
  )
}

interface LoadedRowProps {
  transactionListIndex: number
  transactionListLength: number
  transaction: NonNullable<any>
}

const getTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp * 1000) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} s ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 5) {
    return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30); // Approximation for months
  if (diffInMonths < 12 && diffInMonths > 0) {
    return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
  }

  if (diffInMonths === 0) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
};

export const shortenAddress = (address: string, chars = 4): string => {
  if (!address) return "";
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
};

/* Loaded State: row component with transaction information */
export const LoadedRow = forwardRef((props: LoadedRowProps, ref: ForwardedRef<HTMLDivElement>) => {
  const { transactionListIndex, transactionListLength, transaction } = props
  const filterString = useAtomValue(filterStringAtom)

  const lowercaseChainName = useParams<{ chainName?: string }>().chainName?.toUpperCase() ?? 'ethereum'
  const filterNetwork = lowercaseChainName.toUpperCase()
  const chainId = CHAIN_NAME_TO_CHAIN_ID[filterNetwork]

  // TODO: currency logo sizing mobile (32px) vs. desktop (24px)
  return (
    <div ref={ref}>
      <TransactionRow
        header={false}
        time={getTimeAgo(transaction.timestamp)}
        transType={
          <TokenInfoCell>
            <TransTypeColor>
              { transaction.transactionType }&nbsp;
            </TransTypeColor>
            <StyledLink
              to={getTokenDetailsURL(transaction.token0Address ?? '', filterNetwork)}
            >
              <AssetLogo
                isNative={(chainId == 200200 && transaction.token0Symbol == 'WLUX') ? true : false} //must edit
                chainId={ chainId}
                address={ transaction.token0Address}
                symbol={ transaction.token0Symbol }
                backupImg={ null }
                hideL2Icon={ false }
              />
              { transaction.token0Symbol }
            </StyledLink>
            { " for " }
            <StyledLink
              to={getTokenDetailsURL(transaction.token1Address ?? '', filterNetwork)}
            >
            <AssetLogo
              isNative={(chainId == 200200 && transaction.token1Symbol == 'WLUX') ? true : false} //must edit
              chainId={chainId}
              address={transaction.token1Address}
              symbol={transaction.token1Symbol }
              backupImg={null}
              hideL2Icon={true}
            />
              { transaction.token1Symbol }
            </StyledLink>
          </TokenInfoCell>
        }
        amountUSD={
          <PriceInfoCell>
            {formatUSDPrice(transaction.amountUSD)}
          </PriceInfoCell>
        }
        transaction0Amount={
          <PriceInfoCell>
            { (formatNumber(transaction.amount0, NumberType.FiatTokenStats).charAt(0) == '<' ? "<" : "") + formatNumber(transaction.amount0, NumberType.FiatTokenStats).substring(formatNumber(transaction.amount0, NumberType.FiatTokenStats).charAt(0) == '<' ? 2 : 1, formatNumber(transaction.amount0, NumberType.FiatTokenStats).length) } &nbsp;
            <StyledLink
              to={getTokenDetailsURL(transaction.token0Address ?? '', filterNetwork)}
            >
              <AssetLogo
                isNative={(chainId == 200200 && transaction.token0Symbol == 'WLUX') ? true : false} //must edit
                chainId={chainId}
                address={transaction.token0Address}
                symbol={transaction.token0Symbol }
                backupImg={null}
                hideL2Icon={true}
              />
              { transaction.token0Symbol }
            </StyledLink>
          </PriceInfoCell>
        }
        transaction1Amount={
          <PriceInfoCell>
          { (formatNumber(transaction.amount1, NumberType.FiatTokenStats).charAt(0) == '<' ? "<" : "") + formatNumber(transaction.amount1, NumberType.FiatTokenStats).substring(formatNumber(transaction.amount1, NumberType.FiatTokenStats).charAt(0) == '<' ? 2 : 1, formatNumber(transaction.amount1, NumberType.FiatTokenStats).length) } &nbsp;
          <StyledLink
              to={getTokenDetailsURL(transaction.token1Address ?? '', filterNetwork)}
            >
            <AssetLogo
              isNative={(chainId == 200200 && transaction.token1Symbol == 'WLUX') ? true : false} //must edit
              chainId={chainId}
              address={transaction.token1Address}
              symbol={transaction.token1Symbol }
              backupImg={null}
              hideL2Icon={true}
            />
            { transaction.token1Symbol }
          </StyledLink>
          </PriceInfoCell>
        }
        walletAddress={
          <PriceInfoCell>
            {shortenAddress(transaction.originAddress)}
          </PriceInfoCell>
        }
        first={transactionListIndex === 0}
        last={transactionListIndex === transactionListLength - 1}
      />
    </div>
  )
})

LoadedRow.displayName = 'LoadedRow'
