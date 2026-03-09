'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { useQuery } from '@tanstack/react-query'
import { createChart, ColorType, type IChartApi } from 'lightweight-charts'
import { useNavigate } from 'react-router'
import { useAccount } from '~/hooks/useAccount'
import { useAccountDrawer } from '~/components/AccountDrawer/MiniPortfolio/hooks'

// Shared theme tokens (canonical source: packages/ui/src/components/{charts,trading}/theme.ts)
import { tradingColors } from '~/theme/tradingTheme'
import { chartColors, getChartOptions, getCandlestickOptions, getVolumeOptions } from '~/theme/chartTheme'

// ─── Constants ──────────────────────────────────────────────────────

const SUBGRAPH_URL = 'https://api-exchange.lux.network/subgraph/v3'

// ─── Subgraph Types ─────────────────────────────────────────────────

interface SGToken {
  id: string
  symbol: string
  name: string
  decimals: string
}

interface SGPool {
  id: string
  token0: SGToken
  token1: SGToken
  feeTier: string
  liquidity: string
  totalValueLockedUSD: string
  volumeUSD: string
  token0Price: string
  token1Price: string
  txCount: string
}

interface SGSwap {
  id: string
  timestamp: string
  amount0: string
  amount1: string
  amountUSD: string
  sender: string
}

interface SGPoolDayData {
  date: number
  volumeUSD: string
  tvlUSD: string
  open: string
  high: string
  low: string
  close: string
}

interface SGFactory {
  poolCount: string
  txCount: string
  totalVolumeUSD: string
  totalValueLockedUSD: string
}

// ─── Subgraph Query Helper ──────────────────────────────────────────

async function sgQuery<T>(query: string): Promise<T> {
  const res = await fetch(SUBGRAPH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })
  const json = await res.json()
  if (json.errors) {
    throw new Error(json.errors[0].message)
  }
  return json.data
}

// ─── React Query Hooks ──────────────────────────────────────────────

function usePools() {
  return useQuery({
    queryKey: ['v3-pools'],
    queryFn: () =>
      sgQuery<{ pools: SGPool[] }>(`{
        pools(first: 30, orderBy: totalValueLockedUSD, orderDirection: desc) {
          id token0 { id symbol name decimals } token1 { id symbol name decimals }
          feeTier liquidity totalValueLockedUSD volumeUSD token0Price token1Price txCount
        }
      }`),
    refetchInterval: 15000,
    select: (d) => d.pools,
  })
}

function usePoolDayData(poolId: string) {
  return useQuery({
    queryKey: ['v3-pool-day', poolId],
    queryFn: () =>
      sgQuery<{ poolDayDatas: SGPoolDayData[] }>(`{
        poolDayDatas(first: 90, orderBy: date, orderDirection: desc, where: { pool: "${poolId}" }) {
          date volumeUSD tvlUSD open high low close
        }
      }`),
    select: (d) => d.poolDayDatas.slice().reverse(),
    refetchInterval: 60000,
    enabled: !!poolId,
  })
}

function usePoolSwaps(poolId: string) {
  return useQuery({
    queryKey: ['v3-swaps', poolId],
    queryFn: () =>
      sgQuery<{ swaps: SGSwap[] }>(`{
        swaps(first: 50, orderBy: timestamp, orderDirection: desc, where: { pool: "${poolId}" }) {
          id timestamp amount0 amount1 amountUSD sender
        }
      }`),
    select: (d) => d.swaps,
    refetchInterval: 10000,
    enabled: !!poolId,
  })
}

function useFactory() {
  return useQuery({
    queryKey: ['v3-factory'],
    queryFn: () =>
      sgQuery<{ factories: SGFactory[] }>(`{
        factories(first: 1) { poolCount txCount totalVolumeUSD totalValueLockedUSD }
      }`),
    select: (d) => d.factories[0],
    refetchInterval: 30000,
  })
}

// ─── Format Utilities ───────────────────────────────────────────────

function fmtPrice(value: string | number): string {
  const n = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(n) || n === 0) return '0.00'
  const abs = Math.abs(n)
  if (abs >= 1e6) return n.toLocaleString(undefined, { maximumFractionDigits: 0 })
  if (abs >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 2 })
  if (abs >= 1) return n.toFixed(4)
  if (abs >= 0.001) return n.toFixed(6)
  if (abs >= 0.000001) return n.toFixed(9)
  return n.toExponential(4)
}

