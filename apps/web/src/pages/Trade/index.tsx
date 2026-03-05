'use client'

import { useState, useMemo } from 'react'
import styled from 'styled-components'
import {
  useMarketStats,
  useOrderBook,
  useRecentTrades,
  useOpenOrders,
  usePositions,
  usePlaceOrder,
  useCancelOrder,
  useFundingRate,
  useMarginAccount,
} from 'lx/src/data/apiClients/tradingApi/dex/hooks'
import {
  OrderType,
  OrderSide,
  TimeInForce,
  MarginMode,
  type PlaceOrderRequest,
  type PriceLevel,
  type Order,
  type PerpPosition,
} from 'lx/src/data/apiClients/tradingApi/dex/types'

const DEFAULT_SYMBOL = 'LUX-USDC'

// ─── Styled Components ───────────────────────────────────────────────

const Page = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 72px);
  background: var(--surface1);
  color: var(--neutral1);
  overflow: hidden;
`

const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--surface3);
  background: var(--surface2);
  font-size: 13px;
`

const SymbolSelect = styled.select`
  background: var(--surface3);
  border: none;
  border-radius: 8px;
  color: var(--neutral1);
  padding: 6px 12px;
  font-size: 15px;
  font-weight: 700;
`

const StatValue = styled.span<{ $color?: string }>`
  font-weight: 600;
  color: ${(p) => p.$color || 'var(--neutral1)'};
`

const StatLabel = styled.span`
  color: var(--neutral2);
  margin-right: 4px;
`

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr 320px;
  flex: 1;
  overflow: hidden;
`

const Panel = styled.div`
  border-right: 1px solid var(--surface3);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`

const PanelHeader = styled.div`
  padding: 10px 12px;
  font-size: 12px;
  font-weight: 600;
  color: var(--neutral2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--surface3);
  position: sticky;
  top: 0;
  background: var(--surface1);
  z-index: 1;
`

const BookRow = styled.div<{ $side: 'bid' | 'ask' }>`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 2px 12px;
  font-size: 12px;
  font-family: monospace;
  cursor: pointer;
  &:hover {
    background: var(--surface2);
  }
  & > span:first-child {
    color: ${(p) => (p.$side === 'bid' ? 'var(--statusSuccess)' : 'var(--statusCritical)')};
  }
`

const TradeRow = styled.div<{ $side: string }>`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 2px 12px;
  font-size: 12px;
  font-family: monospace;
  & > span:first-child {
    color: ${(p) => (p.$side === 'buy' ? 'var(--statusSuccess)' : 'var(--statusCritical)')};
  }
`

const OrderFormPanel = styled.div`
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--surface3);
  overflow-y: auto;
`

const TabBar = styled.div`
  display: flex;
  border-bottom: 1px solid var(--surface3);
`

const Tab = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: 10px;
  background: ${(p) => (p.$active ? 'var(--surface2)' : 'transparent')};
  border: none;
  border-bottom: ${(p) => (p.$active ? '2px solid var(--accent1)' : '2px solid transparent')};
  color: ${(p) => (p.$active ? 'var(--neutral1)' : 'var(--neutral2)')};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
`

const SideToggle = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  padding: 12px;
`

const SideButton = styled.button<{ $side: 'buy' | 'sell'; $active: boolean }>`
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  background: ${(p) => {
    if (!p.$active) {
      return 'var(--surface3)'
    }
    return p.$side === 'buy' ? 'var(--statusSuccess)' : 'var(--statusCritical)'
  }};
  color: ${(p) => (p.$active ? '#000' : 'var(--neutral2)')};
`

const FormGroup = styled.div`
  padding: 0 12px;
  margin-bottom: 12px;
`

const FormLabel = styled.label`
  display: block;
  font-size: 11px;
  color: var(--neutral2);
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`

const FormInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  background: var(--surface3);
  border: 1px solid var(--surface3);
  border-radius: 8px;
  color: var(--neutral1);
  font-size: 14px;
  font-family: monospace;
  outline: none;
  &:focus {
    border-color: var(--accent1);
  }
`

const FormSelect = styled.select`
  width: 100%;
  padding: 10px 12px;
  background: var(--surface3);
  border: 1px solid var(--surface3);
  border-radius: 8px;
  color: var(--neutral1);
  font-size: 13px;
`

const SubmitButton = styled.button<{ $side: 'buy' | 'sell' }>`
  margin: 12px;
  padding: 14px;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  background: ${(p) => (p.$side === 'buy' ? 'var(--statusSuccess)' : 'var(--statusCritical)')};
  color: #000;
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`

