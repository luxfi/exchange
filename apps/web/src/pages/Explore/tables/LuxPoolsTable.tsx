/**
 * Lux Network Pools Table
 *
 * Renders pools from the Lux V3 subgraph when the explore page
 * is filtered to the Lux chain. Includes full trading history per pool.
 */
import { memo, useState } from 'react'
import styled from 'styled-components'
import { useLuxSubgraphPools, useLuxPoolSwapHistory, useLuxFactory } from '~/state/explore/luxSubgraph'

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

const Row = styled.tr<{ $selected?: boolean }>`
  cursor: pointer;
  background: ${(p) => (p.$selected ? 'rgba(0, 0, 0, 0.03)' : 'transparent')};
  &:hover {
    background: rgba(0, 0, 0, 0.02);
  }
`

const PairName = styled.span`
  font-weight: 600;
  color: #111;
`

const FeeBadge = styled.span`
  padding: 2px 6px;
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  margin-left: 8px;
`

const EmptyState = styled.div`
  padding: 48px 16px;
  text-align: center;
  color: rgba(0, 0, 0, 0.3);
  font-size: 14px;
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

// ─── Trading History Panel ──────────────────────────────────────

const HistoryPanel = styled.div`
  margin-top: 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  overflow: hidden;
`

const HistoryHeader = styled.div`
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.02);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  font-size: 13px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  color: rgba(0, 0, 0, 0.3);
  cursor: pointer;
  font-size: 18px;
  padding: 0 4px;
  &:hover {
    color: rgba(0, 0, 0, 0.6);
  }
`

const HistoryTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`

const HistoryTh = styled.th`
  text-align: left;
  padding: 8px 16px;
  font-size: 10px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.35);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);

  &:not(:first-child) {
    text-align: right;
  }
`

const HistoryTd = styled.td`
  padding: 6px 16px;
  font-size: 12px;
  color: #333;
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
  font-variant-numeric: tabular-nums;
  font-family: 'SF Mono', 'Fira Code', monospace;

  &:not(:first-child) {
    text-align: right;
  }
`

const HistoryScroll = styled.div`
  max-height: 400px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 2px;
  }
`