function fmtUSD(value: string | number): string {
  const n = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(n)) return '$0'
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
  const n = parseInt(fee) / 10000
  return `${n}%`
}

function pairName(pool: SGPool): string {
  const t0 = pool.token0.symbol.replace(/^W/, '')
  const t1 = pool.token1.symbol.replace(/^W/, '')
  return `${t0}/${t1}`
}

function timeAgo(ts: string): string {
  const sec = Math.floor(Date.now() / 1000 - parseInt(ts))
  if (sec < 60) return `${sec}s`
  if (sec < 3600) return `${Math.floor(sec / 60)}m`
  if (sec < 86400) return `${Math.floor(sec / 3600)}h`
  return `${Math.floor(sec / 86400)}d`
}

// ─── Animations ─────────────────────────────────────────────────────

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`

const fadeInRow = keyframes`
  from { opacity: 0; transform: translateX(-4px); }
  to { opacity: 1; transform: translateX(0); }
`

const pulseGlow = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
`

// ─── Chart Component ────────────────────────────────────────────────

function PriceChart({ data }: { data: SGPoolDayData[] | undefined }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const opts = getChartOptions()
    const chart = createChart(containerRef.current, {
      ...opts,
      layout: {
        ...opts.layout,
        background: { type: ColorType.Solid, color: opts.layout.background.color },
      },
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    })

    const candleOpts = getCandlestickOptions()
    const candleSeries = chart.addCandlestickSeries(candleOpts)

    const volOpts = getVolumeOptions()
    const volumeSeries = chart.addHistogramSeries(volOpts)
    volumeSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.85, bottom: 0 },
    })

    if (data?.length) {
      candleSeries.setData(
        data.map((d) => ({
          time: d.date as any,
          open: parseFloat(d.open),
          high: parseFloat(d.high),
          low: parseFloat(d.low),
          close: parseFloat(d.close),
        })),
      )
      volumeSeries.setData(
        data.map((d) => ({
          time: d.date as any,
          value: parseFloat(d.volumeUSD),
          color:
            parseFloat(d.close) >= parseFloat(d.open)
              ? chartColors.upMuted
              : chartColors.downMuted,
        })),
      )
      chart.timeScale().fitContent()
    }

    chartRef.current = chart

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        chart.applyOptions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        })
      }
    })
    ro.observe(containerRef.current)

    return () => {
      ro.disconnect()
      chart.remove()
      chartRef.current = null
    }
  }, [data])

  return <ChartContainer ref={containerRef} />
}

// ─── Styled Components ──────────────────────────────────────────────

const Page = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 72px);
  width: 100vw;
  max-width: 100vw;
  background: ${tradingColors.bgPrimary};
  color: ${tradingColors.textPrimary};
  overflow: hidden;
  position: fixed;
  top: 72px;
  left: 0;
  z-index: 1;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  animation: ${fadeIn} 0.3s ease;
  -webkit-font-smoothing: antialiased;
`

const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 0 20px;
  height: 52px;
  border-bottom: 1px solid ${tradingColors.border};
  font-size: 13px;
  flex-shrink: 0;
  animation: ${slideUp} 0.3s ease;
`

const PairSelector = styled.select`
  background: transparent;
  border: none;
  color: ${tradingColors.textPrimary};
  padding: 6px 0;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  outline: none;
  letter-spacing: -0.02em;
  appearance: none;

  option {
    background: #111;
    color: ${tradingColors.textPrimary};
  }
`

const StatGroup = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
`

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`

const StatLabel = styled.span`
  font-size: 10px;
  color: ${tradingColors.textTertiary};
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-weight: 500;
`

const StatValue = styled.span<{ $color?: string }>`
  font-size: 13px;
  font-weight: 600;
  color: ${(p) => p.$color || 'rgba(255,255,255,0.8)'};
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
  transition: color 0.3s ease;
`

const FeeBadge = styled.span`
  padding: 3px 8px;
  background: ${tradingColors.bgHover};
  color: ${tradingColors.textSecondary};
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
`

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr 320px;
  flex: 1;
  overflow: hidden;
  min-height: 0;
`

const LeftPanel = styled.div`
  border-right: 1px solid ${tradingColors.border};
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.4s ease 0.1s both;

  &::-webkit-scrollbar { width: 0; }
`

const CenterPanel = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
  animation: ${fadeIn} 0.4s ease 0.15s both;
`