const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  margin-bottom: 8px;
  font-size: 12px;
  color: var(--neutral2);
  cursor: pointer;
`

const BottomPanel = styled.div`
  border-top: 1px solid var(--surface3);
  max-height: 200px;
  overflow-y: auto;
`

const BottomTabs = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--surface3);
`

const OrderRow = styled.div`
  display: grid;
  grid-template-columns: 80px 80px 80px 100px 80px 60px 80px 1fr;
  padding: 4px 12px;
  font-size: 12px;
  font-family: monospace;
  border-bottom: 1px solid var(--surface3);
  align-items: center;
`

const PositionRow = styled.div`
  display: grid;
  grid-template-columns: 80px 60px 80px 80px 80px 100px 80px 1fr;
  padding: 4px 12px;
  font-size: 12px;
  font-family: monospace;
  border-bottom: 1px solid var(--surface3);
  align-items: center;
`

const CancelBtn = styled.button`
  background: var(--surface3);
  border: none;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 11px;
  color: var(--statusCritical);
  cursor: pointer;
`

const CenterPanel = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const LeverageRow = styled.div`
  display: flex;
  gap: 4px;
  padding: 0 12px;
  margin-bottom: 12px;
`

const LeverageBtn = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 6px;
  background: ${(p) => (p.$active ? 'var(--accent1)' : 'var(--surface3)')};
  color: ${(p) => (p.$active ? '#000' : 'var(--neutral2)')};
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
`

const MarginBadge = styled.span`
  padding: 2px 8px;
  background: var(--surface3);
  border-radius: 4px;
  font-size: 11px;
  color: var(--neutral2);
  cursor: pointer;
`

const FundingInfo = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`

// ─── Component ───────────────────────────────────────────────────────