function fmtUSD(value: string | number): string {
  let n = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(n) || !isFinite(n)) return '$0'
  // Safety cap: values above $10B are subgraph artifacts
  if (n > 1e10) n = 0
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`
  return `$${n.toFixed(2)}`
}

function fmtAmount(value: string): string {
  const n = parseFloat(value)
  const abs = Math.abs(n)
  if (abs === 0) return '0'
  if (abs < 0.0001) return n.toExponential(2)
  if (abs < 1) return n.toFixed(6)
  if (abs < 10000) return n.toFixed(4)
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 })
}

function fmtFeeTier(fee: string): string {
  return `${parseInt(fee) / 10000}%`
}

function pairName(pool: { token0: { symbol: string }; token1: { symbol: string } }): string {
  return `${pool.token0.symbol.replace(/^W/, '')}/${pool.token1.symbol.replace(/^W/, '')}`
}

function timeAgo(ts: string): string {
  const sec = Math.floor(Date.now() / 1000 - parseInt(ts))
  if (sec < 60) return `${sec}s`
  if (sec < 3600) return `${Math.floor(sec / 60)}m`
  if (sec < 86400) return `${Math.floor(sec / 3600)}h`
  return `${Math.floor(sec / 86400)}d`
}

function PoolHistory({ poolId, poolName, onClose }: { poolId: string; poolName: string; onClose: () => void }) {
  const { data: swaps, isLoading } = useLuxPoolSwapHistory(poolId)

  return (
    <HistoryPanel>
      <HistoryHeader>
        <span>Trading History — {poolName}</span>
        <CloseButton onClick={onClose}>&times;</CloseButton>
      </HistoryHeader>
      <HistoryScroll>
        <HistoryTable>
          <thead>
            <tr>
              <HistoryTh>Type</HistoryTh>
              <HistoryTh>Token 0</HistoryTh>
              <HistoryTh>Token 1</HistoryTh>
              <HistoryTh>Value</HistoryTh>
              <HistoryTh>Sender</HistoryTh>
              <HistoryTh>Time</HistoryTh>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <HistoryTd colSpan={6} style={{ textAlign: 'center', color: 'rgba(0,0,0,0.3)' }}>
                  Loading trades...
                </HistoryTd>
              </tr>
            )}
            {(swaps ?? []).map((swap) => {
              const isBuy = parseFloat(swap.amount0) < 0
              return (
                <tr key={swap.id}>
                  <HistoryTd style={{ color: isBuy ? '#16a34a' : '#dc2626' }}>{isBuy ? 'Buy' : 'Sell'}</HistoryTd>
                  <HistoryTd style={{ color: parseFloat(swap.amount0) > 0 ? '#16a34a' : '#dc2626' }}>
                    {fmtAmount(swap.amount0)}
                  </HistoryTd>
                  <HistoryTd style={{ color: parseFloat(swap.amount1) > 0 ? '#16a34a' : '#dc2626' }}>
                    {fmtAmount(swap.amount1)}
                  </HistoryTd>
                  <HistoryTd>{fmtUSD(swap.amountUSD)}</HistoryTd>
                  <HistoryTd style={{ color: 'rgba(0,0,0,0.35)' }}>
                    {swap.sender.slice(0, 6)}...{swap.sender.slice(-4)}
                  </HistoryTd>
                  <HistoryTd style={{ color: 'rgba(0,0,0,0.35)' }}>{timeAgo(swap.timestamp)}</HistoryTd>
                </tr>
              )
            })}
            {!isLoading && (!swaps || swaps.length === 0) && (
              <tr>
                <HistoryTd colSpan={6} style={{ textAlign: 'center', color: 'rgba(0,0,0,0.3)' }}>
                  No trades found
                </HistoryTd>
              </tr>
            )}
          </tbody>
        </HistoryTable>
      </HistoryScroll>
    </HistoryPanel>
  )
}

export const LuxPoolsTable = memo(function LuxPoolsTable() {
  const { data: pools, isLoading } = useLuxSubgraphPools()
  const { data: factory } = useLuxFactory()
  const [selectedPoolId, setSelectedPoolId] = useState<string | null>(null)

  const selectedPool = pools?.find((p) => p.id === selectedPoolId)

  if (isLoading) {
    return (
      <Wrapper>
        <EmptyState>Loading Lux pools...</EmptyState>
      </Wrapper>
    )
  }

  return (
    <Wrapper data-testid="top-pools-explore-table">
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
            <StatLabel>Active Pools</StatLabel>
            <StatValue>{factory.poolCount}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>All-Time Trades</StatLabel>
            <StatValue>{parseInt(factory.txCount).toLocaleString()}</StatValue>
          </StatItem>
        </StatsBar>
      )}

      <Table>
        <thead>
          <tr>
            <Th>#</Th>
            <Th style={{ textAlign: 'left' }}>Pool</Th>
            <Th>Fee</Th>
            <Th>TVL</Th>
            <Th>Volume</Th>
            <Th>Price</Th>
            <Th>Txns</Th>
          </tr>
        </thead>
        <tbody>
          {(pools ?? []).map((pool, i) => (
            <Row
              key={pool.id}
              $selected={pool.id === selectedPoolId}
              onClick={() => setSelectedPoolId(pool.id === selectedPoolId ? null : pool.id)}
            >
              <Td style={{ color: 'rgba(0,0,0,0.3)', width: 40 }}>{i + 1}</Td>
              <Td style={{ textAlign: 'left' }}>
                <PairName>{pairName(pool)}</PairName>
                <FeeBadge>{fmtFeeTier(pool.feeTier)}</FeeBadge>
              </Td>
              <Td>{fmtFeeTier(pool.feeTier)}</Td>
              <Td style={{ fontWeight: 600 }}>{fmtUSD(pool.totalValueLockedUSD)}</Td>
              <Td style={{ color: 'rgba(0,0,0,0.5)' }}>{fmtUSD(pool.volumeUSD)}</Td>
              <Td style={{ fontFamily: "'SF Mono', monospace" }}>
                {parseFloat(pool.token0Price).toFixed(6)}
              </Td>
              <Td style={{ color: 'rgba(0,0,0,0.45)' }}>{parseInt(pool.txCount).toLocaleString()}</Td>
            </Row>
          ))}
        </tbody>
      </Table>

      {(!pools || pools.length === 0) && <EmptyState>No Lux pools found</EmptyState>}

      {/* Expanded trading history for selected pool */}
      {selectedPoolId && selectedPool && (
        <PoolHistory
          poolId={selectedPoolId}
          poolName={pairName(selectedPool)}
          onClose={() => setSelectedPoolId(null)}
        />
      )}
    </Wrapper>
  )
})