const RightPanel = styled.div`
  border-left: 1px solid ${tradingColors.border};
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.4s ease 0.2s both;

  &::-webkit-scrollbar { width: 0; }
`

const PanelHeader = styled.div`
  padding: 14px 16px 10px;
  font-size: 11px;
  font-weight: 600;
  color: ${tradingColors.textTertiary};
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid ${tradingColors.border};
  position: sticky;
  top: 0;
  background: ${tradingColors.bgPrimary};
  z-index: 2;
`

const ChartContainer = styled.div`
  flex: 1;
  min-height: 300px;
  animation: ${fadeIn} 0.5s ease 0.2s both;
`

// ─── Trade Rows ─────────────────────────────────────────────────────

const TradeRow = styled.div<{ $isSell?: boolean; $index?: number }>`
  display: grid;
  grid-template-columns: 1fr 1fr 52px;
  padding: 4px 16px;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  font-family: 'SF Mono', 'Fira Code', 'JetBrains Mono', monospace;
  cursor: default;
  transition: background 0.15s ease;
  animation: ${fadeInRow} 0.2s ease ${(p) => ((p.$index ?? 0) * 0.02)}s both;

  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }

  & > span:first-child {
    color: ${(p) => (p.$isSell ? tradingColors.sell : tradingColors.buy)};
  }
`

const TradeHeaderRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 52px;
  padding: 8px 16px;
  font-size: 10px;
  font-weight: 600;
  color: ${tradingColors.textTertiary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

// ─── Swap Widget ────────────────────────────────────────────────────

const SwapWidget = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 20px;
  gap: 0;
  animation: ${slideUp} 0.35s ease 0.25s both;
`

const SwapHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`

const SwapTitle = styled.span`
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.02em;
`

const BuySellToggle = styled.div`
  display: flex;
  background: ${tradingColors.bgHover};
  border-radius: 10px;
  padding: 3px;
  gap: 2px;
`

const ToggleBtn = styled.button<{ $active?: boolean; $variant?: 'buy' | 'sell' }>`
  padding: 6px 16px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${(p) =>
    p.$active
      ? p.$variant === 'sell'
        ? tradingColors.sellMuted
        : tradingColors.buyMuted
      : 'transparent'};
  color: ${(p) =>
    p.$active
      ? p.$variant === 'sell'
        ? tradingColors.sell
        : tradingColors.buy
      : tradingColors.textTertiary};

  &:hover {
    color: ${(p) =>
      p.$active
        ? undefined
        : tradingColors.textSecondary};
  }
`

const SwapBody = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
`

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const InputBlock = styled.div<{ $focused?: boolean }>`
  padding: 16px;
  background: ${tradingColors.bgSecondary};
  border: 1px solid ${(p) => (p.$focused ? tradingColors.borderFocus : 'rgba(255,255,255,0.04)')};
  border-radius: 16px;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.08);
  }
`

const InputLabel = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.35);
  font-weight: 500;
  margin-bottom: 8px;
`

const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const AmountInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: ${tradingColors.textPrimary};
  font-size: 28px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
  outline: none;
  min-width: 0;
  transition: opacity 0.2s ease;

  &::placeholder {
    color: ${tradingColors.textMuted};
  }

  &:disabled {
    opacity: 0.3;
  }
`

const TokenPill = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: ${tradingColors.border};
  border-radius: 100px;
  font-size: 15px;
  font-weight: 700;
  color: ${tradingColors.textPrimary};
  white-space: nowrap;
  flex-shrink: 0;
  transition: background 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`

const SwapArrowBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 12px;
  border: 1px solid ${tradingColors.border};
  background: #111;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: -14px auto;
  position: relative;
  z-index: 1;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: #1a1a1a;
    border-color: ${tradingColors.borderFocus};
    transform: rotate(180deg);
  }

  svg {
    transition: inherit;
  }
`

const RateInfo = styled.div`
  text-align: center;
  padding: 8px 0 0;
  font-size: 12px;
  color: ${tradingColors.textTertiary};
  font-variant-numeric: tabular-nums;
  animation: ${fadeIn} 0.2s ease;
`

const ActionArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 16px;
`