export default function TradePage() {
  const [symbol, setSymbol] = useState(DEFAULT_SYMBOL)
  const [orderType, setOrderType] = useState<OrderType>(OrderType.Limit)
  const [side, setSide] = useState<OrderSide>(OrderSide.Buy)
  const [price, setPrice] = useState('')
  const [size, setSize] = useState('')
  const [stopPrice, setStopPrice] = useState('')
  const [takeProfit, setTakeProfit] = useState('')
  const [stopLoss, setStopLoss] = useState('')
  const [tif, setTif] = useState<TimeInForce>(TimeInForce.GTC)
  const [postOnly, setPostOnly] = useState(false)
  const [reduceOnly, setReduceOnly] = useState(false)
  const [leverage, setLeverage] = useState(1)
  const [bottomTab, setBottomTab] = useState<'orders' | 'positions' | 'history'>('orders')

  const { data: stats } = useMarketStats(symbol)
  const { data: orderBookData } = useOrderBook(symbol, 25)
  const { data: trades } = useRecentTrades(symbol, 50)
  const { data: openOrders } = useOpenOrders(symbol)
  const { data: positions } = usePositions()
  const { data: funding } = useFundingRate(symbol)
  const { data: account } = useMarginAccount()
  const placeOrder = usePlaceOrder()
  const cancelOrder = useCancelOrder()

  const asks = useMemo(() => (orderBookData?.asks ?? []).slice(0, 15).reverse(), [orderBookData])
  const bids = useMemo(() => (orderBookData?.bids ?? []).slice(0, 15), [orderBookData])

  const handleSubmit = () => {
    const req: PlaceOrderRequest = {
      symbol,
      type: orderType,
      side,
      size,
      ...(orderType !== OrderType.Market && price ? { price } : {}),
      ...(stopPrice ? { stopPrice } : {}),
      ...(takeProfit ? { takeProfit } : {}),
      ...(stopLoss ? { stopLoss } : {}),
      timeInForce: tif,
      postOnly,
      reduceOnly,
    }
    placeOrder.mutate(req)
  }

  const isFormValid = size && (orderType === OrderType.Market || price)

  const changePct = stats?.changePct24h ? parseFloat(stats.changePct24h) : 0
  const isPositive = changePct >= 0

  return (
    <Page>
      {/* Top bar with market stats */}
      <TopBar>
        <SymbolSelect value={symbol} onChange={(e) => setSymbol(e.target.value)}>
          <option value="LUX-USDC">LUX / USDC</option>
          <option value="LUX-LETH">LUX / LETH</option>
          <option value="LETH-USDC">LETH / USDC</option>
          <option value="LBTC-USDC">LBTC / USDC</option>
          <option value="ZOO-LUX">ZOO / LUX</option>
        </SymbolSelect>

        <div>
          <StatLabel>Last</StatLabel>
          <StatValue>{stats?.lastPrice ?? '—'}</StatValue>
        </div>
        <div>
          <StatLabel>24h</StatLabel>
          <StatValue $color={isPositive ? 'var(--statusSuccess)' : 'var(--statusCritical)'}>
            {stats?.changePct24h ? `${isPositive ? '+' : ''}${changePct.toFixed(2)}%` : '—'}
          </StatValue>
        </div>
        <div>
          <StatLabel>High</StatLabel>
          <StatValue>{stats?.high24h ?? '—'}</StatValue>
        </div>
        <div>
          <StatLabel>Low</StatLabel>
          <StatValue>{stats?.low24h ?? '—'}</StatValue>
        </div>
        <div>
          <StatLabel>Vol</StatLabel>
          <StatValue>{stats?.volumeUsd24h ? `$${Number(stats.volumeUsd24h).toLocaleString()}` : '—'}</StatValue>
        </div>

        <FundingInfo>
          <div>
            <StatLabel>Mark</StatLabel>
            <StatValue>{stats?.markPrice ?? '—'}</StatValue>
          </div>
          <div>
            <StatLabel>Index</StatLabel>
            <StatValue>{stats?.indexPrice ?? '—'}</StatValue>
          </div>
          <div>
            <StatLabel>Funding</StatLabel>
            <StatValue $color={funding && parseFloat(funding.rate) >= 0 ? 'var(--statusSuccess)' : 'var(--statusCritical)'}>
              {funding?.rate ? `${(parseFloat(funding.rate) * 100).toFixed(4)}%` : '—'}
            </StatValue>
          </div>
          <div>
            <StatLabel>OI</StatLabel>
            <StatValue>{stats?.openInterest ? `$${Number(stats.openInterest).toLocaleString()}` : '—'}</StatValue>
          </div>
        </FundingInfo>

        {account && (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 16 }}>
            <div>
              <StatLabel>Equity</StatLabel>
              <StatValue>{Number(account.equity).toLocaleString()} USDC</StatValue>
            </div>
            <div>
              <StatLabel>Free</StatLabel>
              <StatValue>{Number(account.freeMargin).toLocaleString()} USDC</StatValue>
            </div>
            <MarginBadge>{account.accountType.toUpperCase()}</MarginBadge>
          </div>
        )}
      </TopBar>

      <MainGrid>
        {/* Left: Order Book */}
        <Panel>
          <PanelHeader>Order Book</PanelHeader>
          <BookRow $side="ask" style={{ color: 'var(--neutral2)', fontWeight: 600, padding: '6px 12px' }}>
            <span>Price</span>
            <span style={{ textAlign: 'right' }}>Size</span>
            <span style={{ textAlign: 'right' }}>Total</span>
          </BookRow>
          {asks.map((level: PriceLevel, i: number) => (
            <BookRow key={`ask-${i}`} $side="ask" onClick={() => setPrice(level.price)}>
              <span>{level.price}</span>
              <span style={{ textAlign: 'right' }}>{level.size}</span>
              <span style={{ textAlign: 'right', color: 'var(--neutral2)' }}>{level.count}</span>
            </BookRow>
          ))}

          {/* Spread / Last Price */}
          <div
            style={{
              padding: '8px 12px',
              textAlign: 'center',
              fontWeight: 700,
              fontSize: 16,
              color: isPositive ? 'var(--statusSuccess)' : 'var(--statusCritical)',
              borderTop: '1px solid var(--surface3)',
              borderBottom: '1px solid var(--surface3)',
            }}
          >
            {stats?.lastPrice ?? '—'}
          </div>

          {bids.map((level: PriceLevel, i: number) => (
            <BookRow key={`bid-${i}`} $side="bid" onClick={() => setPrice(level.price)}>
              <span>{level.price}</span>
              <span style={{ textAlign: 'right' }}>{level.size}</span>
              <span style={{ textAlign: 'right', color: 'var(--neutral2)' }}>{level.count}</span>
            </BookRow>
          ))}

          {/* Recent Trades */}
          <PanelHeader>Recent Trades</PanelHeader>
          <TradeRow $side="buy" style={{ color: 'var(--neutral2)', fontWeight: 600, padding: '6px 12px' }}>
            <span>Price</span>
            <span style={{ textAlign: 'right' }}>Size</span>
            <span style={{ textAlign: 'right' }}>Time</span>
          </TradeRow>
          {(trades ?? []).slice(0, 20).map((t) => (
            <TradeRow key={t.id} $side={t.side}>
              <span>{t.price}</span>
              <span style={{ textAlign: 'right' }}>{t.size}</span>
              <span style={{ textAlign: 'right', color: 'var(--neutral2)' }}>
                {new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </TradeRow>
          ))}
        </Panel>

        {/* Center: Chart placeholder + bottom orders/positions */}
        <CenterPanel>
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--neutral2)',
              fontSize: 14,
              background: 'var(--surface2)',
            }}
          >
            TradingView Chart — {symbol}
          </div>

          <BottomPanel>
            <BottomTabs>
              <Tab $active={bottomTab === 'orders'} onClick={() => setBottomTab('orders')}>
                Open Orders ({openOrders?.length ?? 0})
              </Tab>
              <Tab $active={bottomTab === 'positions'} onClick={() => setBottomTab('positions')}>
                Positions ({positions?.length ?? 0})
              </Tab>
              <Tab $active={bottomTab === 'history'} onClick={() => setBottomTab('history')}>
                History
              </Tab>
            </BottomTabs>

            {bottomTab === 'orders' && (
              <div>
                <OrderRow style={{ fontWeight: 600, color: 'var(--neutral2)' }}>
                  <span>Symbol</span>
                  <span>Type</span>
                  <span>Side</span>
                  <span>Price</span>
                  <span>Size</span>
                  <span>Filled</span>
                  <span>Status</span>
                  <span></span>
                </OrderRow>
                {(openOrders ?? []).map((o: Order) => (
                  <OrderRow key={o.orderId}>
                    <span>{o.symbol}</span>
                    <span>{o.type}</span>
                    <span style={{ color: o.side === OrderSide.Buy ? 'var(--statusSuccess)' : 'var(--statusCritical)' }}>
                      {o.side.toUpperCase()}
                    </span>
                    <span>{o.price}</span>
                    <span>{o.size}</span>
                    <span>{o.filledSize}</span>
                    <span>{o.status}</span>
                    <CancelBtn onClick={() => cancelOrder.mutate({ orderId: o.orderId })}>Cancel</CancelBtn>
                  </OrderRow>
                ))}
                {(!openOrders || openOrders.length === 0) && (
                  <div style={{ padding: 16, color: 'var(--neutral2)', fontSize: 13, textAlign: 'center' }}>
                    No open orders
                  </div>
                )}
              </div>
            )}

            {bottomTab === 'positions' && (
              <div>
                <PositionRow style={{ fontWeight: 600, color: 'var(--neutral2)' }}>
                  <span>Symbol</span>
                  <span>Side</span>
                  <span>Size</span>
                  <span>Entry</span>
                  <span>Mark</span>
                  <span>PnL</span>
                  <span>Liq.</span>
                  <span>Margin</span>
                </PositionRow>
                {(positions ?? []).map((p: PerpPosition) => {
                  const pnl = parseFloat(p.unrealizedPnl)
                  return (
                    <PositionRow key={p.symbol}>
                      <span>{p.symbol}</span>
                      <span style={{ color: p.side === 'long' ? 'var(--statusSuccess)' : 'var(--statusCritical)' }}>
                        {p.side.toUpperCase()}
                      </span>
                      <span>{p.size}</span>
                      <span>{p.entryPrice}</span>
                      <span>{p.markPrice}</span>
                      <span style={{ color: pnl >= 0 ? 'var(--statusSuccess)' : 'var(--statusCritical)' }}>
                        {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}
                      </span>
                      <span>{p.liquidationPrice}</span>
                      <span>{p.margin}</span>
                    </PositionRow>
                  )
                })}
                {(!positions || positions.length === 0) && (
                  <div style={{ padding: 16, color: 'var(--neutral2)', fontSize: 13, textAlign: 'center' }}>
                    No open positions
                  </div>
                )}
              </div>
            )}
          </BottomPanel>
        </CenterPanel>

        {/* Right: Order Form */}
        <OrderFormPanel>
          <TabBar>
            {[OrderType.Limit, OrderType.Market, OrderType.Stop, OrderType.StopLimit, OrderType.Bracket].map((t) => (
              <Tab key={t} $active={orderType === t} onClick={() => setOrderType(t)}>
                {t === OrderType.StopLimit ? 'Stop Limit' : t.charAt(0).toUpperCase() + t.slice(1)}
              </Tab>
            ))}
          </TabBar>

          <SideToggle>
            <SideButton $side="buy" $active={side === OrderSide.Buy} onClick={() => setSide(OrderSide.Buy)}>
              Buy / Long
            </SideButton>
            <SideButton $side="sell" $active={side === OrderSide.Sell} onClick={() => setSide(OrderSide.Sell)}>
              Sell / Short
            </SideButton>
          </SideToggle>

          {/* Leverage selector */}
          <FormGroup>
            <FormLabel>Leverage</FormLabel>
          </FormGroup>
          <LeverageRow>
            {[1, 2, 5, 10, 25, 50, 100].map((l) => (
              <LeverageBtn key={l} $active={leverage === l} onClick={() => setLeverage(l)}>
                {l}x
              </LeverageBtn>
            ))}
          </LeverageRow>

          {/* Price input (not for market orders) */}
          {orderType !== OrderType.Market && (
            <FormGroup>
              <FormLabel>Price</FormLabel>
              <FormInput
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
              />
            </FormGroup>
          )}

          {/* Stop price (for stop, stop-limit, bracket) */}
          {(orderType === OrderType.Stop || orderType === OrderType.StopLimit || orderType === OrderType.Bracket) && (
            <FormGroup>
              <FormLabel>Stop Price</FormLabel>
              <FormInput
                type="text"
                value={stopPrice}
                onChange={(e) => setStopPrice(e.target.value)}
                placeholder="0.00"
              />
            </FormGroup>
          )}

          {/* Size */}
          <FormGroup>
            <FormLabel>Size</FormLabel>
            <FormInput
              type="text"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="0.00"
            />
          </FormGroup>

          {/* Bracket: TP/SL */}
          {orderType === OrderType.Bracket && (
            <>
              <FormGroup>
                <FormLabel>Take Profit</FormLabel>
                <FormInput
                  type="text"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(e.target.value)}
                  placeholder="0.00"
                />
              </FormGroup>
              <FormGroup>
                <FormLabel>Stop Loss</FormLabel>
                <FormInput
                  type="text"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  placeholder="0.00"
                />
              </FormGroup>
            </>
          )}

          {/* Time in Force */}
          {orderType !== OrderType.Market && (
            <FormGroup>
              <FormLabel>Time in Force</FormLabel>
              <FormSelect value={tif} onChange={(e) => setTif(e.target.value as TimeInForce)}>
                <option value={TimeInForce.GTC}>Good Till Cancelled</option>
                <option value={TimeInForce.IOC}>Immediate or Cancel</option>
                <option value={TimeInForce.FOK}>Fill or Kill</option>
                <option value={TimeInForce.PostOnly}>Post Only</option>
              </FormSelect>
            </FormGroup>
          )}

          {/* Flags */}
          <CheckboxRow>
            <input type="checkbox" checked={postOnly} onChange={(e) => setPostOnly(e.target.checked)} />
            Post Only
          </CheckboxRow>
          <CheckboxRow>
            <input type="checkbox" checked={reduceOnly} onChange={(e) => setReduceOnly(e.target.checked)} />
            Reduce Only
          </CheckboxRow>

          {/* Order summary */}
          {isFormValid && (
            <div style={{ padding: '0 12px', marginBottom: 8, fontSize: 12, color: 'var(--neutral2)' }}>
              {orderType === OrderType.Market ? 'Market' : `${price}`} &times; {size} = ~
              {orderType === OrderType.Market ? '—' : (parseFloat(price || '0') * parseFloat(size || '0')).toFixed(2)}{' '}
              USDC &middot; {leverage}x leverage
            </div>
          )}

          <SubmitButton
            $side={side === OrderSide.Buy ? 'buy' : 'sell'}
            disabled={!isFormValid || placeOrder.isPending}
            onClick={handleSubmit}
          >
            {placeOrder.isPending
              ? 'Placing...'
              : `${side === OrderSide.Buy ? 'Buy / Long' : 'Sell / Short'} ${symbol.split('-')[0]}`}
          </SubmitButton>

          {placeOrder.isError && (
            <div style={{ padding: '0 12px', fontSize: 12, color: 'var(--statusCritical)' }}>
              {placeOrder.error?.message ?? 'Order failed'}
            </div>
          )}
        </OrderFormPanel>
      </MainGrid>
    </Page>
  )
}
