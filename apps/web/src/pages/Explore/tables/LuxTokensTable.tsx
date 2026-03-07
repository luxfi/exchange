/**
 * Lux Network Tokens Table
 *
 * Renders tokens from the Lux V3 subgraph when the explore page
 * is filtered to the Lux chain.
 */
import { memo } from 'react'
import styled from 'styled-components'
import { useLuxSubgraphTokens, useLuxFactory } from '~/state/explore/luxSubgraph'

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`

const Th = styled.th`
  text-align: left;
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.45);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);

  &:not(:first-child) {
    text-align: right;
  }
`

const Td = styled.td`
  padding: 14px 16px;
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  font-variant-numeric: tabular-nums;

  &:not(:first-child) {
    text-align: right;
  }
`

const Row = styled.tr`
  cursor: pointer;
  &:hover {
    background: rgba(0, 0, 0, 0.02);
  }
`

const TokenInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const TokenIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.5);
`

const TokenName = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const Symbol = styled.span`
  font-weight: 600;
  color: #111;
`

const Name = styled.span`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.4);
`

const StatsBar = styled.div`
  display: flex;
  gap: 24px;
  padding: 16px;
  margin-bottom: 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);
`

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const StatLabel = styled.span`
  font-size: 11px;
  color: rgba(0, 0, 0, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const StatValue = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #111;
`

const EmptyState = styled.div`
  padding: 48px 16px;
  text-align: center;
  color: rgba(0, 0, 0, 0.3);
  font-size: 14px;
`

function fmtUSD(value: string | number): string {
  let n = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(n) || !isFinite(n) || n <= 0) return '$0'
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`
  if (n >= 1) return `$${n.toFixed(2)}`
  if (n >= 0.01) return `$${n.toFixed(4)}`
  return `$${n.toExponential(2)}`
}

export const LuxTokensTable = memo(function LuxTokensTable() {
  const { data: tokens, isLoading } = useLuxSubgraphTokens()
  const { data: factory } = useLuxFactory()

  if (isLoading) {
    return (
      <Wrapper>
        <EmptyState>Loading Lux tokens...</EmptyState>
      </Wrapper>
    )
  }

  return (
    <Wrapper data-testid="top-tokens-explore-table">
      {factory && (
        <StatsBar>
          <StatItem>
            <StatLabel>Protocol TVL</StatLabel>
            <StatValue>{fmtUSD(factory.totalValueLockedUSD)}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>Total Volume</StatLabel>
            <StatValue>{fmtUSD(factory.totalVolumeUSD)}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>Pools</StatLabel>
            <StatValue>{factory.poolCount}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>Transactions</StatLabel>
            <StatValue>{parseInt(factory.txCount).toLocaleString()}</StatValue>
          </StatItem>
        </StatsBar>
      )}

      <Table>
        <thead>
          <tr>
            <Th>#</Th>
            <Th style={{ textAlign: 'left' }}>Token</Th>
            <Th>Volume (USD)</Th>
            <Th>TVL</Th>
            <Th>Transactions</Th>
          </tr>
        </thead>
        <tbody>
          {(tokens ?? []).map((token, i) => (
            <Row key={token.id}>
              <Td style={{ color: 'rgba(0,0,0,0.3)', width: 40 }}>{i + 1}</Td>
              <Td style={{ textAlign: 'left' }}>
                <TokenInfo>
                  <TokenIcon>{token.symbol.slice(0, 2)}</TokenIcon>
                  <TokenName>
                    <Symbol>{token.symbol}</Symbol>
                    <Name>{token.name}</Name>
                  </TokenName>
                </TokenInfo>
              </Td>
              <Td>{fmtUSD(token.volumeUSD)}</Td>
              <Td>{fmtUSD(token.totalValueLockedUSD)}</Td>
              <Td style={{ color: 'rgba(0,0,0,0.45)' }}>{parseInt(token.txCount).toLocaleString()}</Td>
            </Row>
          ))}
        </tbody>
      </Table>

      {(!tokens || tokens.length === 0) && <EmptyState>No Lux tokens found</EmptyState>}
    </Wrapper>
  )
})