const PrimaryBtn = styled.button<{ $disabled?: boolean }>`
  width: 100%;
  padding: 18px;
  border: none;
  border-radius: 14px;
  font-weight: 600;
  font-size: 16px;
  letter-spacing: -0.01em;
  cursor: ${(p) => (p.$disabled ? 'default' : 'pointer')};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  ${(p) =>
    p.$disabled
      ? css`
          background: ${tradingColors.bgHover};
          color: rgba(255, 255, 255, 0.2);
        `
      : css`
          background: ${tradingColors.textPrimary};
          color: ${tradingColors.bgPrimary};

          &:hover {
            background: rgba(255, 255, 255, 0.92);
            transform: translateY(-1px);
            box-shadow: 0 4px 20px rgba(255, 255, 255, 0.1);
          }

          &:active {
            transform: translateY(0);
            background: rgba(255, 255, 255, 0.85);
          }
        `}
`

const ConnectBtn = styled.button`
  width: 100%;
  padding: 18px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  font-weight: 600;
  font-size: 16px;
  letter-spacing: -0.01em;
  cursor: pointer;
  background: transparent;
  color: ${tradingColors.textPrimary};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: ${tradingColors.bgHover};
    border-color: rgba(255, 255, 255, 0.18);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`

// ─── Bottom Panel ───────────────────────────────────────────────────

const BottomPanel = styled.div`
  border-top: 1px solid ${tradingColors.border};
  max-height: 220px;
  overflow-y: auto;
  flex-shrink: 0;
  animation: ${slideUp} 0.3s ease 0.3s both;

  &::-webkit-scrollbar { width: 0; }
`

const BottomTabs = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 1px solid ${tradingColors.border};
  position: sticky;
  top: 0;
  background: ${tradingColors.bgPrimary};
  z-index: 2;
`

const Tab = styled.button<{ $active?: boolean }>`
  padding: 12px 20px;
  background: transparent;
  border: none;
  border-bottom: 2px solid ${(p) => (p.$active ? tradingColors.textPrimary : 'transparent')};
  color: ${(p) => (p.$active ? tradingColors.textPrimary : tradingColors.textTertiary)};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: 0.02em;

  &:hover {
    color: ${(p) => (p.$active ? tradingColors.textPrimary : tradingColors.textSecondary)};
  }
`

const TableRow = styled.div<{ $clickable?: boolean; $selected?: boolean }>`
  display: grid;
  grid-template-columns: 160px 80px 110px 110px 100px 80px 1fr;
  padding: 8px 20px;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);
  cursor: ${(p) => (p.$clickable ? 'pointer' : 'default')};
  transition: background 0.15s ease;
  background: ${(p) => (p.$selected ? tradingColors.bgSecondary : 'transparent')};

  &:hover {
    background: ${(p) => (p.$clickable ? tradingColors.bgSecondary : 'transparent')};
  }
`

const TableHeader = styled(TableRow)`
  color: ${tradingColors.textTertiary};
  font-weight: 600;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  position: sticky;
  top: 42px;
  background: ${tradingColors.bgPrimary};
  z-index: 1;
  border-bottom: 1px solid ${tradingColors.border};
  cursor: default;
  &:hover { background: ${tradingColors.bgPrimary}; }
`

const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.2);
  font-size: 13px;
  animation: ${fadeIn} 0.3s ease;
`

const LiveDot = styled.span`
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${tradingColors.buy};
  animation: ${pulseGlow} 2s ease-in-out infinite;
  margin-right: 6px;
`

const LoadingSkeleton = styled.div`
  height: 100%;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.15);
  font-size: 14px;
  animation: ${fadeIn} 0.3s ease;
`

const PriceRef = styled.div`
  padding: 16px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.35);
  line-height: 1.8;
  font-variant-numeric: tabular-nums;
  animation: ${fadeIn} 0.3s ease;
`

const Separator = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.04);
`

// ─── Arrow Icon ─────────────────────────────────────────────────────

const ArrowDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M7 2.5v9m0 0L4 8.5m3 3l3-3"
      stroke="rgba(255,255,255,0.5)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// ─── Main Component ─────────────────────────────────────────────────

export default function TradePage() {
  const navigate = useNavigate()
  const { data: pools, isLoading: poolsLoading } = usePools()
  const { data: factory } = useFactory()

  const account = useAccount()
  const accountDrawer = useAccountDrawer()
  const isConnected = !!account.address

  const [selectedPoolId, setSelectedPoolId] = useState<string>('')
  const [inputAmount, setInputAmount] = useState('')
  const [bottomTab, setBottomTab] = useState<'pools' | 'trades'>('pools')
  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const [payFocused, setPayFocused] = useState(false)

  // Select first pool by default
  const selectedPool = useMemo(() => {
    if (!pools?.length) return undefined
    if (selectedPoolId) return pools.find((p) => p.id === selectedPoolId) ?? pools[0]
    return pools[0]
  }, [pools, selectedPoolId])

  useEffect(() => {
    if (pools?.length && !selectedPoolId) {
      setSelectedPoolId(pools[0].id)
    }
  }, [pools, selectedPoolId])

  const poolId = selectedPool?.id ?? ''
  const { data: dayData } = usePoolDayData(poolId)
  const { data: swaps } = usePoolSwaps(poolId)

  const priceChange = useMemo(() => {
    if (!dayData || dayData.length < 2) return null
    const latest = parseFloat(dayData[dayData.length - 1].close)
    const prev = parseFloat(dayData[dayData.length - 2].close)
    if (prev === 0) return null
    const pct = ((latest - prev) / prev) * 100
    return { pct, isPositive: pct >= 0 }
  }, [dayData])

  const estimatedOutput = useMemo(() => {
    if (!inputAmount || !selectedPool) return ''
    const amt = parseFloat(inputAmount)
    if (isNaN(amt) || amt <= 0) return ''
    const price = parseFloat(side === 'buy' ? selectedPool.token0Price : selectedPool.token1Price)
    if (price === 0) return ''
    return (amt * price).toFixed(6)
  }, [inputAmount, selectedPool, side])

  const payToken = side === 'buy' ? selectedPool?.token0 : selectedPool?.token1
  const receiveToken = side === 'buy' ? selectedPool?.token1 : selectedPool?.token0

  const handleSwap = useCallback(() => {
    if (!selectedPool) return
    const params = new URLSearchParams({
      inputCurrency: side === 'buy' ? selectedPool.token0.id : selectedPool.token1.id,
      outputCurrency: side === 'buy' ? selectedPool.token1.id : selectedPool.token0.id,
    })
    navigate(`/swap?${params.toString()}`)
  }, [selectedPool, navigate, side])

  if (poolsLoading) {
    return (
      <Page>
        <LoadingSkeleton>Loading...</LoadingSkeleton>
      </Page>
    )
  }

  return (
    <Page>
      {/* ─── Top Bar ────────────────────────────────────────────── */}
      <TopBar>
        <PairSelector value={selectedPoolId} onChange={(e) => setSelectedPoolId(e.target.value)}>
          {(pools ?? []).map((pool) => (
            <option key={pool.id} value={pool.id}>
              {pairName(pool)} {fmtFeeTier(pool.feeTier)}
            </option>
          ))}
        </PairSelector>

        {selectedPool && (
          <StatGroup>
            <Stat>
              <StatLabel>Price</StatLabel>
              <StatValue>{fmtPrice(selectedPool.token0Price)}</StatValue>
            </Stat>
            {priceChange && (
              <Stat>
                <StatLabel>24h</StatLabel>
                <StatValue $color={priceChange.isPositive ? tradingColors.buy : tradingColors.sell}>
                  {priceChange.isPositive ? '+' : ''}
                  {priceChange.pct.toFixed(2)}%
                </StatValue>
              </Stat>
            )}
            <Stat>
              <StatLabel>TVL</StatLabel>
              <StatValue>{fmtUSD(selectedPool.totalValueLockedUSD)}</StatValue>
            </Stat>
            <Stat>
              <StatLabel>Volume</StatLabel>
              <StatValue>{fmtUSD(selectedPool.volumeUSD)}</StatValue>
            </Stat>
            <FeeBadge>{fmtFeeTier(selectedPool.feeTier)}</FeeBadge>
          </StatGroup>
        )}

        {factory && (
          <StatGroup style={{ marginLeft: 'auto' }}>
            <Stat>
              <StatLabel>TVL</StatLabel>
              <StatValue>{fmtUSD(factory.totalValueLockedUSD)}</StatValue>
            </Stat>
            <Stat>
              <StatLabel>Pools</StatLabel>
              <StatValue>{factory.poolCount}</StatValue>
            </Stat>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <LiveDot />
              <span style={{ fontSize: 11, color: tradingColors.textTertiary, fontWeight: 500 }}>Live</span>
            </div>
          </StatGroup>
        )}
      </TopBar>

      {/* ─── Main Grid ──────────────────────────────────────────── */}
      <MainGrid>
        {/* Left: Recent Trades */}
        <LeftPanel>
          <PanelHeader>Trades</PanelHeader>
          <TradeHeaderRow>
            <span>Price</span>
            <span style={{ textAlign: 'right' }}>Amount</span>
            <span style={{ textAlign: 'right' }}>Time</span>
          </TradeHeaderRow>
          {(swaps ?? []).map((swap, i) => {
            const amt0 = parseFloat(swap.amount0)
            const amt1 = parseFloat(swap.amount1)
            const isSell = amt0 > 0
            const price = amt1 !== 0 ? Math.abs(amt0 / amt1) : 0
            return (
              <TradeRow key={swap.id} $isSell={isSell} $index={i}>
                <span>{fmtPrice(price)}</span>
                <span style={{ textAlign: 'right', color: 'rgba(255,255,255,0.45)' }}>
                  {fmtAmount(swap.amount0)}
                </span>
                <span style={{ textAlign: 'right', color: 'rgba(255,255,255,0.2)' }}>
                  {timeAgo(swap.timestamp)}
                </span>
              </TradeRow>
            )
          })}
          {(!swaps || swaps.length === 0) && <EmptyState>No recent trades</EmptyState>}

          <Separator />

          {selectedPool && (
            <PriceRef>
              <div>
                1 {selectedPool.token0.symbol} = {fmtPrice(selectedPool.token0Price)}{' '}
                {selectedPool.token1.symbol}
              </div>
              <div>
                1 {selectedPool.token1.symbol} = {fmtPrice(selectedPool.token1Price)}{' '}
                {selectedPool.token0.symbol}
              </div>
            </PriceRef>
          )}
        </LeftPanel>

        {/* Center: Chart + Bottom Tables */}
        <CenterPanel>
          <PriceChart data={dayData} />

          <BottomPanel>
            <BottomTabs>
              <Tab $active={bottomTab === 'pools'} onClick={() => setBottomTab('pools')}>
                Pools ({pools?.length ?? 0})
              </Tab>
              <Tab $active={bottomTab === 'trades'} onClick={() => setBottomTab('trades')}>
                History
              </Tab>
            </BottomTabs>

            {bottomTab === 'pools' && (
              <div>
                <TableHeader>
                  <span>Pool</span>
                  <span>Fee</span>
                  <span style={{ textAlign: 'right' }}>TVL</span>
                  <span style={{ textAlign: 'right' }}>Volume</span>
                  <span style={{ textAlign: 'right' }}>Price</span>
                  <span style={{ textAlign: 'right' }}>Txns</span>
                  <span />
                </TableHeader>
                {(pools ?? []).map((pool) => (
                  <TableRow
                    key={pool.id}
                    $clickable
                    $selected={pool.id === selectedPoolId}
                    onClick={() => setSelectedPoolId(pool.id)}
                  >
                    <span style={{ fontWeight: pool.id === selectedPoolId ? 600 : 400 }}>
                      {pairName(pool)}
                    </span>
                    <span>
                      <FeeBadge>{fmtFeeTier(pool.feeTier)}</FeeBadge>
                    </span>
                    <span style={{ textAlign: 'right', fontWeight: 500 }}>
                      {fmtUSD(pool.totalValueLockedUSD)}
                    </span>
                    <span style={{ textAlign: 'right', color: 'rgba(255,255,255,0.4)' }}>
                      {fmtUSD(pool.volumeUSD)}
                    </span>
                    <span
                      style={{
                        textAlign: 'right',
                        fontFamily: "'SF Mono', monospace",
                        fontSize: 11,
                      }}
                    >
                      {fmtPrice(pool.token0Price)}
                    </span>
                    <span style={{ textAlign: 'right', color: tradingColors.textTertiary }}>
                      {parseInt(pool.txCount).toLocaleString()}
                    </span>
                    <span />
                  </TableRow>
                ))}
              </div>
            )}

            {bottomTab === 'trades' && (
              <div>
                <TableHeader>
                  <span>Pair</span>
                  <span>Token 0</span>
                  <span style={{ textAlign: 'right' }}>Token 1</span>
                  <span style={{ textAlign: 'right' }}>Value</span>
                  <span style={{ textAlign: 'right' }}>Sender</span>
                  <span style={{ textAlign: 'right' }}>Time</span>
                  <span />
                </TableHeader>
                {(swaps ?? []).map((swap) => (
                  <TableRow key={swap.id}>
                    <span>{selectedPool ? pairName(selectedPool) : '—'}</span>
                    <span
                      style={{ color: parseFloat(swap.amount0) > 0 ? tradingColors.buy : tradingColors.sell }}
                    >
                      {fmtAmount(swap.amount0)}
                    </span>
                    <span
                      style={{
                        textAlign: 'right',
                        color: parseFloat(swap.amount1) > 0 ? tradingColors.buy : tradingColors.sell,
                      }}
                    >
                      {fmtAmount(swap.amount1)}
                    </span>
                    <span style={{ textAlign: 'right' }}>{fmtUSD(swap.amountUSD)}</span>
                    <span style={{ textAlign: 'right', color: tradingColors.textTertiary }}>
                      {swap.sender.slice(0, 6)}...{swap.sender.slice(-4)}
                    </span>
                    <span style={{ textAlign: 'right', color: tradingColors.textTertiary }}>
                      {timeAgo(swap.timestamp)}
                    </span>
                    <span />
                  </TableRow>
                ))}
              </div>
            )}
          </BottomPanel>
        </CenterPanel>

        {/* Right: Swap Widget */}
        <RightPanel>
          <SwapWidget>
            <SwapHeader>
              <SwapTitle>Trade</SwapTitle>
              <BuySellToggle>
                <ToggleBtn
                  $active={side === 'buy'}
                  $variant="buy"
                  onClick={() => setSide('buy')}
                >
                  Buy
                </ToggleBtn>
                <ToggleBtn
                  $active={side === 'sell'}
                  $variant="sell"
                  onClick={() => setSide('sell')}
                >
                  Sell
                </ToggleBtn>
              </BuySellToggle>
            </SwapHeader>

            <SwapBody>
              <InputSection>
                <InputBlock $focused={payFocused}>
                  <InputLabel>You pay</InputLabel>
                  <InputRow>
                    <AmountInput
                      type="text"
                      inputMode="decimal"
                      placeholder="0"
                      value={inputAmount}
                      disabled={!isConnected}
                      onFocus={() => setPayFocused(true)}
                      onBlur={() => setPayFocused(false)}
                      onChange={(e) => {
                        const val = e.target.value
                        if (/^[0-9]*[.,]?[0-9]*$/.test(val)) {
                          setInputAmount(val)
                        }
                      }}
                    />
                    <TokenPill>{payToken?.symbol ?? '—'}</TokenPill>
                  </InputRow>
                </InputBlock>

                <SwapArrowBtn
                  onClick={() => setSide(side === 'buy' ? 'sell' : 'buy')}
                  type="button"
                >
                  <ArrowDownIcon />
                </SwapArrowBtn>

                <InputBlock>
                  <InputLabel>You receive</InputLabel>
                  <InputRow>
                    <AmountInput
                      type="text"
                      placeholder="0"
                      value={estimatedOutput}
                      readOnly
                      disabled
                      style={{ opacity: estimatedOutput ? 0.8 : 0.2 }}
                    />
                    <TokenPill>{receiveToken?.symbol ?? '—'}</TokenPill>
                  </InputRow>
                </InputBlock>

                {inputAmount && estimatedOutput && selectedPool && (
                  <RateInfo>
                    1 {payToken?.symbol} = {fmtPrice(side === 'buy' ? selectedPool.token0Price : selectedPool.token1Price)}{' '}
                    {receiveToken?.symbol}
                  </RateInfo>
                )}
              </InputSection>

              <ActionArea>
                {!isConnected ? (
                  <ConnectBtn onClick={accountDrawer.open}>Connect wallet</ConnectBtn>
                ) : (
                  <PrimaryBtn
                    $disabled={!inputAmount || !estimatedOutput}
                    onClick={!inputAmount || !estimatedOutput ? undefined : handleSwap}
                  >
                    {!inputAmount
                      ? 'Enter an amount'
                      : side === 'buy'
                        ? `Buy ${receiveToken?.symbol ?? ''}`
                        : `Sell ${payToken?.symbol ?? ''}`}
                  </PrimaryBtn>
                )}
              </ActionArea>
            </SwapBody>
          </SwapWidget>
        </RightPanel>
      </MainGrid>
    </Page>
  )
}
